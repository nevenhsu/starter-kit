declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV
      NODE_ENV: 'production' | 'development' | 'test'
      TIMEZONE: string
      TIMEOUT: string
    }
  }
}

export {}
