const AWS = require('aws-sdk');

async function processAudit(dynamoEvent) {
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
            auditEventTime: (new Date().getTime()),
            orderId: dynamoOrder.orderId.S,
            customerPhone: dynamoOrder.phoneNumber.S,
            customer: dynamoOrder.customer.S,
            pizzaSize: dynamoOrder.pizzaSize.S,
            pizzaType: dynamoOrder.pizzaType.S,
        };
        console.log(JSON.stringify(audit,4));
        // in the case of an order removal we would also like to log that removed order to S3 in case a customer calls about
        // later.  Or, maybe we want to do some analytics on the orders using Athena.  Or both.  The point here is to capture
        // these possible use cases, this is a demo after all. :)
        if (record.eventName === 'REMOVE') {
            await savedRemovedOrder(audit);
        }
    }
}

async function savedRemovedOrder(orderAudit) {
    const s3 = new AWS.S3();
    try {
      const params = {
        Bucket: process.env.S3_SAVE_BUCKET,
        Key: 'RemovedOrder'+orderAudit.orderId+'.json',
        Body: JSON.stringify(orderAudit),
        ContentType: 'application/json',
      };
      const s3putResult = await s3.putObject(params).promise();
      console.info('write to s3 completed');
      console.info(JSON.stringify(s3putResult));
    } catch (error) {
      console.error('Unable to save points aggregate JSON due to error ' + error);
      console.error(error);
    }     
}


module.exports = {
    processAudit: processAudit,
}