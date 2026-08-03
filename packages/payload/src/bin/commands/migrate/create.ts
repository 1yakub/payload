import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { initializeMigration } from './initialize.js'

export const createMigrateCreateCommand: CLICommand = (args) =>
  new Command('migrate:create')
    .argument('[migrationName]')
    .description('Create a migration.')
    .helpGroup('Migration commands')
    .option('--file <path>', 'Create from a predefined migration module.')
    .option('--force-accept-warning', 'Skip the migration warning.')
    .option('--skip-empty', 'Do not create an empty migration.')
    .action(
      (
        migrationName: string | undefined,
        options: {
          file?: string
          forceAcceptWarning?: boolean
          skipEmpty?: boolean
        },
        command: Command,
      ) =>
        args.run({
          command,
          handler: async () => {
            const { adapter, payload } = await initializeMigration({
              args,
              disableDBConnect: true,
            })

            try {
              await adapter.createMigration({
                file: options.file,
                forceAcceptWarning: options.forceAcceptWarning,
                migrationName,
                payload,
                skipEmpty: options.skipEmpty,
              })
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Unknown error'

              throw new Error(`Error creating migration: ${message}`)
            }

            payload.logger.info('Done.')
          },
        }),
    )
