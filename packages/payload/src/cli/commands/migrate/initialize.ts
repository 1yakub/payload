import type { CLIArgs } from '../../../config/types.js'
import type { BaseDatabaseAdapter } from '../../../database/types.js'
import type { Payload } from '../../../index.js'

import { prettySyncLoggerDestination } from '../../../utilities/logger.js'

const prettySyncLogger = {
  loggerDestination: prettySyncLoggerDestination,
  loggerOptions: {},
}

export const initializeMigration = async ({
  args,
  disableDBConnect = false,
}: {
  args: CLIArgs
  disableDBConnect?: boolean
}): Promise<{ adapter: BaseDatabaseAdapter; payload: Payload }> => {
  process.env.PAYLOAD_MIGRATING = 'true'

  const payload = await args.getPayload({
    disableDBConnect,
    disableOnInit: true,
    ...prettySyncLogger,
  })

  const adapter = payload.db

  if (!adapter) {
    throw new Error('No database adapter found')
  }

  return { adapter, payload }
}
