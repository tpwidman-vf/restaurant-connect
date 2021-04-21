import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ConnectEvent } from "../../src/types/connect/ConnectEvent";

export let testEventWithOrder: ConnectEvent = {
    Details: {
        ContactData: {
            Attributes: {},
            Channel: "VOICE",
            ContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            CustomerEndpoint: {
                Address: "+13333333333",
                Type: "TELEPHONE_NUMBER"
            },
            InitialContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            InitiationMethod: "INBOUND | OUTBOUND | TRANSFER | CALLBACK",
            InstanceARN: "arn:aws:connect:aws-region:1234567890:instance/c8c0e68d-2200-4265-82c0-XXXXXXXXXX",
            PreviousContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            Queue: {
                ARN: "arn:aws:connect:eu-west-2:111111111111:instance/cccccccc-bbbb-dddd-eeee-ffffffffffff/queue/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
                Name: "PasswordReset"
            },
            SystemEndpoint: {
                Address: "+1234567890",
                Type: "TELEPHONE_NUMBER"
            }
        },
        Parameters: {
        }
    },
    Name: "ConnectFlowEvent"
};

export let testEventWithNoOrder: ConnectEvent = {
    Details: {
        ContactData: {
            Attributes: {},
            Channel: "VOICE",
            ContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            CustomerEndpoint: {
                Address: "+1234567890",
                Type: "TELEPHONE_NUMBER"
            },
            InitialContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            InitiationMethod: "INBOUND | OUTBOUND | TRANSFER | CALLBACK",
            InstanceARN: "arn:aws:connect:aws-region:1234567890:instance/c8c0e68d-2200-4265-82c0-XXXXXXXXXX",
            PreviousContactId: "4a573372-1f28-4e26-b97b-XXXXXXXXXXX",
            Queue: {
                ARN: "arn:aws:connect:eu-west-2:111111111111:instance/cccccccc-bbbb-dddd-eeee-ffffffffffff/queue/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
                Name: "PasswordReset"
            },
            SystemEndpoint: {
                Address: "+5555555555",
                Type: "TELEPHONE_NUMBER"
            }
        },
        Parameters: {
        }
    },
    Name: "ConnectFlowEvent"
};

export const loadAllData = async (
        docClient: DocumentClient,
        tableName: string
    ): Promise<void> => {
    const batchWriteParams: DocumentClient.BatchWriteItemInput = {
        RequestItems: {
            [tableName]: [
                {
                    PutRequest: {
                        Item: {
                            "phoneNumber": "+11234567890",
                            "pizzaSize": "Large",
                            "orderStatus": "IN_PROGRESS",
                            "orderId": "11111111-dec6-40c1-9879-214ba359cff2",
                            "updatedAt": "2021-04-16T01:00:06.846Z",
                            "createdAt": "2021-04-16T01:00:06.846Z",
                            "pizzaType": "Cheese",
                            "customer": "Homer Simpson"
                        },
                    },
                },
                {
                    PutRequest: {
                        Item: {
                            "phoneNumber": "+13333333333",
                            "pizzaSize": "Medium",
                            "orderStatus": "IN_PROGRESS",
                            "orderId": "22222222-dec6-40c1-9879-214ba359cff2",
                            "updatedAt": "2021-04-16T01:00:06.846Z",
                            "createdAt": "2021-04-16T01:00:06.846Z",
                            "pizzaType": "Mushroom",
                            "customer": "Mickey Mouse"
                        },
                    },
                },
            ],
        },
    };
    await docClient.batchWrite(batchWriteParams).promise();
};