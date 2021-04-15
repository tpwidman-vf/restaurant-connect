import { injectable, inject } from "inversify";
import { DataMapper } from '@aws/dynamodb-data-mapper';

import { ConnectEvent } from '../types/connect/ConnectEvent';
import { Order } from '../models/OrdersTable';

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
            const params = event.Details.ContactData.CustomerEndpoint.Address;

            if(!params) {
                // no phone number error case
                console.log('no phone number to check for');
                throw new Error('getOrderStatus: No phone number In ContactData.CustomerEndpoint');
            }

            const orderModel: Order = {
                orderId: '0b6a4af2-e7b7-4f42-a67e-8dc3080d1b4d'//params
            };
            let order: Order;
            try {
                order = await this.mapper.get(orderModel);
            } catch (err) {
                if (err.name === 'ItemNotFoundException') {
                    this.logger.debug({ params },'getData: order id not found in database');
                    // return null;
                }
                throw err;
            }

            // const retrievedOrder:Order = await this.mapper.get('+14848681861');
            return order;
        } catch (error) {
            this.logger.error(
                { error },
                'Unhandled error trying to fetch order.'
            );
            throw error;
        }
    }
}