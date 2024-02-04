(() => {
    const fs = require('fs-extra')
    fs.removeSync('publish')
    fs.ensureDirSync('publish')
    fs.copySync('bin', 'publish/bin')
    fs.copySync('dist', 'publish/dist')
    fs.copyFileSync('./package.json', 'publish/package.json')
})()