export const isValidHtmlSelector = (input: string): boolean => {
  return /^[A-Za-z][\d.A-Za-z]*(:?-[A-Za-z][\d.A-Za-z]*)*$/.test(input)
}

export const isValidKebabCase = (input: string): boolean => {
  return (/^[A-Za-z]/.test(input) && /^([a-z][\da-z]*)(-[\da-z]+)*$/.test(input))
}

export const isValidRelativePath = (input: string): boolean => {
  return (/^[./]*$/.test(input))
}

/**
 * Validate multiple comma separated kebab case inputs
 * @param input comma separated string of kebab case inputs
 * @returns boolean
 */
export const areValidKebabCases = (input: string): boolean => {
  return input
  .split(',')
  .map(item => item.trim())
  .filter(item => item)
  .filter(item => !isValidKebabCase(item)).length === 0
}
