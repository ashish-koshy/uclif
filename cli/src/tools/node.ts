import {
  SpawnSyncOptionsWithBufferEncoding,
  spawnSync,
  execSync,
} from 'node:child_process'
import {setCommonNxCommandParams} from './nx'

export const execute = (
  command: string,
  params: string[] | null = null,
  options: SpawnSyncOptionsWithBufferEncoding | null = null,
): void => {
  if (command) {
    if (!params) params = []
    if (!options) options = {
      shell: true,
      stdio: ['inherit', 'inherit', 'inherit'],
    }
    params = setCommonNxCommandParams(command, params)
    spawnSync(command, params, options)
  }
}

export const executeWithOutput = (
  command: string,
): string => {
  try {
    const output = execSync(
      command,
      {encoding: 'utf-8'},
    )
    return output || ''
  } catch {
    return ''
  }
}
