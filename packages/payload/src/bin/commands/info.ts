import { Command } from 'commander'
import { execFileSync } from 'node:child_process'
import os from 'node:os'

import type { CLICommand } from '../../config/types.js'

import { getDependencies } from '../../index.js'
import { PAYLOAD_PACKAGE_LIST } from '../../versions/payloadPackageList.js'

export const createInfoCommand: CLICommand = ({ run }) =>
  new Command('info')
    .description('Print environment and dependency information.')
    .helpGroup('Core commands')
    .action((_options, command: Command) =>
      run({
        command,
        handler: info,
      }),
    )

const info = async (): Promise<void> => {
  const dependencies = await getDependencies(process.cwd(), [
    ...PAYLOAD_PACKAGE_LIST,
    'next',
    'react',
    'react-dom',
  ])
  const formattedDependencies = Array.from(dependencies.resolved.entries()).map(
    ([name, { version }]) => ({ name, version }),
  )

  // eslint-disable-next-line no-console
  console.log(generateOutput(formattedDependencies))
}

const generateOutput = (packages: Array<{ name: string; version: string }>): string => {
  const cpuCores = os.cpus().length
  const primaryDependencies = packages.filter(({ name }) => name === 'payload' || name === 'next')
  const otherDependencies = packages
    .filter(({ name }) => name !== 'payload' && name !== 'next')
    .sort((a, b) => a.name.localeCompare(b.name))
  const formattedDependencies = [...primaryDependencies, ...otherDependencies]
    .map(({ name, version }) => `  ${name}: ${version}`)
    .join('\n')

  return `
Binaries:
  Node: ${process.versions.node}
  npm: ${getBinaryVersion('npm')}
  Yarn: ${getBinaryVersion('yarn')}
  pnpm: ${getBinaryVersion('pnpm')}
Relevant Packages:
${formattedDependencies}
Operating System:
  Platform: ${os.platform()}
  Arch: ${os.arch()}
  Version: ${os.version()}
  Available memory (MB): ${Math.ceil(os.totalmem() / 1024 / 1024)}
  Available CPU cores: ${cpuCores > 0 ? cpuCores : 'N/A'}
`
}

const getBinaryVersion = (binaryName: string): string => {
  try {
    return execFileSync(binaryName, ['--version']).toString().trim()
  } catch {
    return 'N/A'
  }
}
