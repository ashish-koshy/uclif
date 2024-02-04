(() => {
    if (!require('is-ci')) return 

    const fs = require('fs-extra')
    const packageJson = fs.readJsonSync('package.json')

    /** Clean up package.json before publishing */
    packageJson?.scripts && (delete packageJson.scripts)
    packageJson?.devDependencies && (delete packageJson.devDependencies)
    packageJson?.['lint-staged'] && (delete packageJson['lint-staged'])
    
    fs.writeJsonSync('package.json', packageJson, { spaces: 4 })
})()