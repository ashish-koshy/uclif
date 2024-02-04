import {expect} from '@oclif/test'
import {generateBase64} from '../../src/tools/misc'

describe("Testing 'utils' >> 'tools'", () => {
  it('Should generate a valid base64 string', () => {
    expect(generateBase64('')).to.equal('')
  })
})
