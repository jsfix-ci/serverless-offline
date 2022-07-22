import { convert } from 'color-convert';
import boxen from 'boxen'
import chalk from 'chalk'

const { max } = Math

const blue = chalk.rgb(...convert.keyword.rgb('dodgerblue'))
const grey = chalk.rgb(...convert.keyword.rgb('grey'))
const lime = chalk.rgb(...convert.keyword.rgb('lime'))
const orange = chalk.rgb(...convert.keyword.rgb('orange'))
const peachpuff = chalk.rgb(...convert.keyword.rgb('peachpuff'))
const plum = chalk.rgb(...convert.keyword.rgb('plum'))
const red = chalk.rgb(...convert.keyword.rgb('red'))
const yellow = chalk.rgb(...convert.keyword.rgb('yellow'))

const colorMethodMapping = new Map([
  ['DELETE', red],
  ['GET', blue],
  // ['HEAD', ...],
  ['PATCH', orange],
  ['POST', plum],
  ['PUT', blue],
])

let log

export default function serverlessLog(msg) {
  if (log) {
    log(msg, 'offline')
  }
}

export function logLayers(msg) {
  console.log(`offline: ${blue(msg)}`)
}

export function setLog(serverlessLogRef) {
  log = serverlessLogRef
}

// logs based on:
// https://github.com/serverless/serverless/blob/master/lib/classes/CLI.js

function logRoute(method, server, path, maxLength, dimPath = false) {
  const methodColor = colorMethodMapping.get(method) ?? peachpuff
  const methodFormatted = method.padEnd(maxLength, ' ')

  return `${methodColor(methodFormatted)} ${yellow.dim('|')} ${grey.dim(
    server,
  )}${dimPath ? grey.dim(path) : lime(path)}`
}

function getMaxHttpMethodNameLength(routeInfo) {
  return max(...routeInfo.map(({ method }) => method.length))
}

export function logRoutes(routeInfo) {
  const boxenOptions = {
    borderColor: 'yellow',
    dimBorder: true,
    margin: 1,
    padding: 1,
  }
  const maxLength = getMaxHttpMethodNameLength(routeInfo)

  console.log(
    boxen(
      routeInfo
        .map(
          ({ method, path, server, invokePath }) =>
            // eslint-disable-next-line prefer-template
            logRoute(method, server, path, maxLength) +
            '\n' +
            logRoute('POST', server, invokePath, maxLength, true),
        )
        .join('\n'),
      boxenOptions,
    ),
  )
}

export function logWarning(msg) {
  console.log(`offline: ${red(msg)}`)
}
