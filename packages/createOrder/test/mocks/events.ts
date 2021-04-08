import { ConnectEvent } from "../../src/types/connect/ConnectEvent";

export let testEvent: ConnectEvent = {
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
                Address: "+1234567890",
                Type: "TELEPHONE_NUMBER"
            }
        },
        Parameters: {
            PizzaSize: "Large",
            PizzaType: "Cheese",
            Customer: "Taylor Widman"
        }
    },
    Name: "ConnectFlowEvent"
}