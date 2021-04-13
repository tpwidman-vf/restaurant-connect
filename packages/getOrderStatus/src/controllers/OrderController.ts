import { injectable, inject } from "inversify";
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { ConnectEvent } from '../types/connect/ConnectEvent';
import { Order } from '../models/OrdersTable';
import { OrderResult } from '../types/OrderResult';

import { LoggerService } from '../utils/LoggerService'

@injectable()
export class OrderController {
    constructor(
        @inject(DataMapper) private mapper: DataMapper,
        @inject(LoggerService) private logger: LoggerService
    ) {}
    async getOrderStatus(event: ConnectEvent): Promise<Order> {
        this.logger.info({ event }, "retrieving order from dynamo");
        try {
            const params = event.Details.Parameters;

            const retrievedOrder:Order = await this.mapper.get('134');
            return retrievedOrder;
        } catch (error) {
            this.logger.error(
                { error },
                'Unhandled error trying to save API batch call.'
            );
            throw error;
        }
    }
}