import _ from 'lodash'
import { terminate } from 'utils/helper'
import env from 'utils/env'

exec()

function exec() {
  console.log(`${env.nodeEnv}: hello world!`)
}

const exitHandler = terminate(async (error, promise) => {
  errorHandler(error, promise)
})

process.on('uncaughtException', exitHandler(1, 'Unexpected Error'))
process.on('unhandledRejection', exitHandler(1, 'Unexpected Rejection'))
process.on('SIGTERM', exitHandler(0, 'SIGTERM'))
process.on('SIGINT', exitHandler(0, 'SIGINT'))

function errorHandler(error: unknown, promise?: Promise<unknown>) {
  const msg = _.get(error, 'message', 'closed')
  const stack = _.split(_.get(error, 'stack'), /\r?\n|\r|\n/g).join('\n')
  console.error(error)
}
