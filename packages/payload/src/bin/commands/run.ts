import { Command } from 'commander'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import type { CLICommand } from '../../config/types.js'

export const createRunCommand: CLICommand = ({ run }) =>
  new Command('run')
    .argument('<scriptPath>')
    .argument('[scriptArgs...]')
    .description('Run a local script in the Payload environment.')
    .helpGroup('Core commands')
    .allowUnknownOption()
    .action((scriptPath: string, scriptArgs: string[], _options, command: Command) =>
      run({
        command,
        handler: () => runScript({ scriptArgs, scriptPath }),
      }),
    )

const runScript = async ({
  scriptArgs,
  scriptPath,
}: {
  scriptArgs: string[]
  scriptPath: string
}): Promise<void> => {
  const absoluteScriptPath = path.resolve(process.cwd(), scriptPath)
  const originalArgv = process.argv

  process.argv = [process.argv[0]!, process.argv[1]!, ...scriptArgs]

  try {
    await import(pathToFileURL(absoluteScriptPath).toString())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    throw new Error(`Error running script ${absoluteScriptPath}: ${message}`)
  } finally {
    process.argv = originalArgv
  }
}
