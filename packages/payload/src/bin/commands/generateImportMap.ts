import { Command } from 'commander'

import type { CLICommand } from '../../config/types.js'

import { generateImportMap } from '../generateImportMap/index.js'

export const createGenerateImportMapCommand: CLICommand = ({ getConfig, run }) =>
  new Command('generate:importmap')
    .description('Generate the admin import map.')
    .helpGroup('Core commands')
    .action((_options, command: Command) =>
      run({
        command,
        handler: async () => {
          await generateImportMap(await getConfig())
        },
      }),
    )
