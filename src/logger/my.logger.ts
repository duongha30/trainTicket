/* eslint-disable */
// @ts-nocheck
import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import chalk from 'chalk';
import dayjs from 'dayjs';

export class MyLogger implements LoggerService {
    private logger: Logger;
    constructor() {
        this.logger = createLogger({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.simple(),
            ),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.printf((info) => {
                            const strApp = chalk.green('[Nest]');
                            const strContext = chalk.yellow(`[${String(info['context'] ?? '')}]`);
                            return `${strApp} - ${String(info['time'])} - ${info.level} ${strContext}: ${String(info.message)}`;
                        }),
                    ),
                }),
            ],
        });
    }

    log(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.info(message, { context, time });
    }

    error(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.error(message, { context, time });
    }

    warn(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.warn(message, { context, time });
    }

    debug(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.debug(message, { context, time });
    }

    verbose(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.verbose(message, { context, time });
    }

    fatal(message: string, context: string) {
        const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        this.logger.error(`[FATAL] ${message}`, { context, time });
    }
}
