import type { Payload, SanitizedConfig } from 'payload'
import type { BinArgs } from 'payload/cli'

import payload from 'payload'
import { createProgram } from 'payload/internal'

export const runCLICommand = async ({
  argv,
  config,
  preparePayload,
}: {
  argv: string[]
  config: SanitizedConfig
  preparePayload?: ({ payload }: { payload: Payload }) => Promise<void> | void
}): Promise<void> => {
  const binArgs: BinArgs = {
    getConfig: () => Promise.resolve(config),
    async getPayload(options = {}) {
      await payload.init({ config, ...options })
      await preparePayload?.({ payload })

      return payload
    },
    async run({ handler }) {
      await handler()
    },
  }
  const program = await createProgram(binArgs)

  await program.parseAsync(argv, { from: 'user' })
}
