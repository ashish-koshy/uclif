import {Flags} from '@oclif/core'
import {BaseCommand} from '../../base/command'

import fs = require('fs-extra')
import nodeHtmlParser = require('node-html-parser')

export default class ModifyBaseHref extends BaseCommand<typeof ModifyBaseHref> {
  static description = "Change the base => href attribute in an existing 'index.html' file."

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    htmlRoot: Flags.string({
      default: '',
      description: "Path to the directory containing the 'index.html' at its root.",
    }),
    baseHref: Flags.string({
      default: '',
      description: "Path to be added as a 'base-href' attribute.",
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(ModifyBaseHref)

    if (!fs.existsSync(flags.htmlRoot) || !flags.baseHref) return

    const htmlPath = `${flags.htmlRoot}/index.html`

    if (!fs.existsSync(htmlPath)) return

    this.log(`Setting base href for : '${htmlPath}' as '${flags.baseHref}'`)

    try {
      const htmlContent = fs?.readFileSync(htmlPath, 'utf-8')
      const root = nodeHtmlParser?.parse(htmlContent)
      const baseTags = root?.getElementsByTagName('base')
      if (baseTags?.length) {
        const baseTag = baseTags[0]
        baseTag?.setAttribute('href', flags.baseHref)
        fs.writeFileSync(htmlPath, root?.innerHTML)

        await this.generateCliDoc()
      }
    } catch (error) {
      console.error('An error occurred while trying to set the base href path...', error)
    }
  }
}
