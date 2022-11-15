import log4js from 'log4js'


log4js.configure(
  {
    appenders: {
      file: {
        type: 'file',
        filename: 'logs/logs.log',
        maxLogSize: 10 * 1024 * 1024, // = 10Mb
        backups: 5, // Keep five backup files
        compress: true, // Compress the backups
        encoding: 'utf-8',
        mode: 0o0640,
        flags: 'w+'
      },
      dateFile: {
        type: 'dateFile',
        filename: 'logs/dbr.log',
        pattern: 'yyyy-MM-dd-hh',
        compress: true
      },
      out: {
        type: 'stdout'
      },
    },
    categories: {
      default: { appenders: ['file', 'dateFile', 'out'], level: 'info' }
    }
  }
)
export const logger = log4js.getLogger('DBR-MUSIC')

