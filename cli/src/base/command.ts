import {triggerPrompt, triggerPromptAfterConfirmation} from '../tools/oclif'
import {Command, Flags, Interfaces} from '@oclif/core'
import {isValidWorkspace} from '../tools/nx'
import {getFigletText} from '../tools/figlet'
import {CustomPrompt} from '../types/oclif'
import {staticData} from '../static-data'

import fs = require('fs-extra')

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  /**
   * Define flags that can be inherited
   * by any command that extends BaseCommand
   **/
  static baseFlags = {
    nonInteractive: Flags.boolean({
      description: 'Set this flag to skip all the user prompts rendered in the console.',
    }),
  }

  protected flags!: Flags<T>
  protected args!: Args<T>

  public async init(): Promise<void> {
    await super.init()
    const {args, flags} = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    if (isValidWorkspace())
      fs.ensureDirSync('./apps')
  }

  public isNonInteractive(): boolean {
    return this.flags?.nonInteractive === true
  }

  protected async catch(err: Error & {exitCode?: number}): Promise<any> {
    /**
     * Add any custom logic to handle errors from the command
     * or simply return the parent class error handling
     */
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    /**
     * Called after run and catch regardless of
     * whether or not the command errored
     */
    return super.finally(_)
  }

  public log(message?: string, ...args: any[]): void {
    if (this.isNonInteractive())
      return
    super.log(message, ...args)
  }

  public async triggerPrompt(
    requestPrompt: CustomPrompt,
  ): Promise<string> {
    return this.isNonInteractive() ? '' : triggerPrompt(this, requestPrompt)
  }

  public async triggerPromptAfterConfirmation(
    confirmationPrompt: CustomPrompt,
    requestPrompt: CustomPrompt,
  ): Promise<string> {
    return this.isNonInteractive() ? '' : triggerPromptAfterConfirmation(this, confirmationPrompt, requestPrompt)
  }

  public async generateCliDoc(): Promise<void> {
    if (!fs.existsSync('./package.json')) return
    const fileName = 'UCLIF-CLI.md'
    const fileContent = `This workspace was either setup or modified by :\n\n\`\`\`\n${
      getFigletText(
        'UCLIF CLI',
        {
          width: 80,
          font: 'Standard',
          whitespaceBreak: true,
        },
      )}\n\`\`\`\n\n[Visit - @uclif/cli](${staticData.externalLinks.selfDocumentation})`
    await fs.ensureFileSync(`./${fileName}`)
    await fs.writeFileSync(`./${fileName}`, fileContent, 'utf-8')
  }
}
