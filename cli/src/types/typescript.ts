import {ESLintProfileRecord} from './eslint'

export type TypeScriptDefaults = {
    eslintConfig: () => ESLintProfileRecord,
}
