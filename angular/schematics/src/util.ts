import { Tree } from '@angular-devkit/schematics';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { normalize } from 'path';

import ts = require('typescript');

export const util = {
    findSource: (tree: Tree, path: string): ts.SourceFile | void => {
        try {
            const file = tree?.read(normalize(path))?.toString('utf-8') || '';
            if (file)
                return ts.createSourceFile(
                    path,
                    file,
                    ts.ScriptTarget.Latest,
                    true
                );
        } catch {
            return;
        }
    },
    findItem: (tree: Tree, possiblePaths: string[]) => {
        for (const path of possiblePaths) {
            const source = util.findSource(tree, normalize(path));
            if (source) return { source, path };
        }
        return null;
    },
    nxAppExists: (tree: Tree, appName = '') => {
        const nxAppDirectory = `apps/${appName}`;
        const nxAppProjectJson = `${nxAppDirectory}/project.json`;
        try {
            tree.readJson(normalize(nxAppProjectJson));
            return nxAppDirectory;
        } catch {
            return null;
        }
    },
    regularAppExists: (tree: Tree, appName = '') => {
        const regularEntryFile = `src/main.ts`;
        try {
            if (!appName)
                return tree.read(normalize(regularEntryFile)) !== null
                    ? '/'
                    : null;
            const projectDirectory = `projects/${appName}`;
            return tree.read(
                normalize(`${projectDirectory}/${regularEntryFile}`)
            ) !== null
                ? projectDirectory
                : null;
        } catch {
            return null;
        }
    },
    getIndexHtml: (tree: Tree, name = '') =>
        util.findItem(tree, [
            `./projects/${name}/src/index.html`,
            `./apps/${name}/src/index.html`,
            './src/index.html',
        ]),
    getMainModule: (tree: Tree, name = '') =>
        util.findItem(tree, [
            `./projects/${name}/src/main.ts`,
            `./apps/${name}/src/bootstrap.ts`,
            `./apps/${name}/src/main.ts`,
            './src/main.ts',
        ]),
    getAppModule: (tree: Tree, name = '') =>
        util.findItem(tree, [
            `./projects/${name}/src/app/app.module.ts`,
            `./apps/${name}/src/app/app.module.ts`,
            './src/app/app.module.ts',
        ]),
    getAppComponent: (tree: Tree, name = '') =>
        util.findItem(tree, [
            `./projects/${name}/src/app/app.component.ts`,
            `./apps/${name}/src/app/app.component.ts`,
            './src/app/app.component.ts',
        ]),
    getAppRoutingModule: (tree: Tree, name = '') =>
        util.findItem(tree, [
            `./projects/${name}/src/app/app-routing.module.ts`,
            `./apps/${name}/src/app/app-routing.module.ts`,
            `./apps/${name}/src/app/app.routes.ts`,
            './src/app/app-routing.module.ts',
        ]),
    isImported: (
        tree: Tree,
        filePath: string,
        symbolName: string,
        importPath: string
    ): boolean => {
        const content = tree.read(filePath);
        if (content) {
            const regExp = new RegExp(
                `import.*\\b${symbolName}\\b.*from.*['"]${importPath}['"];`,
                'g'
            );
            return regExp.test(content.toString());
        }
        return false;
    },
    addLazyLoadedRoute: (
        tree: Tree,
        appRoutingModulePath: string,
        routName: string,
        importPath: string,
        moduleName: string
    ): void => {
        const moduleRecorder = tree.beginUpdate(appRoutingModulePath);
        const moduleSource = util.findSource(tree, appRoutingModulePath);
        if (!moduleSource) return;
        const moduleContent = moduleSource?.getFullText() || '';
        const routeEntriesRegex = /:\s*Routes\s*=\s*\[/;
        const nxRouteEntriesRegex = /:\s*Route\s*\[\]\s*=\s*\[/;
        const normalMatch = moduleContent?.match(routeEntriesRegex);
        const nxMatch = moduleContent?.match(nxRouteEntriesRegex);
        const routeEntriesMatch = normalMatch || nxMatch || null;
        const routeRegex = new RegExp(
            `{\\s*path:\\s*'${routName}'\\s*,\\s*loadChildren:`
        );
        if (!routeRegex.test(moduleContent) && routeEntriesMatch) {
            const lazyEntry = `\n\t{\n\t\tpath: '${routName}',\n\t\tloadChildren: () => import('${importPath}').then((m) => m.${moduleName}),\n\t},`;
            const routeEntriesEnd =
                (routeEntriesMatch?.index || 0) +
                (routeEntriesMatch[0].length || 0);
            moduleRecorder.insertRight(routeEntriesEnd, lazyEntry);
            tree.commitUpdate(moduleRecorder);
        }
    },
    addCustomElementSchema: (tree: Tree, modulePath: string): void => {
        const moduleRecorder = tree.beginUpdate(modulePath);
        const moduleSource = util.findSource(tree, modulePath);
        if (!moduleSource) return;
        const moduleContent = moduleSource?.getFullText() || '';
        const schema = 'CUSTOM_ELEMENTS_SCHEMA';
        const schemaSource = '@angular/core';
        const ngModuleRegex = /@NgModule\s*\({/;
        const ngModuleMatch = moduleContent?.match(ngModuleRegex);
        if (ngModuleMatch) {
            if (!util.isImported(tree, modulePath, schema, schemaSource)) {
                const importCustomSchema = insertImport(
                    moduleSource,
                    modulePath,
                    schema,
                    schemaSource
                );
                if (importCustomSchema instanceof InsertChange) {
                    moduleRecorder.insertLeft(
                        importCustomSchema?.pos,
                        `${importCustomSchema?.toAdd}\n`
                    );
                }
            }
            const schemasArrayRegex = /schemas\s*:\s*\[([^\]]*)\]/;
            const hasSchemasArray = schemasArrayRegex.test(moduleContent);
            if (!hasSchemasArray) {
                /** Has no schemas array */
                const ngModuleEnd =
                    (ngModuleMatch?.index || 0) +
                    (ngModuleMatch[0].length || 0);
                moduleRecorder.insertRight(
                    ngModuleEnd,
                    `\n\tschemas:[${schema}],`
                );
            } else {
                /** Has a schemas array which may or may not be empty. */
                const schemasMatch = moduleContent?.match(schemasArrayRegex);
                if (schemasMatch) {
                    const schemasMatchIndex = schemasMatch?.index || 0;
                    const existingSchemaEntries = schemasMatch[1] || '';
                    if (!existingSchemaEntries?.includes(schema)) {
                        const updatedSchemaEntries = existingSchemaEntries
                            ? `\n\t\t${schema},\n\t\t${existingSchemaEntries}`
                            : `${schema}`;

                        const updatedScemasArray = schemasMatch[0]?.replace(
                            schemasArrayRegex,
                            `\n\tschemas: [${updatedSchemaEntries}]`
                        );
                        moduleRecorder.remove(
                            schemasMatchIndex,
                            schemasMatch[0]?.length || 0
                        );
                        moduleRecorder.insertRight(
                            schemasMatchIndex,
                            updatedScemasArray
                        );
                    }
                }
            }
            tree.commitUpdate(moduleRecorder);
        }
    },
};
