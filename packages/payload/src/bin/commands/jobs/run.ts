import { Command, InvalidArgumentError } from 'commander'

import type { CLICommand } from '../../../config/types.js'

export const createJobsRunCommand: CLICommand = ({ getPayload, run }) =>
  new Command('jobs:run')
    .description('Run queued jobs.')
    .helpGroup('Core commands')
    .option('--queue <queue>', 'Only run jobs from this queue.')
    .option('--all-queues', 'Run jobs from all queues.')
    .option('--handle-schedules', 'Queue due scheduled jobs before running.')
    .option('--limit <number>', 'Maximum number of jobs to run.', parseInteger)
    .action(
      (
        options: {
          allQueues?: boolean
          handleSchedules?: boolean
          limit?: number
          queue?: string
        },
        command: Command,
      ) =>
        run({
          command,
          handler: async () => {
            const payload = await getPayload()

            if (options.handleSchedules) {
              await payload.jobs.handleSchedules({
                allQueues: options.allQueues,
                queue: options.queue,
              })
            }

            await payload.jobs.run({
              allQueues: options.allQueues,
              limit: options.limit,
              queue: options.queue,
            })
          },
        }),
    )

const parseInteger = (value: string): number => {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed)) {
    throw new InvalidArgumentError('Must be a number.')
  }

  return parsed
}
