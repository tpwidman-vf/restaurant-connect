import { injectable, inject } from "inversify";
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { ConnectEvent } from '../types/connect/ConnectEvent';
import { Order } from '../models/OrdersTable';

import { LoggerService } from '../utils/LoggerService'

@injectable()
export class OrderController {
    constructor(
        @inject(DocumentClient) private docClient: DocumentClient,
        @inject(LoggerService) private logger: LoggerService
    ) {}
    async getOrderStatus(event: ConnectEvent): Promise<Order|null> {
        this.logger.info({ event }, "retrieving order from dynamo");
        try {
            const callerNumberParam = event.Details.ContactData.CustomerEndpoint.Address;

            if(!callerNumberParam) {
                // no phone number error case
                console.log('no phone number to check for');
                throw new Error('getOrderStatus: No phone number In ContactData.CustomerEndpoint');
            }

            // docClient = new DynamoDB.DocumentClient({ region: process.env.REGION || 'us-east-1' });

            const queryParams: DocumentClient.QueryInput = {
                TableName : "Orders",
                KeyConditionExpression: "phoneNumber = :v_phonenumber",
                IndexName: "PhoneNumber-Index",
                ExpressionAttributeValues: {
                    ":v_phonenumber": callerNumberParam
                },
                ScanIndexForward: false,
            };

            try {
                const queryResult: DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(queryParams).promise();
                console.log(queryResult);
                if(queryResult && queryResult.Count && queryResult.Count > 0 && queryResult.Items ) {
                    // get most recent order (ordered by updated time desc)
                    const mostRecentOrder = queryResult.Items[0];
                    return mostRecentOrder;
                } else {
                    // no existing orders found
                    return null;
                }

            } catch (err) {
                if (err.name === 'ItemNotFoundException') {
                    this.logger.debug({ callerNumberParam },'getOrderStatus: error reading from orders table');
                    return null;
                }
                throw err;
            }
        } catch (error) {
            this.logger.error(
                { error },
                'Unhandled error trying to fetch order.'
            );
            throw error;
        }
    }
}