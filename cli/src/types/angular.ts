import {ESLintProfileRecord} from './eslint'
import {PrettierProfileRecord} from './prettier'

export type AngularDefaults = {
    eslintConfig: () => ESLintProfileRecord,
    prettierConfig: () => PrettierProfileRecord,
}
