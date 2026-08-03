import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateStatusCommand: CLICommand = (args) =>
  new Command('migrate:status')
    .description('Show migration status.')
    .helpGroup('Migration commands')
    .action((_options, command: Command) =>
      args.run({
        command,
        handler: async () => {
          const { adapter, payload } = await initializeMigration({ args })

          await adapter.migrateStatus()
          payload.logger.info('Done.')
        },
      }),
    )
