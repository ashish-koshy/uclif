import {packagesExist, setupProjectScripts} from '../../../tools/npm'
import {getNxNamespace, getNxWorkspaceVersion, isValidWorkspace} from '../../../tools/nx'
import {addNgEnvironments} from '../../../tools/angular'
import {describeCommandFlag} from '../../../tools/oclif'
import {BaseCommand} from '../../../base/command'
import {PackageLookup} from '../../../types/npm'
import {messages} from '../../../tools/messages'
import {nxDefaults} from '../../../tools/nx'
import {prompt} from '../../../tools/prompt'
import {clean} from '../../../tools/semver'
import {execute} from '../../../tools/node'

import {Flags} from '@oclif/core'

import semver = require('semver')

export default class AddNgApp extends BaseCommand<typeof AddNgApp> {
  static description = 'Add new Angular applications to an existing Nx workspace.'
  static dependencies: PackageLookup | null = null

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    hybridAppName: Flags.string({
      default: '',
      description: "Name for 'ionic' application in 'kebab-case'",
    }),
    hostAppName: Flags.string({
      default: '',
      description: "Name for 'host' application in 'kebab-case'",
    }),
    remoteAppName: Flags.string({
      default: '',
      description: "Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries",
    }),
    libraryName: Flags.string({
      default: '',
      description: "Name for Angular 'library' in 'kebab-case'. Comma separated for multiple entries",
    }),
    regularAppName: Flags.string({
      default: '',
      description: "Name for 'regular' Angular application in 'kebab-case'",
    }),
    styleType: Flags.string({
      default: nxDefaults.styleType,
      description: `Available style types ${describeCommandFlag(nxDefaults.styleTypes)}`,
    }),
    unitTestRunner: Flags.string({
      default: nxDefaults.uniTestRunner,
      description: `Available unit test runners ${describeCommandFlag(nxDefaults.uniTestRunners)}`,
    }),
    endToEndTestRunner: Flags.string({
      default: nxDefaults.endToEndTestRunner,
      description: `Available end to end test runners ${describeCommandFlag(nxDefaults.endToEndTestRunners)}`,
    }),
  }

  static args = {}

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddNgApp)

    if (!isValidWorkspace()) {
      this.log(messages.invalidWorkspace())
      return
    }

    const nxNamespace = getNxNamespace()
    const ngMajorVersion = semver.major(clean(getNxWorkspaceVersion()))

    AddNgApp.dependencies = {
      dependencies: [
        `${nxNamespace}/angular`,
      ],
      devDependencies: flags?.hybridAppName && ngMajorVersion >= 14 ?
        ['@nxext/ionic-angular'] : [],
    }

    if (!packagesExist(AddNgApp.dependencies)) {
      this.log(messages.missingDependencies(AddNgApp.dependencies, 'uclif add:ng:packages --help'))
      return
    }

    this.log(messages.whatIsAHostApp())
    const hostAppName = await prompt.hostAppName(this, flags?.hostAppName)
    if (hostAppName) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/angular:host`,
          `--name=${hostAppName}`,
          `--style=${flags.styleType}`,
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
        ],
      )
      setupProjectScripts(hostAppName)
      addNgEnvironments(hostAppName)
    }

    this.log(messages.whatIsARemoteApp())
    const remoteAppName = await prompt.remoteAppName(this, flags?.remoteAppName)
    const remotes = remoteAppName.split(',').map(item => item.trim()).filter(item => item)
    if (remotes.length > 0) {
      for (const remote of remotes) {
        if (remote) {
          this.log(`\nPlease wait, setting up remote application : ${remote}...`)
          execute(
            'npx',
            [
              'nx',
              'g',
              `${nxNamespace}/angular:remote`,
              `--name=${remote}`,
              `--style=${flags.styleType}`,
              `--unitTestRunner=${flags.unitTestRunner}`,
              `--e2eTestRunner=${flags.endToEndTestRunner}`,
            ],
          )
          addNgEnvironments(remote)
          setupProjectScripts(remote)
        }
      }
    }

    const regularAppName = await prompt.regularAppName(this, flags?.regularAppName)
    if (regularAppName) {
      execute(
        'npx',
        [
          'nx',
          'g',
          `${nxNamespace}/angular:application`,
          `--name=${regularAppName}`,
          `--style=${flags.styleType}`,
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
          '--routing',
        ],
      )
      addNgEnvironments(regularAppName)
      setupProjectScripts(regularAppName)
    }

    const hybridAppName = await prompt.hybridAppName(this, flags?.hybridAppName)
    if (hybridAppName && AddNgApp.dependencies?.devDependencies?.includes('@nxext/ionic-angular')) {
      execute(
        'npx',
        [
          'nx',
          'g',
          '@nxext/ionic-angular:application',
          `--name=${hybridAppName}`,
          '--template=blank',
          `--unitTestRunner=${flags.unitTestRunner}`,
          `--e2eTestRunner=${flags.endToEndTestRunner}`,
        ],
      )
      addNgEnvironments(hybridAppName)
      setupProjectScripts(hybridAppName)
    }

    const libraryName = await prompt.libraryName(this, flags?.libraryName)
    const libraries = libraryName.split(',').map(item => item.trim()).filter(item => item)
    if (libraries.length > 0) {
      for (const library of libraries) {
        if (library) {
          this.log(`\nPlease wait, setting up library - ${library}...`)
          execute(
            'npx',
            [
              'nx',
              'g',
              `${nxNamespace}/angular:lib`,
              `--name=shared/${library}`,
              `--unitTestRunner=${flags.unitTestRunner}`,
            ],
          )
          execute(
            'npx',
            [
              'nx',
              'g',
              `${nxNamespace}/angular:service`,
              `--name=${library}`,
              `--project=shared-${library}`,
            ],
          )
        }
      }
    }
  }
}
