import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateResetCommand: CLICommand = (args) =>
  new Command('migrate:reset')
    .description('Roll back all migrations.')
    .helpGroup('Migration commands')
    .action((_options, command: Command) =>
      args.run({
        command,
        handler: async () => {
          const { adapter, payload } = await initializeMigration({ args })

          await adapter.migrateReset()
          payload.logger.info('Done.')
        },
      }),
    )
