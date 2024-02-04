import {expect, test} from '@oclif/test'

import * as fs from 'fs-extra'

describe("Command - 'uclif version'", () => {
  const command = test.stdout().command(['version'])
  const packageJson = fs.readJsonSync('package.json') ?? {}

  command
  .it(
    'Check whether the expected versions are being printed...',
    ctx => {
      const output = `${ctx?.stdout}` ?? ''
      expect(output).to.contain(`@uclif/cli - ${packageJson?.version}`)
    },
  )
})
