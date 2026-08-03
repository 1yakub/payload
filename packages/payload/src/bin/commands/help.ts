import { Command } from 'commander'

import type { CLICommand } from '../../config/types.js'

export const createHelpCommand: CLICommand = () =>
  new Command('help')
    .description('Display help for Payload commands.')
    .helpGroup('Core commands')
    .action((_options, command: Command) => command.parent?.help())
