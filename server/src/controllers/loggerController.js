const {winston, createLogger, transports, format} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.colorize(),
    format.simple()),
  transports: [ 
    new transports.File({
        filename: 'src/logs/info.log',
        level: 'info',
    }),
    new transports.File({
        filename: 'src/logs/error.log',
        level: 'info',
    })
    // new transports.Console({
    // format: format.combine(format.colorize(),
    // format.simple()),})
    ],
});

module.exports = logger;