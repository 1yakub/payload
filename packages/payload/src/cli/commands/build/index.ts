import { Command } from 'commander'

import type { CLICommand } from '../../../config/types.js'

import { build } from './build.js'

export const createBuildCommand: CLICommand = ({ getConfig, run }) =>
  new Command('build')
    .argument('[frameworkArgs...]')
    .description('Prepare Payload and run the detected framework build.')
    .helpGroup('Core commands')
    .allowUnknownOption()
    .option('--no-types', 'Skip Payload type generation.')
    .action((frameworkArgs: string[], options: { types: boolean }, command: Command) =>
      run({
        command,
        handler: async () => {
          await build({
            config: await getConfig(),
            forwardedArgs: frameworkArgs,
            skipTypes: !options.types,
          })
        },
      }),
    )
