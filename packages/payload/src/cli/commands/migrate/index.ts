import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateCommand: CLICommand = (args) =>
  new Command('migrate')
    .description('Run pending migrations.')
    .helpGroup('Migration commands')
    .action((_options, command: Command) =>
      args.run({
        command,
        handler: async () => {
          const { adapter, payload } = await initializeMigration({ args })

          await adapter.migrate()
          payload.logger.info('Done.')
        },
      }),
    )
