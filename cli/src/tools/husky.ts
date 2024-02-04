import fs = require('fs-extra')
import {packageExists} from './npm'

export const huskyInstalled =
    (): boolean => fs.existsSync('.husky') && packageExists('husky') !== ''
