import 'reflect-metadata';
export declare class LoggerService {
    private LOG_LEVEL;
    private SERVICE_NAME;
    constructor(LOG_LEVEL: string, SERVICE_NAME: string);
    private logger;
    fatal(obj: object, msg?: string, ...args: any[]): void;
    error(obj: object, msg?: string, ...args: any[]): void;
    warn(obj: object, msg?: string, ...args: any[]): void;
    info(obj: object, msg?: string, ...args: any[]): void;
    debug(obj: object, msg?: string, ...args: any[]): void;
    trace(obj: object, msg?: string, ...args: any[]): void;
    silent(obj: object, msg?: string, ...args: any[]): void;
}
