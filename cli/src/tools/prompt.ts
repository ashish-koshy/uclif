import {isValidKebabCase, areValidKebabCases, isValidRelativePath} from './validations'
import {GenericCommand} from '../types/oclif'
import {messages} from './messages'

export const prompt = {
  async hybridAppName(
    command: GenericCommand,
    argInput?: string,
  ): Promise<string> {
    if (argInput && isValidKebabCase(argInput))
      return argInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: 'Would you like to setup a hybrid (web + mobile) application',
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: 'Please provide a project name for your hybrid (web + mobile) application',
          onFailure: messages.caseWarning(),
        },
        validator: isValidKebabCase,
      },
    )
  },
  async hostAppName(
    command: GenericCommand,
    flagInput?: string,
  ): Promise<string> {
    if (flagInput && isValidKebabCase(flagInput))
      return flagInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: "Would you like to setup a 'host' application",
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: "Please provide a name for your 'host' application",
          onFailure: messages.caseWarning(),
        },
        validator: isValidKebabCase,
      },
    )
  },
  async remoteAppName(
    command: GenericCommand,
    flagInput?: string,
  ): Promise<string> {
    if (flagInput && areValidKebabCases(flagInput))
      return flagInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: "Would you like to setup 'remote' application(s)",
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: "Please provide the name(s) for your 'remote' application(s)\n(use comma separated values for multiple entries)",
          onFailure: messages.caseWarning(),
        },
        validator: areValidKebabCases,
      },
    )
  },
  async regularAppName(
    command: GenericCommand,
    flagInput?: string,
  ): Promise<string> {
    if (flagInput && isValidKebabCase(flagInput))
      return flagInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: 'Would you like to setup a regular\napplication in this workspace',
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: 'Please provide the name for your application',
          onFailure: messages.caseWarning(),
        },
        validator: isValidKebabCase,
      },
    )
  },
  async libraryName(
    command: GenericCommand,
    flagInput?: string,
  ): Promise<string> {
    if (flagInput && areValidKebabCases(flagInput))
      return flagInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: 'Would you like to add\nlibraries that you can share across your Nx workspace',
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: 'Please provide the name(s) for your libraries\n(use comma separated values for multiple entries)',
          onFailure: messages.caseWarning(),
        },
        validator: areValidKebabCases,
      },
    )
  },
  async workspaceName(
    command: GenericCommand,
    argInput?: string,
  ): Promise<string> {
    if (argInput && isValidKebabCase(argInput))
      return argInput
    return command.triggerPrompt({
      text: {
        trigger: 'Please provide a name for the new workspace',
        onFailure: messages.caseWarning(),
      },
      validator: isValidKebabCase,
    })
  },
  async schematicName(
    command: GenericCommand,
    argInput?: string,
  ): Promise<string> {
    if (argInput && isValidKebabCase(argInput))
      return argInput
    return command.triggerPrompt({
      text: {
        trigger: 'Please provide a schematic name that you would like to run from - @uclif/ng-schematics',
        onFailure: messages.caseWarning(),
      },
      validator: isValidKebabCase,
    })
  },
  async nodeAppName(
    command: GenericCommand,
    flagInput?: string,
  ): Promise<string> {
    if (flagInput && isValidKebabCase(flagInput))
      return flagInput
    return command.triggerPromptAfterConfirmation(
      {
        text: {
          trigger: 'Would you like to setup a Node JS application in this workspace',
          onSuccess: messages.caseWarning(),
        },
      },
      {
        text: {
          trigger: 'Please provide the name for your application',
          onFailure: messages.caseWarning(),
        },
        validator: isValidKebabCase,
      },
    )
  },
  async projectRoot(
    command: GenericCommand,
    triggerMessage: string,
    argInput?: string,
  ): Promise<string> {
    if (argInput)
      return argInput
    return command.triggerPrompt({
      text: {
        trigger: triggerMessage,
      },
    })
  },
  async relativeGitFolderPath(
    command: GenericCommand,
    triggerMessage: string,
    argInput?: string,
  ): Promise<string> {
    if (argInput && isValidRelativePath(argInput))
      return argInput
    return command.triggerPrompt({
      text: {
        trigger: triggerMessage,
        onFailure: messages.relativePathWarning(),
      },
      validator: isValidRelativePath,
    })
  },
}
