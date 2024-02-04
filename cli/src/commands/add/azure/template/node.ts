import {Flags} from '@oclif/core'
import {BaseCommand} from '../../../../base/command'
import {AzureNodeTools} from '../../../../tools/azure/node'
import {AzureNodeBuildParameters, AzureNodePackageParameters} from '../../../../types/azure'

export default class AddAzureTemplateNode extends BaseCommand<typeof AddAzureTemplateNode> {
  static description = "Add Node based '.YML' templates for Microsoft Azure DevOps."

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    package: Flags.boolean({
      default: false,
      description: 'Set this flag to true if you wish to configure and publish your artifacts as a node package.',
    }),
    nodeVersion: Flags.string({
      default: '16.15.0',
      description: 'Specify a node version.',
    }),
    variableGroupName: Flags.string({
      default: '',
      description: 'Specify the name of your Azure variable group if any.',
    }),
    vmImage: Flags.string({
      default: 'ubuntu-latest',
      description: 'Specify the type of virtual machine you wish to use.',
    }),
    installParams: Flags.string({
      default: '',
      description: "Additional flags or parameters to be added to the 'install' command.",
    }),
    lintParams: Flags.string({
      default: '',
      description: "Additional flags or parameters to be added to the 'lint' script.",
    }),
    testParams: Flags.string({
      default: '',
      description: "Additional flags or parameters to be added to the 'test' script.",
    }),
    buildParams: Flags.string({
      default: '',
      description: "Additional flags or parameters to be added to the  'build' script.",
    }),
    workingDirectory: Flags.string({
      default: './',
      description: 'If your project is in a sub directory, specify its relative path from the root.',
    }),
    buildArtifactPath: Flags.string({
      default: './dist',
      description: 'Specify the directory that would contain the generated build artifacts.',
    }),
    triggerPathPattern: Flags.string({
      default: '',
      description: 'Specify a glob pattern if you only wish to trigger the pipline for changes under a specific directory (optional).',
    }),
    trunkBranchName: Flags.string({
      default: 'master',
      description: 'Specify a name for your trunk branch.',
    }),
    packageNameSpace: Flags.string({
      default: '@namespace',
      description: 'Specify your package namespace like: @namespace',
    }),
    packageOrgName: Flags.string({
      default: '$(packageOrgName)',
      description: 'Organization name or azure variable name.',
    }),
    packageFeed: Flags.string({
      default: '$(packageFeed)',
      description: 'Package feed id or azure variable name.',
    }),
    packageRegistry: Flags.string({
      default: '$(packageRegistry)',
      description: 'Package registry path or azure variable name.',
    }),
    packagePublishAuthName: Flags.string({
      default: '$(packagePublishAuthName)',
      description: 'User name to access your package registry or azure variable name.',
    }),
    packagePublishAuthToken: Flags.string({
      default: '$(packagePublishAuthToken)',
      description: 'Password to access your package registry or azure variable name.',
    }),
    packagePublishPath: Flags.string({
      default: './',
      description: 'Specify the relative path of the directory that needs to be published as a node package.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(AddAzureTemplateNode)

    AzureNodeTools.generateVariableTemplate(flags?.variableGroupName)
    AzureNodeTools.generateBuildSteps(flags?.package)

    /**
     * The two templates below are not automatically linked
     * to the main template file as the parameters needed
     * by them are varied and subjective.
     *
     * They are not generic enough.
     **/
    AzureNodeTools.generateTestQualitySteps()
    AzureNodeTools.generateCodeAnalysisSteps()

    const buildParameters: AzureNodeBuildParameters = {
      nodeVersion: flags.nodeVersion,
      installParams: flags.installParams,
      lintParams: flags.lintParams,
      testParams: flags.testParams,
      buildParams: flags.buildParams,
      workingDirectory: flags.workingDirectory,
      buildArtifactPath: flags.buildArtifactPath,
    }

    const packageParameters: AzureNodePackageParameters | undefined = flags.package ? {
      packageFeed: flags.packageFeed,
      packageOrgName: flags.packageOrgName,
      packageRegistry: flags.packageRegistry,
      packageNameSpace: flags.packageNameSpace,
      packagePublishPath: flags.packagePublishPath,
      packagePublishAuthName: flags.packagePublishAuthName,
      packagePublishAuthToken: flags.packagePublishAuthToken,
    } : undefined

    const templateStart = AzureNodeTools.getTemplateStart(flags?.triggerPathPattern, flags?.trunkBranchName)
    const parameters = AzureNodeTools.getParameters(buildParameters, packageParameters)
    const stageAndJob = AzureNodeTools.getStageAndJob(
      {
        vmImage: flags.vmImage,
        demands: 'npm',
      },
    )
    const parameterInputs = AzureNodeTools.getParameterInputs(buildParameters, packageParameters)
    const template = `${templateStart}${parameters}${stageAndJob}${parameterInputs}`
    AzureNodeTools.generateTemplateFile(template, 'build.yml')

    await this.generateCliDoc()
  }
}
