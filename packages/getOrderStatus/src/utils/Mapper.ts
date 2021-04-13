import { DataMapper, GetOptions, PutOptions, QueryIterator, DeleteOptions, UpdateOptions, QueryOptions } from '@aws/dynamodb-data-mapper';
import { ZeroArgumentsConstructor } from '@aws/dynamodb-data-marshaller';
import { LoggerService } from './LoggerService';
export declare class MapperService {
    private mapper;
    private logger;
    constructor(mapper: DataMapper, logger: LoggerService);
    get<T>(getObject: T, options?: GetOptions): Promise<T>;
    save<T>(saveObject: T, options?: PutOptions): Promise<T>;
    batchSave<T>(saveObjects: T[]): Promise<void>;
    update<T>(updateObject: T, updateOptions?: UpdateOptions): Promise<T>;
    batchDelete<T>(deleteObjects: T[]): Promise<void>;
    delete<T>(deleteObject: T, deleteOptions?: DeleteOptions): Promise<T>;
    query<T>(queryObject: ZeroArgumentsConstructor<T>, keyCondition: any, options?: QueryOptions): Promise<QueryIterator<T>>;
    trueIfExists<T>(getObject: T, options?: GetOptions): Promise<boolean>;
}
