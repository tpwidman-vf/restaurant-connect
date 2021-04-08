import 'reflect-metadata';
import { Container } from 'inversify';
import { dependencyMockContainer } from '../mocks/dependencyMockContainer';
import { OrderController } from '../../src/controllers/OrderController';
import * as events from '../mocks/events';

const container: Container = new Container();
let orderController: OrderController;
// This test requires use of localstack to be running
describe('Check Order Controller', () => {
  beforeAll(async () => {
    await container.loadAsync(dependencyMockContainer);
    orderController = container.get(OrderController);
  });
  it('Successfully adds data Orders table', async () => {
    const result = await orderController.create(events.testEvent);
    expect(result.orderStatus).toBe("IN_PROGRESS");
  });
});