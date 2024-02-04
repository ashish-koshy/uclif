import {staticData} from '../static-data'
import {PackageLookup} from '../types/npm'

export const messages = {
  caseWarning: (): string => {
    return `
    --------------------------------
    Note : Use 'kebab-case' to input 
    names for your apps and libraries
    --------------------------------
    `
  },
  relativePathWarning: (): string => {
    return `
    --------------------------------
    Note : Please provide a valid
    relative path containing only
    dots and slashes. For e.g: 
    '../../'
    --------------------------------
    `
  },
  semverWarning: (): string => {
    return `
    --------------------------------
    Note : Use a valid version number
    that conforms to the Semantic 
    Versioning Standard.
    --------------------------------
    `
  },
  invalidWorkspace: (): string => {
    return `
    --------------------------------
    Sorry, a valid Nx workspace could 
    not be detected. Please make sure 
    that you have a valid Nx workspace 
    setup using the command 'uclif new'
    --------------------------------
    `
  },
  missingDependencies: (
    list: PackageLookup | null,
    ...commands: string[]
  ): string => {
    return `
    --------------------------------
    A required set of dependent package 
    modules could not be found.

    Please make sure that the following 
    package modules are available :
    --------------------------------
    ${JSON.stringify(list, null, 5).replace('{', '').replace('}', '')}
    --------------------------------
    Use the command(s) :
    ${commands.map(command => `\n${command}`).join('')}

    to try and resolve this issue.
    `
  },
  missingNxApplication: (): string => {
    return `
    --------------------------------
    This application could not be 
    detected in your Nx workspace.

    Please try again or setup this 
    application using the commands 
    like: 

    uclif add --help
    --------------------------------
    `
  },
  setupFailed: (): string => {
    return `
    --------------------------------
    Workspace setup failed...
    --------------------------------
    `
  },
  setupComplete: (workspaceName: string): string => {
    return `
    --------------------------------
    Your Nx workspace : 
    '${workspaceName}' 
    
    has now been setup...
    
    Refer to the 'scripts' section of the 
    'package.json' file for more details 
    on how to run your app(s).

    GUIDANCE :
    --------------------------------
    ${staticData.externalLinks.nx}
    --------------------------------
    `
  },
  whatIsAHostApp: (): string => {
    return `
    What is a 'host' app ?
    --------------------------------
    'host' apps are just like any other 
    regular Angular app.
    
    They can be further configured to 
    dynamically pull other 'remote' apps 
    aka 'micro front ends' through the 
    use of 'module federation'.

    Host apps are not usually self contained 
    and they cannot be served remotely i.e 
    they cannot be pulled and used by other 
    'host' apps.
    --------------------------------
    `
  },
  whatIsARemoteApp: (): string => {
    return `
    What is a 'remote' app ?
    --------------------------------
    Unlike 'host' apps, 'remote' apps aka 
    'micro front ends' are self contained 
    and can be served remotely i.e they 
    can be pulled and used by other 'host' 
    apps.
    
    'remote' apps can thus be 'federated' 
    to other 'host' apps through the use 
    of 'module federation'

    GUIDANCE :
    --------------------------------
    ${staticData.externalLinks.moduleFederation}
    --------------------------------
    `
  },
  customGitFolderPath: (): string => {
    return `
    --------------------------------
    Oops! your repository's '.git' 
    directory could not be located. 
    You are very likely running this 
    command from a sub directory of 
    your repository.
    --------------------------------
    `
  },
  huskyNotFound: (): string => {
    return `
    PLEASE NOTE:
    --------------------------------
    The library 'husky' was not found. 
    This is needed to trigger commit hooks
    that can be used to automatically lint, 
    format, run tests etc. before your 
    code gets pushed.

    Use 'uclif add:commit-hooks --help' 
    for more details.

    GUIDANCE :
    --------------------------------
    ${staticData.externalLinks.husky}
    --------------------------------
    `
  },
}
