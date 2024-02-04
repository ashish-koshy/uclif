import {Flags} from '@oclif/core'
import {execute} from '../../tools/node'
import {messages} from '../../tools/messages'
import {BaseCommand} from '../../base/command'
import {eslintDefaults} from '../../tools/eslint'
import {
  getEsLintConfiguration,
  mergeExtensions,
  mergeRules,
  setESLintConfiguration,
  setEsLintIgnorePatterns,
  setParserOptions,
} from '../../tools/eslint'
import {huskyInstalled} from '../../tools/husky'
import {ESLintProfileType} from '../../types/eslint'
import {isValidLinterProfile} from '../../tools/misc'
import {setCustomPackageJsonObject} from '../../tools/npm'
import {getVSCodeSettings, setVSCodeSettings} from '../../tools/vscode'

export default class AddCodeLinter extends BaseCommand<typeof AddCodeLinter> {
    static description = "Add the 'eslint' library to find logical, semantic or type issues in your code."

    static flags = {
      addCommitHook: Flags.string({
        default: 'true',
        description: 'Set this to false if you do not wish add a pre-commit hook to check for lint errors.',
      }),
      autoLintOnSave: Flags.string({
        default: 'true',
        description: 'Set this to false if you do not wish to automatically lint your code when you save a file.',
      }),
    }

    static examples = [
      '<%= config.bin %> <%= command.id %>',
    ]

    public async run(): Promise<void> {
      const {flags} = await this.parse(AddCodeLinter)
      this.log('\nPlease wait, adding eslint rules...')

      setEsLintIgnorePatterns()

      const esLintInfo = getEsLintConfiguration() || {}

      !esLintInfo?.overrides && (esLintInfo.overrides = [])

      esLintInfo.ignorePatterns = []

      const profiles = eslintDefaults.profiles()

      for (const key in profiles) {
        if (key && isValidLinterProfile(key as ESLintProfileType)) {
          const getProfile = profiles[key]
          const profile = getProfile()
          const profilePackages = profile?.packages || []

          profilePackages.length > 0 &&
          execute(
            'npm', [
              'install',
              '--save-dev',
              ...profilePackages,
            ],
          )

          for (const item of profile?.overrides || []) {
            const matches =
              esLintInfo
              ?.overrides
              ?.filter(override => override?.files?.join('') === item?.files?.join(''))

            if (matches?.length === 1) {
              matches.map(entry => {
                mergeExtensions(entry, item)
                mergeRules(entry, item)
                setParserOptions(entry)
                return entry
              })
            } else {
              setParserOptions(item)
              esLintInfo?.overrides?.push(item)
            }
          }
        }
      }

      setESLintConfiguration(esLintInfo)

      this.log("\nUpdating '.vscode' settings for eslint...")
      const vsCodeSettings = getVSCodeSettings()
      !vsCodeSettings['editor.codeActionsOnSave'] && (vsCodeSettings['editor.codeActionsOnSave'] = {})
      vsCodeSettings['editor.codeActionsOnSave']['source.fixAll.eslint'] = flags?.autoLintOnSave === 'true'
      setVSCodeSettings(vsCodeSettings)

      execute(
        'npm',
        [
          'pkg',
          'set',
          `scripts.eslint="${'eslint'}"`,
        ],
      )

      if (flags.addCommitHook === 'true') {
        if (!huskyInstalled()) {
          this.log(messages.huskyNotFound())
          return
        }

        setCustomPackageJsonObject(
          'lint-staged',
          {
            '*.{js,jsx,ts,tsx}': ['npm run eslint -- --fix'],
          },
        )
      }
    }
}
