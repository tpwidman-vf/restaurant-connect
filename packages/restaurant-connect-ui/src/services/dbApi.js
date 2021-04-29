import axios from 'axios';

const client = axios.create({
    // baseURL: 'http://localhost:8080/api/v1/'
    baseURL: 'https://2m4ncx4jdf.execute-api.us-east-1.amazonaws.com/prod/'
})
async function addRow(body){
    const response = await client.post(`/orders`, body);
    return response;
}
async function getRows() {
    const items = await client.get('/orders');
    return items.data.Items.map(item => {
        item.id = item.orderId
        return item;
    })
}
async function updateRow(body){
    const {
        id, 
        createdAt,
        updatedAt,
        ...rest
    } = body;
    const response = await client.put(`/orders/${id}`, rest);
    return response;
}
async function removeRow(id){
    const response = await client.delete(`/orders/${id}`);
    return response;
}
export {
    getRows,
    updateRow,
    removeRow,
    addRow
}