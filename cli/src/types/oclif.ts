import {Command} from '@oclif/core'
import {IPromptOptions} from '@oclif/core/lib/cli-ux'

import {BaseCommand} from '../base/command'

export type CustomPrompt = {
    text: {
        trigger: string,
        onSuccess?: string,
        onFailure?: string,
    },
    validator?: (input: string) => boolean,
    options?: IPromptOptions
}

export type GenericCommand = BaseCommand<typeof Command>
