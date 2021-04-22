/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import pino from 'pino';
import 'reflect-metadata';
import { injectable, inject } from 'inversify';

@injectable()
export class LoggerService {
  constructor(
    @inject('LOG_LEVEL')
    private LOG_LEVEL: string,
    @inject('SERVICE_NAME')
    private SERVICE_NAME: string
  ) {}

  private logger: pino.Logger = pino({
    level: this.LOG_LEVEL || 'info',
    formatters: {
      level: (label: string) => {
        return { level: label };
      },
    },
    // useLevelLabels: true,
    messageKey: 'message',
    base: {
      serviceName: this.SERVICE_NAME || 'undefined-service-name',
    },
    timestamp: true,
  });

  public fatal(obj: object, msg?: string, ...args: any[]): void {
    this.logger.fatal(obj, msg, ...args);
  }

  public error(obj: object, msg?: string, ...args: any[]): void {
    this.logger.error(obj, msg, ...args);
  }

  public warn(obj: object, msg?: string, ...args: any[]): void {
    this.logger.warn(obj, msg, ...args);
  }

  public info(obj: object, msg?: string, ...args: any[]): void {
    this.logger.info(obj, msg, ...args);
  }

  public debug(obj: object, msg?: string, ...args: any[]): void {
    this.logger.debug(obj, msg, ...args);
  }

  public trace(obj: object, msg?: string, ...args: any[]): void {
    this.logger.trace(obj, msg, ...args);
  }

  public silent(obj: object, msg?: string, ...args: any[]): void {
    this.logger.silent(obj, msg, ...args);
  }
}