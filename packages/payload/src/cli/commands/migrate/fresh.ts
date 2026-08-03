import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateFreshCommand: CLICommand = (args) =>
  new Command('migrate:fresh')
    .description('Run all migrations from a clean database.')
    .helpGroup('Migration commands')
    .option('--force-accept-warning', 'Skip the destructive migration warning.')
    .action((options: { forceAcceptWarning?: boolean }, command: Command) =>
      args.run({
        command,
        handler: async () => {
          const { adapter, payload } = await initializeMigration({ args })

          await adapter.migrateFresh({ forceAcceptWarning: options.forceAcceptWarning })
          payload.logger.info('Done.')
        },
      }),
    )
