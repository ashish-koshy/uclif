/* eslint-disable no-template-curly-in-string */
import {Flags} from '@oclif/core'

import {execute} from '../../tools/node'
import {prompt} from '../../tools/prompt'
import {staticData} from '../../static-data'
import {messages} from '../../tools/messages'
import {BaseCommand} from '../../base/command'
import {hasCustomGitFolderPath} from '../../tools/misc'
import {commitLintDefaults} from '../../tools/commitlint'
import {setCustomPackageJsonObject} from '../../tools/npm'

import fs = require('fs-extra');

export default class AddCommitHooks extends BaseCommand<typeof AddCommitHooks> {
  static description = "Add the 'husky' library to generate commit hooks to validate code sanity before commits are created and pushed."

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    projectPath: Flags.string({
      description: "Relative path of your project directory from your repository's \nroot directory. For e.g - 'some-directory/project-directory'\n",
      default: '',
    }),
    relativeGitFolderPath: Flags.string({
      description: "Relative path of your repository's '.git' directory \nfrom your project directory. For e.g - '../../../'\n",
      default: '',
    }),
  };

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddCommitHooks)
    const $hasCustomGitFolderPath = hasCustomGitFolderPath()

    if (
      $hasCustomGitFolderPath &&
      !flags.relativeGitFolderPath &&
      !flags.projectPath
    ) {
      this.log(messages.customGitFolderPath())
      this.log('Please provide the following information :')
      try {
        flags.projectPath = await prompt.projectRoot(
          this,
          AddCommitHooks.flags.projectPath.description || '',
          flags.projectPath,
        )
        flags.relativeGitFolderPath = await prompt.relativeGitFolderPath(
          this,
          AddCommitHooks.flags.relativeGitFolderPath.description || '',
          flags.relativeGitFolderPath,
        )
      } catch {
        flags.projectPath = './'
        flags.relativeGitFolderPath = './'
      }
    }

    flags?.projectPath &&
      console.log('\nProject path :', flags.projectPath)

    flags?.relativeGitFolderPath &&
      console.log("\nRelative '.git' folder path :", flags.relativeGitFolderPath)

    this.log('\nAdding dependencies for commit hooks...')
    execute(
      'npm',
      [
        'install',
        '--save-dev',
        `husky@${staticData.versions.husky}`,
        'lint-staged',
        `pretty-quick@${staticData.versions.prettyQuick}`,
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'standard-version',
      ],
    )

    if (!fs.existsSync(commitLintDefaults.commitLintConfigFile))
      fs.writeFileSync(
        commitLintDefaults.commitLintConfigFile,
        commitLintDefaults.commitLintConfig,
        'utf-8',
      )

    const hooksDirectory = '.husky'
    let prepareScript = 'husky install'
    let preCommitScript = 'npm run lint-staged'
    let commitMessageScript = 'npm run commitlint ${1}'
    let prePushScript = 'npm test && npm run build'

    if ($hasCustomGitFolderPath) {
      prepareScript = `cd ${flags.relativeGitFolderPath} && ${prepareScript} ./${flags.projectPath}/${hooksDirectory}`
      preCommitScript = `cd ./${flags.projectPath} && ${preCommitScript}`
      commitMessageScript = `cd ./${flags.projectPath} && ${commitMessageScript}`
      prePushScript = `cd ./${flags.projectPath} && ${prePushScript}`
    }

    setCustomPackageJsonObject(
      'lint-staged',
      {
        '*.{js,jsx,ts,tsx}': [],
        '*.{js,jsx,ts,tsx,html,css,scss,json}': [],
      },
    )

    execute(
      'npm',
      [
        'pkg',
        'set',
        `scripts.husky="${'husky'}"`,
        `scripts.lint-staged="${'lint-staged'}"`,
        `scripts.pretty-quick="${'pretty-quick'}"`,
        `scripts.commitlint="${'commitlint --edit'}"`,
        `scripts.standard-version="${'standard-version'}"`,
        `scripts.version-change="${'standard-version'}"`,
        `scripts.prepare="${prepareScript}"`,
      ],
    )

    execute(
      'npm',
      [
        'run',
        'prepare',
      ],
    )

    execute(
      'npx',
      [
        'husky',
        'set',
        '.husky/pre-commit',
        `"${preCommitScript}"`,
      ],
    )

    execute(
      'npx',
      [
        'husky',
        'set',
        '.husky/commit-msg',
        `"${commitMessageScript}"`,
      ],
    )

    execute(
      'npx',
      [
        'husky',
        'set',
        '.husky/pre-push',
        `"${prePushScript}"`,
      ],
    )
  }
}
