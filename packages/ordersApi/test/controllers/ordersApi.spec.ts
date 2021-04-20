import 'reflect-metadata';
import { Container } from 'inversify';
import { Order } from '../../src/models/OrdersTable';
import { dependencyMockContainer } from '../mocks/dependencyMockContainer';
import { OrderController } from '../../src/controllers/OrderController';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
// import * as events from '../mocks/events';

const container: Container = new Container();
let orderController: OrderController;

process.env.TABLE_NAME = "Orders";
async function clearTable(docClient: DocumentClient, tableName: string){
  let params = {
    TableName: tableName,
  };
  let data = await docClient.scan(params).promise();
  if(data.Items && data.Items.length > 0){
    const group = data.Items.map(item => {
      return {
          DeleteRequest: {
            Key: {
              orderId: item.orderId,
          },
        },
      };
    })
    const input = {
      RequestItems: {
        Orders: group,
      },
    }
    await docClient.batchWrite(input).promise();
  }
}

// This test requires use of localstack to be running
describe('Orders API Controller', () => {
  let sharedContext: any = {};
  beforeAll(async () => {
    await container.loadAsync(dependencyMockContainer);
    orderController = container.get(OrderController);
    const client = container.get(DocumentClient);
    sharedContext.client = client;
    await clearTable(client, 'Orders');
    const sharedRecord = await orderController.create({
      "customer": "Taylor Widman",
      "phoneNumber": "+1234567890",
      "pizzaSize": "Small",
      "pizzaType": "Pepperoni"
    });
    sharedContext.record = sharedRecord;
  });
  it('Retrieves data from the orders table', async () => {
    const result = await orderController.findOrders(
      "1234567890",
      "Taylor Widman",
      "IN_PROGRESS"
    );
    expect(result.Items?.length).toBe(1);
  });
  it('Creates a new record in the orders table', async () => {
    await orderController.create({
      "customer": "Marissa McDowell",
      "phoneNumber": "+1234567890",
      "pizzaSize": "Small",
      "pizzaType": "Pepperoni"
    });
    let params = {
      TableName: process.env.TABLE_NAME,
    };
    let result = await sharedContext.client.scan(params).promise();
    expect(result.Items?.length).toBe(2);
  });
  it('Updates an existing record in the orders table, retrieve record by id', async () => {
    const orderId = sharedContext.record?.orderId;
    const updateRequestBody = {
      pizzaType: "Mushroom"
    }
    await orderController.updateById(orderId, Object.assign(new Order(), updateRequestBody));
    const record = await orderController.getById(orderId);
    expect(record?.pizzaType).toBe(updateRequestBody.pizzaType);
  })
  it('Deletes the created record', async () => {
    const orderId = sharedContext.record?.orderId;
    const result = await orderController.deleteById(orderId);
    expect(result?.orderId).toBe(orderId);
  });
});