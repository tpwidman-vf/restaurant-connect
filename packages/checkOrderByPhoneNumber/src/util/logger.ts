import * as pino from 'pino';
export const logger: pino.Logger = pino.default({
    level: process.env.LOG_LEVEL || 'info'
})