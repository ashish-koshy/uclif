export const commitLintDefaults = {
  commitLintConfigFile: 'commitlint.config.js',
  commitLintConfig:
`
module.exports = { 
  extends: [
    '@commitlint/config-conventional'
  ] 
};

/**
 * FYI - Excluding projects in an 'nx' work-space
 * https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-nx-scopes
 */
`,
}
