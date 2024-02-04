import {WorkSpaceType} from '.'

export type ESLintProfileType = WorkSpaceType

export type ESLintOverride = {
    files?: string[],
    parser?: string,
    parserOptions?: {
        project?: string[],
        sourceType?: string,
        createDefaultProgram?: boolean,
        allowImportExportEverywhere?: boolean,
    },
    extends?: string[],
    rules?: Record<string, unknown>;
}

export type ESLintProfileRecord = {
    packages?: string[],
    overrides?: ESLintOverride[]
}

export type ESLintProfile = Record<
    string,
    () => ESLintProfileRecord
>

export type ESLintConfig = {
    root?: boolean,
    ignorePatterns?: string[],
    overrides?: ESLintOverride[],
    parserOptions?: {
        ecmaVersion?: string
    },
}

export type ESLintDefaults = {
    commonConfig: () => ESLintConfig,
    profiles: () => ESLintProfile,
}
