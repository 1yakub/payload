/* eslint-disable no-console */
import { Command, CommanderError } from 'commander'

import type { CLIArgs, CLICommand } from '../config/types.js'

import { createCLIArgs } from './args.js'
import { createBuildCommand } from './commands/build/index.js'
import { createCountDocumentsCommand } from './commands/collections/countDocuments.js'
import { createCountVersionsCommand } from './commands/collections/countVersions.js'
import { createCreateDocumentsCommand } from './commands/collections/createDocuments.js'
import { createDeleteDocumentsCommand } from './commands/collections/deleteDocuments.js'
import { createDuplicateDocumentCommand } from './commands/collections/duplicateDocument.js'
import { createFindDistinctCommand } from './commands/collections/findDistinct.js'
import { createFindDocumentsCommand } from './commands/collections/findDocuments.js'
import { createFindVersionByIDCommand } from './commands/collections/findVersionByID.js'
import { createFindVersionsCommand } from './commands/collections/findVersions.js'
import { createGetCollectionSchemaCommand } from './commands/collections/getCollectionSchema.js'
import { createRestoreVersionCommand } from './commands/collections/restoreVersion.js'
import { createUpdateDocumentCommand } from './commands/collections/updateDocument.js'
import { createGenerateDBSchemaCommand } from './commands/generateDBSchema.js'
import { createGenerateImportMapCommand } from './commands/generateImportMap.js'
import { createGenerateTypesCommand } from './commands/generateTypes.js'
import { createGetConfigInfoCommand } from './commands/getConfigInfo.js'
import { createCountGlobalVersionsCommand } from './commands/globals/countGlobalVersions.js'
import { createFindGlobalCommand } from './commands/globals/findGlobal.js'
import { createFindGlobalVersionByIDCommand } from './commands/globals/findGlobalVersionByID.js'
import { createFindGlobalVersionsCommand } from './commands/globals/findGlobalVersions.js'
import { createGetGlobalSchemaCommand } from './commands/globals/getGlobalSchema.js'
import { createRestoreGlobalVersionCommand } from './commands/globals/restoreGlobalVersion.js'
import { createUpdateGlobalCommand } from './commands/globals/updateGlobal.js'
import { createHelpCommand } from './commands/help.js'
import { createInfoCommand } from './commands/info.js'
import { createJobsHandleSchedulesCommand } from './commands/jobs/handleSchedules.js'
import { createJobsRunCommand } from './commands/jobs/run.js'
import { createMigrateCreateCommand } from './commands/migrate/create.js'
import { createMigrateDownCommand } from './commands/migrate/down.js'
import { createMigrateFreshCommand } from './commands/migrate/fresh.js'
import { createMigrateCommand } from './commands/migrate/index.js'
import { createMigrateRefreshCommand } from './commands/migrate/refresh.js'
import { createMigrateResetCommand } from './commands/migrate/reset.js'
import { createMigrateStatusCommand } from './commands/migrate/status.js'
import { createRunCommand } from './commands/run.js'
import { loadEnv } from './loadEnv.js'

const commands: CLICommand[] = [
  createInfoCommand,
  createRunCommand,
  createBuildCommand,
  createGenerateTypesCommand,
  createGenerateImportMapCommand,
  createGenerateDBSchemaCommand,
  createJobsRunCommand,
  createJobsHandleSchedulesCommand,
  createHelpCommand,
  createMigrateCommand,
  createMigrateDownCommand,
  createMigrateFreshCommand,
  createMigrateRefreshCommand,
  createMigrateResetCommand,
  createMigrateStatusCommand,
  createMigrateCreateCommand,
  createGetConfigInfoCommand,
  createCountDocumentsCommand,
  createCountVersionsCommand,
  createCreateDocumentsCommand,
  createDeleteDocumentsCommand,
  createDuplicateDocumentCommand,
  createFindDistinctCommand,
  createFindDocumentsCommand,
  createFindVersionByIDCommand,
  createFindVersionsCommand,
  createGetCollectionSchemaCommand,
  createRestoreVersionCommand,
  createUpdateDocumentCommand,
  createCountGlobalVersionsCommand,
  createFindGlobalCommand,
  createFindGlobalVersionByIDCommand,
  createFindGlobalVersionsCommand,
  createGetGlobalSchemaCommand,
  createRestoreGlobalVersionCommand,
  createUpdateGlobalCommand,
]

export const createProgram = async (args: CLIArgs): Promise<Command> => {
  const program = new Command()
    .name('payload')
    .description('Manage and operate a local Payload project.')
    .exitOverride()
    .showHelpAfterError()
    .showSuggestionAfterError()
    .option('--cron <expression>', 'Run the command on a cron schedule.')
  const config = await args.getConfig()

  for (const createCommand of [...commands, ...(config.cli?.commands ?? [])]) {
    program.addCommand(createCommand(args))
  }

  for (const command of program.commands) {
    command.exitOverride()
  }

  return program
}

export const bin = async (): Promise<void> => {
  loadEnv()
  process.env.DISABLE_PAYLOAD_HMR = 'true'

  const args = createCLIArgs()

  try {
    const program = await createProgram(args)

    if (process.argv.length === 2) {
      program.outputHelp()
    } else {
      await program.parseAsync(process.argv)
    }
  } catch (error) {
    if (error instanceof CommanderError) {
      process.exitCode = error.exitCode
    } else {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    }
  } finally {
    if (!args.isScheduled) {
      await args.destroy()
    }
  }
}
