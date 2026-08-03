import { Command } from 'commander'

import type { CLICommand } from '../../config/types.js'

import { generateTypes } from '../generateTypes.js'

export const createGenerateTypesCommand: CLICommand = ({ getConfig, run }) =>
  new Command('generate:types')
    .description('Generate TypeScript types from the Payload config.')
    .helpGroup('Core commands')
    .action((_options, command: Command) =>
      run({
        command,
        handler: async () => {
          await generateTypes(await getConfig())
        },
      }),
    )
