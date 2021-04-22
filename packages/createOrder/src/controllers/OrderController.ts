import { injectable, inject } from "inversify";
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { v4 as uuidv4 } from 'uuid';
import aws from 'aws-sdk';

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
    async create(event: ConnectEvent): Promise<OrderResult> {
        this.logger.info({ event }, "adding order to dynamo");
        try {
            const params = event.Details.Parameters;
            const id: string = uuidv4();
            const status: string = "IN_PROGRESS";
            const order = new Order();
            order.phoneNumber = event.Details.ContactData.CustomerEndpoint.Address;
            order.orderStatus = status;
            order.createdAt = new Date();
            order.updatedAt = new Date();
            order.pizzaSize = params.PizzaSize;
            order.pizzaType = params.PizzaType;
            order.customer = params.Customer;
            order.orderId = id;
            await this.mapper.put(order);
            this.sendOrderEmail(order);
            this.sendOrderSqsMessage(order);
            return {
                orderId: id,
                orderStatus: status,
                createdAt: new Date().toISOString()
            }
        } catch (error) {
            this.logger.error(
                { error },
                'Unhandled error trying to save API batch call.'
              );
              throw error;
        }
    }

    async sendOrderEmail(order: Order) {
        const ses = new aws.SES({ region: "us-east-1"});
        const params = {
            Destination: {
                ToAddresses: [process.env.ORDERS_EMAIL || 'orders@vf-team8.com'],
            }, 
            Message: {
                Body: {
                   Text: { Data: JSON.stringify(order) }, 
                },
                Subject: { Data: "Order "+order.orderId + " has been submitted" },                
            },
            Source: 'PizzaOrdersTeam8@vf-team8.com',
        }
        try {
            this.logger.debug({}, 'Sending an order email for order ' + order.orderId);
            await ses.sendEmail(params).promise();
        } catch (error) {
            this.logger.error(
                { error }, 
                'Error trying to send SES notification email.'
            );
            throw error;
        }
    }

    async sendOrderSqsMessage(order: Order) {
        order === order;
    }
}