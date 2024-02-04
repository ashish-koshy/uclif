import {packageExists} from './npm'

export const isVueWorkspace = (): boolean => {
  return packageExists('vue') !== ''
}

export const getVueVersion = (): string => {
  return packageExists('vue') ?? ''
}
