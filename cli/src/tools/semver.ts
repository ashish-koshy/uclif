import semver = require('semver')

export const validatePackageVersion = (
  version: string | undefined,
  defaultVersion: string,
): string => {
  if (version) {
    const cleanedVersion = clean(version) || ''
    if (semver?.valid(cleanedVersion) !== null) return cleanedVersion
  }

  return defaultVersion
}

export const clean = (version: string): string => {
  if (!version) return ''
  version = version.replace('^', '')
  version = version.replace('~', '')
  return semver.clean(version) || ''
}
