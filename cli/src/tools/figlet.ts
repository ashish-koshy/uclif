import figlet = require('figlet')

export const getFigletText = (
  text: string,
  options: figlet.Options,
): string => {
  return figlet.textSync(text, options) ?? ''
}
