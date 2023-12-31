import _ from 'lodash'
import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import util from 'util'
import Counter from 'utils/counter'
import logger from 'utils/logger'
import colors from 'utils/colors'
import env from 'utils/env'

export type TRetryOption<T = any> = {
  name?: string
  ms?: number
  count?: boolean
  fallback?: T
  throwError?: boolean
  hideError?: boolean
  logError?: boolean
}

export function wait(milliseconds = 500, any: any = undefined) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(any)
    }, milliseconds)
  })
}

export async function waitUntil<T>(
  obj: T,
  predicate: _.ListIterateeCustom<T, boolean>,
  milliseconds = 500,
  any = undefined
): Promise<any> {
  if (_.every([obj], predicate)) {
    return any
  } else {
    await wait(milliseconds)
    return waitUntil(obj, predicate, milliseconds, any)
  }
}

export function formatDate(timestamp: number, pattern = 'MM/dd/yyyy HH:mm:ss') {
  const timeStr = `${timestamp}`
  const time = timeStr.length === 13 ? timestamp : timestamp * 1000

  const date = zonedTimeToUtc(new Date(time), env.timezone || 'Asia/Taipei')
  return format(date, pattern)
}

export function logObj(...obj: any) {
  const logs = _.compact([...obj])
  logs.forEach(el => {
    console.log(util.inspect(el, { showHidden: false, depth: null, colors: true }))
  })
}

export function print(title: string, ...rest: any) {
  const time = formatDate(Date.now())
  const logs = _.compact([...rest])

  console.group(`${title}, ${time}`)
  logs.forEach(el => console.log(el))
  console.groupEnd()
  console.log('\n')
}

export async function retryFn<T = any>(
  promise: Promise<T>,
  option?: TRetryOption<T>,
  retry = 2
): Promise<T | undefined> {
  const opt = option || {}
  const { name = 'fn', ms = 1000, fallback } = opt
  const { count, logError, throwError } = opt

  const counter = new Counter()

  try {
    const result = await promise

    if (count) {
      const info = `${colors.fg.green}name: ${name}, sec: ${counter.diffSec}${colors.reset}`
      print(`Successfully in ${info}`)
    }

    return result
  } catch (err: any) {
    await wait(ms)

    if (retry >= 0) {
      return retryFn(promise, option, retry - 1)
    }
    const info = `${colors.fg.red}name: ${name}, sec: ${counter.diffSec}${colors.reset}`
    err.stack = `${err.stack} \n    ${info}`

    if (logError) {
      logger.error(err)
    }
    if (throwError) {
      throw err
    }
    return fallback
  }
}

export function terminate(
  close: (err: unknown, promise: Promise<unknown>) => void,
  options = { coredump: false, timeout: 3000 }
) {
  // Exit function
  const exit = (code: number) => {
    options.coredump ? process.abort() : process.exit(code)
  }

  return (code: number, reason: any) => async (err: unknown, promise: Promise<unknown>) => {
    if (err && err instanceof Error) {
      // Log error information, use a proper logging library here :)
      logger.error(err)
    }
    if (promise) {
      logger.error(`promise: ${promise}`)
    }

    // Attempt a graceful shutdown
    await close(err, promise)

    setTimeout(() => {
      exit(code)
    }, options.timeout).unref()
  }
}

export function getObjInfo(obj: object, precision = 4) {
  let msg = ''
  _.forEach(obj, (v, key) => {
    const val = _.isNumber(v) ? _.round(v, precision) : _.toString(v)
    const txt = `${key}: ${val} \n`
    msg += txt
  })
  return msg
}

export function timeout(milliseconds?: number, error = new Error('timeout')) {
  const t = milliseconds || env.timeout * 1000
  return new Promise((res, rej) =>
    setTimeout(() => {
      // amend stack message
      error.stack = _.split(error.stack, /\r?\n|\r|\n/g)
        .filter(el => !el.includes('/helper.ts'))
        .join('\n')

      rej(error)
    }, t)
  )
}
