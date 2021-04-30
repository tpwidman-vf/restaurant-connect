function processAudit(dynamoEvent) {
    for (const record of dynamoEvent.Records) {
        let dynamoOrder = {};
        // by using the event name, we can figure out which of the records to look at.
        // NewImage is the new record, and OldImage is the previous one.  The previous one is all
        // we get for deletes. and clearly we don't have a previous one for new. ;)  I'm picking
        // the order I want to log here.
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
        // in the case of an order removal we would also like to log that removed order to S3 in case a customer calls about
        // later.  The trigger can also be used for that
        
    }
}

module.exports = {
    processAudit: processAudit,
}