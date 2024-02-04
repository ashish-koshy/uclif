```
  _   _  ____ _     ___ _____
 | | | |/ ___| |   |_ _|  ___|
 | | | | |   | |    | || |_
 | |_| | |___| |___ | ||  _|
  \___/ \____|_____|___|_|
```
# @uclif/cli

    npm i -g @uclif/cli@latest
#### [View usage instructions](https://github.com/ashish-koshy/uclif/blob/main/cli/USAGE.md)
#### [View changelog](https://github.com/ashish-koshy/uclif/blob/main/cli/CHANGELOG.md)
#### [View Nx Recipes](https://nx.dev/recipes)

General purpose JavaScript CLI created using the open source [Oclif](https://github.com/oclif) framework for automating the setup of new projects or implementing best practices into existing projects.

## !!! This is `not` another framework or programming language that you'll have to master !!!

Front-end/web-ui development ecosystem has been in an abstraction hell for the past decade. It has proven to be an antithesis to simplicity. This is especially true if you have been a part of an enterprise development team that does not have the freedom to choose its development toolset. Gone are the days when all you needed was a bloody code editor to be able to churn out something useful. 

Don't get me wrong, I appreciate the fact that frameworks like Angular, React etc. have introduced some very innovative paradigms into this space. I am also happy that Javascript has made coding accessible to a lot of people around the world, but it has also introduced several needless abstractions, dumb philosophies and design patterns into it as a result.

I can feel the hairs on my head going white every time I decide to setup a JavaScript project with 200 billion ways of doing the exact same thing and 500 billion different tools to service them that become deprecated the very next day. This is draining, tiresome and a wasteful use of one's time.

## I am fatigued by the sheer volume of choices and configurations for JavaScript:

This CLI tool is not a solution but a reaction to all of the above. It is a necesssary evil that is required for me to be able to focus on my product and its functionalities rather than wasting my time on setting up everything else surrounding it.

In simple terms, this tool automates what you can already do manually but it makes your computer do most of the tasks rather than it being the other way around. It eliminates the fatigue of having to choose between so many different things and makes the choices for you so you can get started with your bloody business!

#
## To debug locally :
Publish this package locally for debugging, run `npm install` and then run `npm run publish-local`
You can then invoke the CLI using the command `uclif` from any terminal on your machine. 
#
## Before raising a PR or preparing for release :
Once you have validated your changes by debugging locally, commit your code and generate a release version before pushing your branch to the remote repository to raise a pull request : 

    npm run release

#
## Command to Rebuild Azure pipeline templates :

    uclif add:azure:template:node --package --packageNameSpace=@uclif --workingDirectory=./cli/ --triggerPathPattern=cli/*
#

<!-- tocstop -->
* [Commands](#commands)
<!-- tocstop -->

# Commands
<!-- commands -->
* [`uclif add`](#uclif-add)
* [`uclif add:azure`](#uclif-addazure)
* [`uclif add:azure:template`](#uclif-addazuretemplate)
* [`uclif add:azure:template:node`](#uclif-addazuretemplatenode)
* [`uclif add:code-formatter`](#uclif-addcode-formatter)
* [`uclif add:code-linter`](#uclif-addcode-linter)
* [`uclif add:commit-checks`](#uclif-addcommit-checks)
* [`uclif add:commit-hooks`](#uclif-addcommit-hooks)
* [`uclif add:ng`](#uclif-addng)
* [`uclif add:ng:app`](#uclif-addngapp)
* [`uclif add:ng:core`](#uclif-addngcore)
* [`uclif add:ng:helpers`](#uclif-addnghelpers)
* [`uclif add:ng:packages`](#uclif-addngpackages)
* [`uclif add:ng:schematics`](#uclif-addngschematics)
* [`uclif add:node`](#uclif-addnode)
* [`uclif add:node:app`](#uclif-addnodeapp)
* [`uclif add:node:packages`](#uclif-addnodepackages)
* [`uclif add:react`](#uclif-addreact)
* [`uclif add:react:app`](#uclif-addreactapp)
* [`uclif add:react:packages`](#uclif-addreactpackages)
* [`uclif modify`](#uclif-modify)
* [`uclif modify:base-href`](#uclif-modifybase-href)
* [`uclif new [NAME]`](#uclif-new-name)
* [`uclif run`](#uclif-run)
* [`uclif run:ng`](#uclif-runng)
* [`uclif run:ng:schematics`](#uclif-runngschematics)
* [`uclif version`](#uclif-version)

## `uclif add`

Add items to your workspace.

```
USAGE
  $ uclif add [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add items to your workspace.

EXAMPLES
  $ uclif add
```

## `uclif add:azure`

Add items related to Microsoft Azure DevOps.

```
USAGE
  $ uclif add:azure [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add items related to Microsoft Azure DevOps.

EXAMPLES
  $ uclif add:azure
```

## `uclif add:azure:template`

Add '.YML' templates for Microsoft Azure DevOps.

```
USAGE
  $ uclif add:azure:template [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add '.YML' templates for Microsoft Azure DevOps.

EXAMPLES
  $ uclif add:azure:template
```

## `uclif add:azure:template:node`

Add Node based '.YML' templates for Microsoft Azure DevOps.

```
USAGE
  $ uclif add:azure:template:node [--nonInteractive] [--package] [--nodeVersion <value>] [--variableGroupName <value>]
    [--vmImage <value>] [--installParams <value>] [--lintParams <value>] [--testParams <value>] [--buildParams <value>]
    [--workingDirectory <value>] [--buildArtifactPath <value>] [--triggerPathPattern <value>] [--trunkBranchName
    <value>] [--packageNameSpace <value>] [--packageOrgName <value>] [--packageFeed <value>] [--packageRegistry <value>]
    [--packagePublishAuthName <value>] [--packagePublishAuthToken <value>] [--packagePublishPath <value>]

FLAGS
  --buildArtifactPath=<value>        [default: ./dist] Specify the directory that would contain the generated build
                                     artifacts.
  --buildParams=<value>              Additional flags or parameters to be added to the  'build' script.
  --installParams=<value>            Additional flags or parameters to be added to the 'install' command.
  --lintParams=<value>               Additional flags or parameters to be added to the 'lint' script.
  --nodeVersion=<value>              [default: 16.15.0] Specify a node version.
  --nonInteractive                   Set this flag to skip all the user prompts rendered in the console.
  --package                          Set this flag to true if you wish to configure and publish your artifacts as a node
                                     package.
  --packageFeed=<value>              [default: $(packageFeed)] Package feed id or azure variable name.
  --packageNameSpace=<value>         [default: @namespace] Specify your package namespace like: @namespace
  --packageOrgName=<value>           [default: $(packageOrgName)] Organization name or azure variable name.
  --packagePublishAuthName=<value>   [default: $(packagePublishAuthName)] User name to access your package registry or
                                     azure variable name.
  --packagePublishAuthToken=<value>  [default: $(packagePublishAuthToken)] Password to access your package registry or
                                     azure variable name.
  --packagePublishPath=<value>       [default: ./] Specify the relative path of the directory that needs to be published
                                     as a node package.
  --packageRegistry=<value>          [default: $(packageRegistry)] Package registry path or azure variable name.
  --testParams=<value>               Additional flags or parameters to be added to the 'test' script.
  --triggerPathPattern=<value>       Specify a glob pattern if you only wish to trigger the pipline for changes under a
                                     specific directory (optional).
  --trunkBranchName=<value>          [default: master] Specify a name for your trunk branch.
  --variableGroupName=<value>        Specify the name of your Azure variable group if any.
  --vmImage=<value>                  [default: ubuntu-latest] Specify the type of virtual machine you wish to use.
  --workingDirectory=<value>         [default: ./] If your project is in a sub directory, specify its relative path from
                                     the root.

DESCRIPTION
  Add Node based '.YML' templates for Microsoft Azure DevOps.

EXAMPLES
  $ uclif add:azure:template:node
```

## `uclif add:code-formatter`

Add the 'prettier' library to automatically format and beautify your code.

```
USAGE
  $ uclif add:code-formatter [--nonInteractive] [--autoFormatOnSave <value>] [--addCommitHook <value>]
    [--organizeImportsOnSave <value>] [--formatter <value>] [--tabSize <value>]

FLAGS
  --addCommitHook=<value>          [default: true] Set this to false if you do not wish add a pre-commit hook to
                                   automatically format your code.
  --autoFormatOnSave=<value>       [default: true] Set this to false if you do not wish to automatically format your
                                   code when you save a file.
  --formatter=<value>              [default: esbenp.prettier-vscode] Formatter used by VS Code to format: typescript,
                                   html or css files.
  --nonInteractive                 Set this flag to skip all the user prompts rendered in the console.
  --organizeImportsOnSave=<value>  [default: true] Set this to false if you do not wish to automatically organize the
                                   import statements when you save a file.
  --tabSize=<value>                [default: 2] Tab size to be enforced.

DESCRIPTION
  Add the 'prettier' library to automatically format and beautify your code.

EXAMPLES
  $ uclif add:code-formatter
```

## `uclif add:code-linter`

Add the 'eslint' library to find logical, semantic or type issues in your code.

```
USAGE
  $ uclif add:code-linter [--nonInteractive] [--addCommitHook <value>] [--autoLintOnSave <value>]

FLAGS
  --addCommitHook=<value>   [default: true] Set this to false if you do not wish add a pre-commit hook to check for lint
                            errors.
  --autoLintOnSave=<value>  [default: true] Set this to false if you do not wish to automatically lint your code when
                            you save a file.
  --nonInteractive          Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add the 'eslint' library to find logical, semantic or type issues in your code.

EXAMPLES
  $ uclif add:code-linter
```

## `uclif add:commit-checks`

Sequentially runs 'add:commit-hooks' => 'add:code-linter' => 'add:code-formatter'

```
USAGE
  $ uclif add:commit-checks [--nonInteractive] [--projectPath <value>] [--relativeGitFolderPath <value>]
    [--autoLintOnSave <value>] [--autoFormatOnSave <value>] [--organizeImportsOnSave <value>] [--formatter <value>]
    [--tabSize <value>]

FLAGS
  --autoFormatOnSave=<value>       [default: true] Set this to false if you do not wish to automatically format your
                                   code when you save a file.
  --autoLintOnSave=<value>         [default: true] Set this to false if you do not wish to automatically lint your code
                                   when you save a file.
  --formatter=<value>              [default: esbenp.prettier-vscode] Formatter used by VS Code to format: typescript,
                                   html or css files.
  --nonInteractive                 Set this flag to skip all the user prompts rendered in the console.
  --organizeImportsOnSave=<value>  [default: true] Set this to false if you do not wish to automatically organize the
                                   import statements when you save a file.
  --projectPath=<value>            Relative path of your project directory from your repository's
                                   root directory. For e.g - 'some-directory/project-directory'
  --relativeGitFolderPath=<value>  Relative path of your repository's '.git' directory
                                   from your project directory. For e.g - '../../../'
  --tabSize=<value>                [default: 2] Tab size to be enforced.

DESCRIPTION
  Sequentially runs 'add:commit-hooks' => 'add:code-linter' => 'add:code-formatter'

EXAMPLES
  $ uclif add:commit-checks
```

## `uclif add:commit-hooks`

Add the 'husky' library to generate commit hooks to validate code sanity before commits are created and pushed.

```
USAGE
  $ uclif add:commit-hooks [--nonInteractive] [--projectPath <value>] [--relativeGitFolderPath <value>]

FLAGS
  --nonInteractive                 Set this flag to skip all the user prompts rendered in the console.
  --projectPath=<value>            Relative path of your project directory from your repository's
                                   root directory. For e.g - 'some-directory/project-directory'
  --relativeGitFolderPath=<value>  Relative path of your repository's '.git' directory
                                   from your project directory. For e.g - '../../../'

DESCRIPTION
  Add the 'husky' library to generate commit hooks to validate code sanity before commits are created and pushed.

EXAMPLES
  $ uclif add:commit-hooks
```

## `uclif add:ng`

Add items related to the Angular ecosystem into your existing Nx workspace.

```
USAGE
  $ uclif add:ng [--nonInteractive] [--core <value>] [--schematics <value>] [--hybridAppName <value>]
    [--hostAppName <value>] [--remoteAppName <value>] [--regularAppName <value>] [--libraryName <value>] [--styleType
    <value>] [--unitTestRunner <value>] [--endToEndTestRunner <value>]

FLAGS
  --core=<value>                Overrides default version for Uclif Core package supported by this CLI.
  --endToEndTestRunner=<value>  [default: none] Available end to end test runners - cypress | none
  --hostAppName=<value>         Name for 'host' application in 'kebab-case'
  --hybridAppName=<value>       Name for 'ionic' application in 'kebab-case'
  --libraryName=<value>         Name for Angular 'library' in 'kebab-case'. Comma separated for multiple entries
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --regularAppName=<value>      Name for 'regular' Angular application in 'kebab-case'
  --remoteAppName=<value>       Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries
  --schematics=<value>          Overrides default version for Uclif Schematics package supported by this CLI.
  --styleType=<value>           [default: scss] Available style types - scss | css
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add items related to the Angular ecosystem into your existing Nx workspace.

EXAMPLES
  $ uclif add:ng
```

## `uclif add:ng:app`

Add new Angular applications to an existing Nx workspace.

```
USAGE
  $ uclif add:ng:app [--nonInteractive] [--hybridAppName <value>] [--hostAppName <value>] [--remoteAppName
    <value>] [--libraryName <value>] [--regularAppName <value>] [--styleType <value>] [--unitTestRunner <value>]
    [--endToEndTestRunner <value>]

FLAGS
  --endToEndTestRunner=<value>  [default: none] Available end to end test runners - cypress | none
  --hostAppName=<value>         Name for 'host' application in 'kebab-case'
  --hybridAppName=<value>       Name for 'ionic' application in 'kebab-case'
  --libraryName=<value>         Name for Angular 'library' in 'kebab-case'. Comma separated for multiple entries
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --regularAppName=<value>      Name for 'regular' Angular application in 'kebab-case'
  --remoteAppName=<value>       Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries
  --styleType=<value>           [default: scss] Available style types - scss | css
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add new Angular applications to an existing Nx workspace.

EXAMPLES
  $ uclif add:ng:app
```

## `uclif add:ng:core`

Add Uclif Core package to import commonly used Angular modules.

```
USAGE
  $ uclif add:ng:core [--nonInteractive] [-v <value>]

FLAGS
  -v, --version=<value>  Overrides default version for Uclif Core package supported by this CLI.
  --nonInteractive       Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add Uclif Core package to import commonly used Angular modules.

EXAMPLES
  $ uclif add:ng:core
```

## `uclif add:ng:helpers`

Sequentially runs 'add:ng:core' => 'add:ng:schematics'

```
USAGE
  $ uclif add:ng:helpers [--nonInteractive] [--core <value>] [--schematics <value>]

FLAGS
  --core=<value>        Overrides default version for Uclif Core package supported by this CLI.
  --nonInteractive      Set this flag to skip all the user prompts rendered in the console.
  --schematics=<value>  Overrides default version for Uclif Schematics package supported by this CLI.

DESCRIPTION
  Sequentially runs 'add:ng:core' => 'add:ng:schematics'

EXAMPLES
  $ uclif add:ng:helpers
```

## `uclif add:ng:packages`

Add Nx Angular packages to an existing Nx workspace.

```
USAGE
  $ uclif add:ng:packages [--nonInteractive] [--hybrid <value>]

FLAGS
  --hybrid=<value>  [default: false] Set this flag to add Nx Ionic Angular extension.
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add Nx Angular packages to an existing Nx workspace.

EXAMPLES
  $ uclif add:ng:packages
```

## `uclif add:ng:schematics`

Add Uclif Schematics for generating Angular code.

```
USAGE
  $ uclif add:ng:schematics [--nonInteractive] [-v <value>]

FLAGS
  -v, --version=<value>  Overrides default version for Uclif Schematics package supported by this CLI.
  --nonInteractive       Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add Uclif Schematics for generating Angular code.

EXAMPLES
  $ uclif add:ng:schematics
```

## `uclif add:node`

Add items related to the Node ecosystem into your existing Nx workspace.

```
USAGE
  $ uclif add:node [--nonInteractive] [--name <value>] [--port <value>] [--framework <value>]
    [--unitTestRunner <value>] [--endToEndTestRunner <value>] [--bundler <value>] [--frontendProject <value>]

FLAGS
  --bundler=<value>             [default: esbuild] Available bundlers - esbuild | webpack
  --endToEndTestRunner=<value>  [default: jest] Available end to end test runners - jest | none
  --framework=<value>           [default: express] Available node frameworks - express | fastify | koa | nest | none
  --frontendProject=<value>     Frontend project that needs to access this application. This sets up proxy
                                configuration.
  --name=<value>                Name of you NodeJS application
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --port=<value>                [default: 3000] The port which the server will be run on
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add items related to the Node ecosystem into your existing Nx workspace.

EXAMPLES
  $ uclif add:node
```

## `uclif add:node:app`

Add a basic NodeJS + Express application that uses TypeScript

```
USAGE
  $ uclif add:node:app [--nonInteractive] [--name <value>] [--port <value>] [--framework <value>]
    [--unitTestRunner <value>] [--endToEndTestRunner <value>] [--bundler <value>] [--frontendProject <value>]

FLAGS
  --bundler=<value>             [default: esbuild] Available bundlers - esbuild | webpack
  --endToEndTestRunner=<value>  [default: jest] Available end to end test runners - jest | none
  --framework=<value>           [default: express] Available node frameworks - express | fastify | koa | nest | none
  --frontendProject=<value>     Frontend project that needs to access this application. This sets up proxy
                                configuration.
  --name=<value>                Name of you NodeJS application
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --port=<value>                [default: 3000] The port which the server will be run on
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add a basic NodeJS + Express application that uses TypeScript

EXAMPLES
  $ uclif add:node:app
```

## `uclif add:node:packages`

Add Nx Node packages to an existing Nx workspace.

```
USAGE
  $ uclif add:node:packages [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add Nx Node packages to an existing Nx workspace.

EXAMPLES
  $ uclif add:node:packages
```

## `uclif add:react`

Add items related to the React ecosystem into your existing Nx workspace.

```
USAGE
  $ uclif add:react [--nonInteractive] [--core <value>] [--schematics <value>] [--hybridAppName <value>]
    [--hostAppName <value>] [--remoteAppName <value>] [--regularAppName <value>] [--libraryName <value>] [--styleType
    <value>] [--unitTestRunner <value>] [--endToEndTestRunner <value>]

FLAGS
  --core=<value>
  --endToEndTestRunner=<value>  [default: none] Available end to end test runners - cypress | none
  --hostAppName=<value>         Name for 'host' application in 'kebab-case'
  --hybridAppName=<value>       Name for 'React Native' application in 'kebab-case'
  --libraryName=<value>         Name for React 'library' in 'kebab-case'. Comma separated for multiple entries
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --regularAppName=<value>      Name for 'regular' React application in 'kebab-case'
  --remoteAppName=<value>       Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries
  --schematics=<value>
  --styleType=<value>           [default: scss] Available style types - scss | css
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add items related to the React ecosystem into your existing Nx workspace.

EXAMPLES
  $ uclif add:react
```

## `uclif add:react:app`

Add new React applications to an existing Nx workspace.

```
USAGE
  $ uclif add:react:app [--nonInteractive] [--hybridAppName <value>] [--hostAppName <value>] [--remoteAppName
    <value>] [--libraryName <value>] [--regularAppName <value>] [--styleType <value>] [--unitTestRunner <value>]
    [--endToEndTestRunner <value>]

FLAGS
  --endToEndTestRunner=<value>  [default: none] Available end to end test runners - cypress | none
  --hostAppName=<value>         Name for 'host' application in 'kebab-case'
  --hybridAppName=<value>       Name for 'React Native' application in 'kebab-case'
  --libraryName=<value>         Name for React 'library' in 'kebab-case'. Comma separated for multiple entries
  --nonInteractive              Set this flag to skip all the user prompts rendered in the console.
  --regularAppName=<value>      Name for 'regular' React application in 'kebab-case'
  --remoteAppName=<value>       Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries
  --styleType=<value>           [default: scss] Available style types - scss | css
  --unitTestRunner=<value>      [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Add new React applications to an existing Nx workspace.

EXAMPLES
  $ uclif add:react:app
```

## `uclif add:react:packages`

Add Nx React packages to an existing Nx workspace.

```
USAGE
  $ uclif add:react:packages [--nonInteractive] [--hybrid <value>]

FLAGS
  --hybrid=<value>  [default: false] Set this flag to add Nx React Native extension.
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Add Nx React packages to an existing Nx workspace.

EXAMPLES
  $ uclif add:react:packages
```

## `uclif modify`

Modify items in your workspace.

```
USAGE
  $ uclif modify [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Modify items in your workspace.

EXAMPLES
  $ uclif modify
```

## `uclif modify:base-href`

Change the base => href attribute in an existing 'index.html' file.

```
USAGE
  $ uclif modify:base-href [--nonInteractive] [--htmlRoot <value>] [--baseHref <value>]

FLAGS
  --baseHref=<value>  Path to be added as a 'base-href' attribute.
  --htmlRoot=<value>  Path to the directory containing the 'index.html' at its root.
  --nonInteractive    Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Change the base => href attribute in an existing 'index.html' file.

EXAMPLES
  $ uclif modify:base-href
```

## `uclif new [NAME]`

Create new Client Project Nx Workspace.

```
USAGE
  $ uclif new [NAME] [--nonInteractive] [--nx <value>] [--framework <value>] [--hybridAppName <value>]
    [--hostAppName <value>] [--remoteAppName <value>] [--regularAppName <value>] [--libraryName <value>] [--styleType
    <value>] [--unitTestRunner <value>] [--endToEndTestRunner <value>] [--core <value>] [--schematics <value>]
    [--addCommitChecks <value>] [--projectPath <value>] [--relativeGitFolderPath <value>] [--autoLintOnSave <value>]
    [--autoFormatOnSave <value>] [--organizeImportsOnSave <value>] [--formatter <value>] [--tabSize <value>]

ARGUMENTS
  NAME  Name of the new Client Project Nx Workspace

FLAGS
  --addCommitChecks=<value>        [default: true] Set this to false if you do no wish to add commit validations
  --autoFormatOnSave=<value>       [default: true] Set this to false if you do not wish to automatically format your
                                   code when you save a file.
  --autoLintOnSave=<value>         [default: true] Set this to false if you do not wish to automatically lint your code
                                   when you save a file.
  --core=<value>                   Override package version for organization specific client core modules.
  --endToEndTestRunner=<value>     [default: none] Available end to end test runners - cypress | none
  --formatter=<value>              [default: esbenp.prettier-vscode] Formatter used by VS Code to format: typescript,
                                   html or css files.
  --framework=<value>              [default: angular] Available framework types - angular | vue | react | typescript
  --hostAppName=<value>            Name for 'host' application in 'kebab-case'
  --hybridAppName=<value>          Name for 'ionic' application in 'kebab-case'
  --libraryName=<value>            Name for Angular 'library' in 'kebab-case'. Comma separated for multiple entries
  --nonInteractive                 Set this flag to skip all the user prompts rendered in the console.
  --nx=<value>                     [default: 15.0.0] Compatible versions of Nx: >=14.0.0 and <=17.0.0
  --organizeImportsOnSave=<value>  [default: true] Set this to false if you do not wish to automatically organize the
                                   import statements when you save a file.
  --projectPath=<value>            Relative path of your project directory from your repository's
                                   root directory. For e.g - 'some-directory/project-directory'
  --regularAppName=<value>         Name for 'regular' Angular application in 'kebab-case'
  --relativeGitFolderPath=<value>  Relative path of your repository's '.git' directory
                                   from your project directory. For e.g - '../../../'
  --remoteAppName=<value>          Name for 'remote' application in 'kebab-case'. Comma separated for multiple entries
  --schematics=<value>             Override package version for organization specific client schematics library.
  --styleType=<value>              [default: scss] Available style types - scss | css
  --tabSize=<value>                [default: 2] Tab size to be enforced.
  --unitTestRunner=<value>         [default: jest] Available unit test runners - jest | none

DESCRIPTION
  Create new Client Project Nx Workspace.

EXAMPLES
  $ uclif new
```

## `uclif run`

Run custom tools, generators, schematics etc.

```
USAGE
  $ uclif run [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Run custom tools, generators, schematics etc.

EXAMPLES
  $ uclif run
```

## `uclif run:ng`

Run custom tools, generators or schematics for the Angular ecosystem.

```
USAGE
  $ uclif run:ng [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Run custom tools, generators or schematics for the Angular ecosystem.

EXAMPLES
  $ uclif run:ng
```

## `uclif run:ng:schematics`

Run Ng Schematics for an existing Angular application.

```
USAGE
  $ uclif run:ng:schematics [--nonInteractive] [--schema <value>] [--appName <value>] [--schemaRunnerFlag <value>]

FLAGS
  --appName=<value>           If your workspace has multiple apps, specify the name of the app for which you
                              would like to run the schema.
  --nonInteractive            Set this flag to skip all the user prompts rendered in the console.
  --schema=<value>            Name of the schema you
                              would like to run from - @uclif/ng-schematics
  --schemaRunnerFlag=<value>  Any flag that you wish to pass into the Angular Schematics CLI runner.

DESCRIPTION
  Run Ng Schematics for an existing Angular application.

EXAMPLES
  $ uclif run:ng:schematics
```

## `uclif version`

Display the installed version of uclif.

```
USAGE
  $ uclif version [--nonInteractive]

FLAGS
  --nonInteractive  Set this flag to skip all the user prompts rendered in the console.

DESCRIPTION
  Display the installed version of uclif.

EXAMPLES
  $ uclif version
```
<!-- commandsstop -->
