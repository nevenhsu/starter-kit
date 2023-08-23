const env = {
  nodeEnv: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  timezone: process.env.TIMEZONE,
  timeout: Number(process.env.TIMEOUT),
}

export default env
