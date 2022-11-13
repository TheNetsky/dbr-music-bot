import http from 'http'
import { logger } from 'utils/Logger'
import 'dotenv/config'

const Replit = (process.env.REPLIT_DB_URL !== undefined)

function initialize(replit = false) {
  if (replit) {
    logger.info('[REPLIT ENVIRONMENT DETECTED] [STARTING WEBSERVER]')

    http.createServer((req, res) => {
      const now = new Date().toLocaleString('en-US')
      res.end(`OK (200) - ${now}`)
    }).listen(3000)

    return require('./index')
  }

  return require('./index')
}

initialize(Replit)