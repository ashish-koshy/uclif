import fs = require('fs-extra')
import {AzureNodeBuildParameters, AzureNodePackageParameters} from '../../types/azure'

// eslint-disable-next-line unicorn/prefer-module
const kebabCase = require('kebab-case')

const generateTemplateFile = (
  fileContent: string,
  fileName: string,
): void => {
  const baseDirectory = './.azuredevops/yaml-templates/node/'
  const filePath = `${baseDirectory}${fileName}`
  fs.ensureDirSync(baseDirectory)
  fs.ensureFileSync(filePath)
  fs.writeFileSync(filePath, fileContent, 'utf-8')
}

const getTemplateStart = (
  triggerPathPattern = '',
  trunkBranchName = '',
): string => `
# Node.js
# Build a general Node.js project with npm.
# Add steps that analyze code, save build artifacts, deploy, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/javascript
#
# YAML Schema:
# https://raw.githubusercontent.com/microsoft/azure-pipelines-vscode/master/service-schema.json

trigger:
  branches:
    include:
      - ${trunkBranchName ?? 'master'}
  ${
  triggerPathPattern ? `
  paths:
    include:
      - ${triggerPathPattern}` : ''}

variables:
  - template: ./variables.yml
`

const getParameters = (
  buildParameters: AzureNodeBuildParameters,
  packageParameters?: AzureNodePackageParameters,
): string => {
  let paramList = ''
  const createParams = (list: Record<string, unknown>) => {
    for (const key in list) {
      if (list[key] !== undefined)
        paramList += `
  - name: ${key}
    type: string
    displayName: ${kebabCase(key)}
    default: '${(list[key] as string)?.length ? list[key] : ' '}'`
    }
  }

  createParams(buildParameters as Record<string, unknown>)
  packageParameters && createParams(packageParameters as Record<string, unknown>)

  return `
parameters: ${paramList}
  `
}

const getParameterInputs = (
  buildParameters: AzureNodeBuildParameters,
  packageParameters?: AzureNodePackageParameters,
): string => {
  let parameterInputList = ''
  const createParameterInputs = (list: Record<string, unknown>) => {
    for (const key in list) {
      if ((list as Record<string, unknown>)[key] !== undefined)
        parameterInputList += `
        ${key}: \${{ parameters.${key} }}`
    }
  }

  createParameterInputs(buildParameters)
  packageParameters && createParameterInputs(packageParameters)

  return `
      parameters:
        prTrigger: \${{ variables.prTrigger }}
        masterTrigger: \${{ variables.masterTrigger }} ${parameterInputList}`
}

const getStageAndJob = (
  input: {
    vmImage: string,
    demands: string,
  },
): string => `
stages:
- stage: 'BuildStage'
  displayName: 'Build Stage'
  jobs: 
  - job: 'ExecuteJob'
    displayName: 'Execute Job'
    pool:
      vmImage: ${input.vmImage}
      demands: ${input.demands}
    steps:
    - template: ./steps.yml`

const generateVariableTemplate = (
  variableGroupName = '',
): void => {
  const template = `
variables: ${
  variableGroupName ? `
- group: ${variableGroupName}` : ''}
- name: prTrigger
  \${{ if eq(variables['Build.Reason'], 'PullRequest') }}:
    value: 'true'
  \${{ else }}:
    value: 'false'
- name: masterTrigger
  \${{ if eq(variables['Build.SourceBranch'], 'refs/heads/master') }}:
    value: 'true'
  \${{ else }}:
    value: 'false'`
  generateTemplateFile(template, 'variables.yml')
}

const generateTestQualitySteps = (): void => {
  const template = `
steps:
- task: PublishTestResults@2
  displayName: 'Test Results - \${{ parameters.projectName }}'
  condition: succeededOrFailed()
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '**/TESTS-*.xml'

- task: PublishCodeCoverageResults@1
  displayName: 'Code Coverage - \${{ parameters.projectName }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  continueOnError: false
  inputs:
    codeCoverageTool: Cobertura
    summaryFileLocation: '\${{ parameters.coberturaSummaryFileLocation }}'
    reportDirectory: '\${{ parameters.coberturaReportDirectory }}'
    
- task: BuildQualityChecks@8
  displayName: 'Coverage % Check - \${{ parameters.projectName }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  timeoutInMinutes: 10
  inputs:
    checkCoverage: true
    coverageType: 'custom'
    coverageFailOption: 'fixed'
    customCoverageType: 'Lines'
    coverageThreshold: '\${{ parameters.coverageThreshold }}'
    runTitle: 'Check if code coverage % is preserved from previous build'`

  generateTemplateFile(template, 'steps-test-quality.yml')
}

const generateCodeAnalysisSteps = (): void => {
  const template = `
steps:
- task: SonarQubePrepare@4
  displayName: 'Code Analysis Config - \${{ parameters.projectName }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  inputs:
    SonarQube: 'Sonar-Qube'
    cliSources: '.'
    scannerMode: 'CLI'
    configMode: 'manual'
    cliProjectKey: '\${{ parameters.cliProjectKey }}'
    cliProjectName: '\${{ parameters.cliProjectName }}'
    extraProperties: |
      sonar.test=\${{ parameters.sonarTest }}
      sonar.exclusions=\${{ parameters.sonarExclusions }}
      sonar.test.inclusions=\${{ parameters.sonarTestInclusions }}
      sonar.javascript.lcov.reportPaths=\${{ parameters.sonarJsLcovReportPaths }}

- task: SonarQubeAnalyze@4
  displayName: 'Code Analysis - \${{ parameters.projectName }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  continueOnError: false

- task: SonarQubePublish@4
  displayName: 'Code Analysis Report - \${{ parameters.projectName }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  continueOnError: true
  inputs:
    pollingTimeoutSec: '300'`

  generateTemplateFile(template, 'steps-code-analysis.yml')
}

const generatePackagePublishSteps = (): void => {
  const template = `
steps:
- script: 'npm config set --location project \${{ parameters.packageNameSpace }}:registry=//pkgs.dev.azure.com/\${{ parameters.packageOrgName }}\${{ parameters.packageRegistry }}'
  displayName: 'Set release registry'
  condition: and(succeeded(), eq('\${{ parameters.masterTrigger }}', 'true'))
  workingDirectory: '\${{ parameters.workingDirectory }}'

- script: 'npm config set --location project //pkgs.dev.azure.com/\${{ parameters.packageOrgName }}:username=\${{ parameters.packagePublishAuthName }} //pkgs.dev.azure.com/\${{ parameters.packageOrgName }}:_password=\${{ parameters.packagePublishAuthToken }}'
  displayName: 'Set release credentials'
  condition: and(succeeded(), eq('\${{ parameters.masterTrigger }}', 'true'))
  workingDirectory: '\${{ parameters.workingDirectory }}'

- task: npmAuthenticate@0
  displayName: Authenticate release
  condition: and(succeeded(), eq('\${{ parameters.masterTrigger }}', 'true'))
  inputs:
    workingFile: '\${{ parameters.workingDirectory }}.npmrc'

- task: Npm@1
  displayName: 'Publish package'
  condition: and(succeeded(), eq('\${{ parameters.masterTrigger }}', 'true'))
  inputs:
    command: 'publish'
    publishRegistry: 'useFeed'
    publishFeed: '\${{ parameters.packageFeed }}'
    workingDir: '\${{ parameters.workingDirectory }}\${{ parameters.packagePublishPath }}'`

  generateTemplateFile(template, 'steps-package-publish.yml')
}

const generateBuildSteps = (
  publishPackage: boolean,
): void => {
  let publishPackageTemplate = ''
  if (publishPackage) {
    generatePackagePublishSteps()
    publishPackageTemplate = `
- template: ./steps-package-publish.yml
  parameters:
    masterTrigger: \${{ parameters.masterTrigger }}
    workingDirectory: \${{ parameters.workingDirectory }}
    packageFeed: \${{ parameters.packageFeed }}
    packageOrgName: \${{ parameters.packageOrgName }}
    packageRegistry: \${{ parameters.packageRegistry }}
    packageNameSpace: \${{ parameters.packageNameSpace }}
    packagePublishPath: \${{ parameters.packagePublishPath }}
    packagePublishAuthName: \${{ parameters.packagePublishAuthName }}
    packagePublishAuthToken: \${{ parameters.packagePublishAuthToken }}`
  }

  const template = `
steps:
- task: NodeTool@0
  displayName: 'Specify node version'
  inputs:
    versionSpec: '\${{ parameters.nodeVersion }}'

- script: 'npm ci \${{ parameters.installParams }}'
  displayName: 'Install dependencies'
  workingDirectory: '\${{ parameters.workingDirectory }}'

- script: 'npm run lint \${{ parameters.lintParams }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  displayName: 'Validate lint fixes'
  workingDirectory: '\${{ parameters.workingDirectory }}'

- script: 'npm run test \${{ parameters.testParams }}'
  condition: and(succeeded(), eq('\${{ parameters.prTrigger }}', 'true'))
  displayName: 'Run tests'
  workingDirectory: '\${{ parameters.workingDirectory }}'

- script: 'npm run build \${{ parameters.buildParams }}'
  displayName: 'Build artifacts'
  workingDirectory: '\${{ parameters.workingDirectory }}'
  continueOnError: false

- task: PublishBuildArtifacts@1
  displayName: 'Publish artifacts'
  inputs:
    PathtoPublish: '\${{ parameters.workingDirectory }}\${{ parameters.buildArtifactPath }}'
    ArtifactName: 'dist'
${publishPackageTemplate}`

  generateTemplateFile(template, 'steps.yml')
}

export const AzureNodeTools = {
  getTemplateStart,
  generateBuildSteps,
  generateVariableTemplate,
  getParameterInputs,
  getParameters,
  getStageAndJob,
  generateTemplateFile,
  generateTestQualitySteps,
  generateCodeAnalysisSteps,
  generatePackagePublishSteps,
}
