import 'reflect-metadata';
import { Container } from 'inversify';
import { dependencyMockContainer } from '../mocks/dependencyMockContainer';
import { OrderController } from '../../src/controllers/OrderController';
// import * as events from '../mocks/events';

const container: Container = new Container();
let orderController: OrderController;

process.env.TABLE_NAME = "Orders";
// This test requires use of localstack to be running
describe('Orders API Controller', () => {
  beforeAll(async () => {
    await container.loadAsync(dependencyMockContainer);
    orderController = container.get(OrderController);
  });
  it('Retrieves data from the orders table', async () => {
    // "+1234567890"
    // const result = await orderController.findOrders("+1234567890");
    // console.log(util.inspect(result, false, null, true));
    // console.log(util.inspect(result, false, null, true));
  });
});