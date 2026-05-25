/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';

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
            transports: [new transports.Console()],
        });
    }

    log(message: string, ...args: any[]) {
        this.logger.info(`${message} | ${args.join(' | ')}`);
    }

    error(message: string, ...args: any[]) {
        this.logger.error(`${message} | ${args.join(' | ')}`);
    }

    warn(message: string, ...args: any[]) {
        this.logger.warn(`${message} | ${args.join(' | ')}`);
    }

    debug(message: string, ...args: any[]) {
        this.logger.debug(`${message} | ${args.join(' | ')}`);
    }

    verbose(message: string, ...args: any[]) {
        this.logger.verbose(`${message} | ${args.join(' | ')}`);
    }

    fatal(message: string, ...args: any[]) {
        this.logger.error(`[FATAL] ${message} | ${args.join(' | ')}`);
    }
}
