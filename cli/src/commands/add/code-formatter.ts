import {Flags} from '@oclif/core'
import {execute} from '../../tools/node'
import {messages} from '../../tools/messages'
import {BaseCommand} from '../../base/command'
import {huskyInstalled} from '../../tools/husky'
import {prettierDefaults} from '../../tools/prettier'
import {isValidPrettierProfile} from '../../tools/misc'
import {PrettierProfileType} from '../../types/prettier'
import {setCustomPackageJsonObject} from '../../tools/npm'
import {getVSCodeSettings, setVSCodeSettings} from '../../tools/vscode'
import {
  mergeOptions,
  getPrettierConfiguration,
  setPrettierConfiguration,
  setPrettierIgnorePatterns,
} from '../../tools/prettier'

export default class AddCodeFormatter extends BaseCommand<typeof AddCodeFormatter> {
    static description = "Add the 'prettier' library to automatically format and beautify your code."

    static flags = {
      autoFormatOnSave: Flags.string({
        default: 'true',
        description: 'Set this to false if you do not wish to automatically format your code when you save a file.',
      }),
      addCommitHook: Flags.string({
        default: 'true',
        description: 'Set this to false if you do not wish add a pre-commit hook to automatically format your code.',
      }),
      organizeImportsOnSave: Flags.string({
        default: 'true',
        description: 'Set this to false if you do not wish to automatically organize the import statements when you save a file.',
      }),
      formatter: Flags.string({
        default: 'esbenp.prettier-vscode',
        description: 'Formatter used by VS Code to format: typescript, html or css files.',
      }),
      tabSize: Flags.integer({
        default: 2,
        description: 'Tab size to be enforced.',
      }),
    }

    static examples = [
      '<%= config.bin %> <%= command.id %>',
    ]

    public async run(): Promise<void> {
      const {flags} = await this.parse(AddCodeFormatter)
      this.log('\nPlease wait, adding Prettier rules...')

      setPrettierIgnorePatterns()

      let prettierInfo = getPrettierConfiguration() || {}
      !prettierInfo?.overrides && (prettierInfo.overrides = [])

      const defaultValues = prettierDefaults.commonConfig()

      prettierInfo = typeof prettierInfo === 'undefined' ?
        defaultValues : {...prettierInfo, ...defaultValues}

      const profiles = prettierDefaults.profiles()

      for (const key in profiles) {
        if (key && isValidPrettierProfile(key as PrettierProfileType)) {
          const getProfile = profiles[key]
          const profile = getProfile()
          const profilePackages = profile?.packages ? profile?.packages : []

          profilePackages.length > 0 &&
          execute(
            'npm',
            [
              'install',
              '--save-dev',
              ...profilePackages,
            ],
          )

          !profile?.overrides && (profile.overrides = [])

          for (const item of profile.overrides) {
            const matches =
              prettierInfo
              ?.overrides
              ?.filter(override => override?.files === item?.files)

            if (matches?.length === 1) {
              matches.map(entry => {
                mergeOptions(entry, item)
                return entry
              })
            } else
              prettierInfo?.overrides?.push(item)
          }
        }
      }

      setPrettierConfiguration(prettierInfo)

      this.log("\nUpdating '.vscode' settings for prettier...")

      const VSCodeSettings = getVSCodeSettings()
      const organizeImports = flags?.organizeImportsOnSave === 'true'
      const autoFormatOnSave = flags?.autoFormatOnSave === 'true'
      const defaultFormatter = flags?.formatter || 'esbenp.prettier-vscode'
      const defaultTabSize = flags?.tabSize || 2

      VSCodeSettings['editor.bracketPairColorization.enabled'] = true
      VSCodeSettings['editor.insertSpaces'] = true

      !VSCodeSettings['editor.codeActionsOnSave'] && (VSCodeSettings['editor.codeActionsOnSave'] = {})
      VSCodeSettings['editor.codeActionsOnSave']['source.organizeImports'] = organizeImports

      !VSCodeSettings['[html]'] && (VSCodeSettings['[html]'] = {})
      VSCodeSettings['[html]']['editor.defaultFormatter'] = defaultFormatter
      VSCodeSettings['[html]']['editor.formatOnSave'] = autoFormatOnSave

      !VSCodeSettings['[scss]'] && (VSCodeSettings['[scss]'] = {})
      VSCodeSettings['[scss]']['editor.defaultFormatter'] = defaultFormatter
      VSCodeSettings['[scss]']['editor.formatOnSave'] = autoFormatOnSave

      !VSCodeSettings['[typescript]'] && (VSCodeSettings['[typescript]'] = {})
      VSCodeSettings['[typescript]']['editor.defaultFormatter'] = defaultFormatter
      VSCodeSettings['[typescript]']['editor.formatOnSave'] = autoFormatOnSave
      VSCodeSettings['[typescript]']['editor.tabSize'] = defaultTabSize

      setVSCodeSettings(VSCodeSettings)

      execute(
        'npm',
        [
          'pkg',
          'set',
          `scripts.prettier="${'prettier'}"`,
        ],
      )

      if (flags.addCommitHook === 'true') {
        if (!huskyInstalled()) {
          this.log(messages.huskyNotFound())
          return
        }

        setCustomPackageJsonObject(
          'lint-staged', {
            '*.{js,jsx,ts,tsx,html,css,scss,json}': [
              'npm run pretty-quick -- --staged',
            ],
          },
        )
      }
    }
}
