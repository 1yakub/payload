import { Command } from 'commander'

import type { CLICommand } from '../../config/types.js'

export const createGenerateDBSchemaCommand: CLICommand = ({ getPayload, run }) =>
  new Command('generate:db-schema')
    .description('Generate the database adapter schema.')
    .helpGroup('Core commands')
    .option('--no-log', 'Disable adapter logging.')
    .option('--no-prettify', 'Disable schema prettification.')
    .action((options: { log: boolean; prettify: boolean }, command: Command) =>
      run({
        command,
        handler: async () => {
          const payload = await getPayload({
            disableDBConnect: true,
            disableOnInit: true,
          })

          if (typeof payload.db.generateSchema !== 'function') {
            throw new Error(`${payload.db.packageName} does not support database schema generation`)
          }

          await payload.db.generateSchema({
            log: options.log,
            prettify: options.prettify,
          })
        },
      }),
    )
