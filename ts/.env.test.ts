import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Variables overwriting/priority
// .env.test.local
// .env.production.local
// .env.development.local
// .env.local
// .env.test
// .env.production
// .env.development
// .env

config()

function config() {
  const envs = ['test', 'production', 'development']
  const cwd = process.cwd()
  const files = [
    ...envs.map(env => `.env.${env}.local`),
    '.env.local',
    ...envs.map(env => `.env.${env}`),
    '.env',
  ]

  return files
    .map(fileName => path.resolve(cwd, fileName))
    .filter(filePath => fs.existsSync(filePath))
    .reduce((settings, path) => {
      const foundSettings = dotenv.config({ path })
      if (foundSettings.error) throw foundSettings.error
      return { ...foundSettings.parsed, ...settings }
    }, {})
}
