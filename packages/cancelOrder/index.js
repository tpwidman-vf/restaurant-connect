const axios = require('axios');

exports.handler = async function(event) {    
    const apiEndpoint = process.env.API_ENDPOINT;
    const orderId = event.PrevOrderId;
    let orderUrl = apiEndpoint + 'orders/' + orderId;
    try {
        let orderRequest = await axios.get(orderUrl);
        let currentOrder = orderRequest.data;
        currentOrder.orderStatus = 'CANCELLED';
        // remove the updated field, we dont' need it since the update will do it for us.
        delete currentOrder.updatedAt;
        let orderUpdateResponse = await axios.put(orderUrl, currentOrder);
        return orderUpdateResponse.data;
    } catch (error) {
        console.error('Failed while trying to update order id ' + orderId);
        console.error(error);
        throw error;
    }
    
}