function logAudit(yourEvent) {
    for (const record of event.Records) {
        let dynamoOrder = {};
        switch (record.eventName) {
            case 'INSERT':
                dynamoOrder = record.dynamodb.NewImage;
            break;
            case 'REMOVE':
                dynamoOrder = record.dynamodb.OldImage;
            break;
            case 'MODIFY':
                dynamoOrder = record.dynamodb.NewImage;
            break;
        }
        let audit = {
            auditEventId: record.eventID,
            auditEvent: record.eventName,
            createdAt: record.dynamodb.ApproximateCreationDateTime,
            auditEventTime: (new Date().getTime()),
            orderId: dynamoOrder.orderId.S,
            customerPhone: dynamoOrder.phoneNumber.S,
        };
        console.log(JSON.stringify(audit,4));
    }
}

module.exports = {
    logAudit,
}