'use-strict';

const __path = require('path');
const winston = require('winston');

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.align(),
		logFormat
	),
	transports: [
		new winston.transports.File({
			filename: __path.join(process.cwd(), '/logs', '/hydrogen-error.log'),
			level: 'error',
		}),
		new winston.transports.File({
			filename: __path.join(process.cwd(), '/logs', '/hydrogen.log'),
			level: 'debug'
        }),
        new winston.transports.Console()
	],
});

module.exports = { logger };
