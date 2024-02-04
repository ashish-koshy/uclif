import {packageExists} from './npm'

export const isReactWorkspace = (): boolean => {
  return packageExists('react') !== ''
}

export const getVueVersion = (): string => {
  return packageExists('react') ?? ''
}
