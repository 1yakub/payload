import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

export const createJobsHandleSchedulesCommand: CLICommand = ({ getPayload, run }) =>
  new Command('jobs:handle-schedules')
    .description('Queue due scheduled jobs.')
    .helpGroup('Core commands')
    .option('--queue <queue>', 'Only handle schedules for this queue.')
    .option('--all-queues', 'Handle schedules for all queues.')
    .action((options: { allQueues?: boolean; queue?: string }, command: Command) =>
      run({
        command,
        handler: async () => {
          const payload = await getPayload()

          await payload.jobs.handleSchedules({
            allQueues: options.allQueues,
            queue: options.queue,
          })
        },
      }),
    )
