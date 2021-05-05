const axios = require('axios');

exports.handler = async function(event) {    
    const apiEndpoint = process.env.API_ENDPOINT;
    const orderId = event.Details.Parameters.PrevOrderId;
    let orderUrl = apiEndpoint + 'orders/' + orderId;
    try {
        let orderRequest = await axios.get(orderUrl);
        let currentOrder = orderRequest.data;
        currentOrder.orderStatus = 'CANCELLED';
        // remove the fields we don't want to update because they shouldn't
        // be touched here.
        delete currentOrder.createdAt;
        delete currentOrder.updatedAt;                
        let orderUpdateResponse = await axios.put(orderUrl, currentOrder);
        return orderUpdateResponse.data;
    } catch (error) {
        console.error('Failed while trying to update order id ' + orderId);
        console.error(error);
        throw error;
    }
    
}