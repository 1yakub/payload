import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateRefreshCommand: CLICommand = (args) =>
  new Command('migrate:refresh')
    .description('Roll back and re-run the latest migration batch.')
    .helpGroup('Migration commands')
    .action((_options, command: Command) =>
      args.run({
        command,
        handler: async () => {
          const { adapter, payload } = await initializeMigration({ args })

          await adapter.migrateRefresh()
          payload.logger.info('Done.')
        },
      }),
    )
