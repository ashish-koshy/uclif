import {ux} from '@oclif/core'
import {clean} from './semver'
import {staticData} from '../static-data'
import {CustomPrompt, GenericCommand} from '../types/oclif'

import semver = require('semver')

export async function triggerPrompt(
  command: GenericCommand,
  requestPrompt: CustomPrompt,
): Promise<string> {
  const userInput = await ux.prompt(`\n${requestPrompt.text.trigger}`, requestPrompt.options)

  if (typeof requestPrompt?.validator === 'undefined')
    return userInput

  if (!requestPrompt.validator(userInput)) {
    if (requestPrompt?.text?.onFailure)
      command?.log(requestPrompt.text.onFailure)

    return command?.triggerPrompt(requestPrompt)
  }

  if (requestPrompt?.text?.onSuccess)
    command?.log(requestPrompt.text.onSuccess)

  return userInput || ''
}

export async function triggerPromptAfterConfirmation(
  command: GenericCommand,
  confirmationPrompt: CustomPrompt,
  requestPrompt: CustomPrompt,
): Promise<string> {
  const userInput = await ux.prompt(`\n${confirmationPrompt.text.trigger} (y/n) ?`, confirmationPrompt.options)
  const userConsent = userInput?.toString()?.toLowerCase() || ''

  if (userConsent !== 'y' && userConsent !== 'n')
    return command?.triggerPromptAfterConfirmation(confirmationPrompt, requestPrompt)

  if (userConsent === 'y') {
    if (confirmationPrompt?.text?.onSuccess)
      command?.log(confirmationPrompt.text.onSuccess)

    return command?.triggerPrompt(requestPrompt)
  }

  if (confirmationPrompt?.text?.onFailure)
    command?.log(confirmationPrompt.text.onFailure)

  return ''
}

export const formatFlags = (
  command: GenericCommand,
  flags: string[] = [],
): string[] => {
  if (
    command?.isNonInteractive() &&
    !flags?.includes('--nonInteractive')
  ) flags?.push('--nonInteractive')
  return flags
}

export const describeCommandFlag = (
  avalableFlagValues: string[] = [],
): string => `${avalableFlagValues?.length ? `- ${avalableFlagValues?.join(' | ')} ` : ''}`

export const cliMajorVersion =
  (command?: GenericCommand): string =>
    `${semver.major(clean(command?.config?.version || staticData.versions.nx))}`
