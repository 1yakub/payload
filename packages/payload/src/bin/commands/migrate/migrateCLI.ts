import { Command, CommanderError } from 'commander'

import type { BinArgs, SanitizedConfig } from '../../../config/types.js'

import payload from '../../../index.js'
import { createMigrateCreateCommand } from './create.js'
import { createMigrateDownCommand } from './down.js'
import { createMigrateFreshCommand } from './fresh.js'
import { createMigrateCommand } from './index.js'
import { createMigrateRefreshCommand } from './refresh.js'
import { createMigrateResetCommand } from './reset.js'
import { createMigrateStatusCommand } from './status.js'

type MigrationParsedArgs = {
  _: string[]
  [key: string]: unknown
  file?: string
  forceAcceptWarning?: boolean
  help?: boolean
}

export const migrate = async ({
  config,
  migrationDir,
  parsedArgs,
}: {
  config: SanitizedConfig
  migrationDir?: string
  parsedArgs: MigrationParsedArgs
}): Promise<void> => {
  const args: BinArgs = {
    getConfig: () => Promise.resolve(config),
    async getPayload(options = {}) {
      await payload.init({ config, ...options })

      if (migrationDir) {
        payload.db.migrationDir = migrationDir
      }

      return payload
    },
    async run({ handler }) {
      await handler()
    },
  }
  const program = new Command().name('payload').exitOverride()

  program
    .addCommand(createMigrateCommand(args))
    .addCommand(createMigrateCreateCommand(args))
    .addCommand(createMigrateDownCommand(args))
    .addCommand(createMigrateFreshCommand(args))
    .addCommand(createMigrateRefreshCommand(args))
    .addCommand(createMigrateResetCommand(args))
    .addCommand(createMigrateStatusCommand(args))

  for (const command of program.commands) {
    command.exitOverride()
  }

  try {
    await program.parseAsync(toCommanderArguments(parsedArgs), { from: 'user' })
  } catch (error) {
    if (error instanceof CommanderError && error.exitCode === 0) {
      return
    }

    throw error
  }
}

const toCommanderArguments = (parsedArgs: MigrationParsedArgs): string[] => {
  const args = [...parsedArgs._]
  const optionNames = new Set(
    Object.keys(parsedArgs).map((key) =>
      key
        .replace(/^[-_]+/, '')
        .replaceAll('-', '')
        .toLowerCase(),
    ),
  )

  if (parsedArgs.file) {
    args.push('--file', parsedArgs.file)
  }
  if (parsedArgs.forceAcceptWarning === true || optionNames.has('forceacceptwarning')) {
    args.push('--force-accept-warning')
  }
  if (optionNames.has('skipempty')) {
    args.push('--skip-empty')
  }
  if (parsedArgs.help) {
    args.push('--help')
  }

  return args
}
