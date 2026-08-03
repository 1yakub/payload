import { writeFileSync } from 'fs'
import type { CLICommand } from 'payload/cli'
import { Command } from 'payload/cli'

import { testFilePath } from './testFilePath.js'

export const createStartServerCommand: CLICommand = ({ getPayload, run }) =>
  new Command('start-server')
    .description('Write the current users to the CLI test file.')
    .action((_options, command: Command) =>
      run({
        command,
        handler: async () => {
          const payload = await getPayload()
          const data = await payload.find({ collection: 'users' })

          writeFileSync(testFilePath, JSON.stringify(data), 'utf-8')
        },
      }),
    )
