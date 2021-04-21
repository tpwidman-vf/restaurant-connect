import 'reflect-metadata';
import { Container } from 'inversify';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dependencyMockContainer } from '../mocks/dependencyMockContainer';
import { OrderController } from '../../src/controllers/OrderController';
import { testEventWithNoOrder, testEventWithOrder, loadAllData } from '../mocks/events';

const container: Container = new Container();
let orderController: OrderController;
let docClient: DocumentClient;
let tableName: string;
// This test requires use of localstack to be running
describe('Check Order Controller', () => {
  beforeAll(async () => {
    await container.loadAsync(dependencyMockContainer);
    orderController = container.get(OrderController);

    docClient = container.get(DocumentClient);
    tableName = "Orders"; //container.get('TABLE');
    await loadAllData(
      docClient,
      tableName
    );
  });

  it('Successfully returns most recent existing order that is a phone number match from Orders table with connect event', async () => {
    const result = await orderController.getOrderStatus(testEventWithOrder);
    expect(result).toEqual({
      "phoneNumber": "+13333333333",
      "pizzaSize": "Medium",
      "orderStatus": "IN_PROGRESS",
      "orderId": "22222222-dec6-40c1-9879-214ba359cff2",
      "updatedAt": "2021-04-16T01:00:06.846Z",
      "createdAt": "2021-04-16T01:00:06.846Z",
      "pizzaType": "Mushroom",
      "customer": "Mickey Mouse"
    });
  });

  it('returns null when there is no phone number match from Orders table with connect event', async () => {
    const result = await orderController.getOrderStatus(testEventWithNoOrder);
    expect(result).toBe(null);
  });
});