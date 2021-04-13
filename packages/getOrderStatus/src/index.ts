import 'reflect-metadata';
import { Container } from 'inversify';
import { ConnectEvent } from './types/connect/ConnectEvent';
import container from './dependencyContainer';
import { OrderController } from './controllers/OrderController';
import { OrderResult } from './types/OrderResult';

let cachedController: OrderController;

/**
 * @description Return the cached controller if it's cached, if not
 *
 * @param cached
 * @returns {OrderController}
 */
const loadController = async (
  cached: OrderController
): Promise<OrderController> => {
  if (cached) return cached;

  const dependencies = new Container();
  await dependencies.loadAsync(container);
  cachedController = dependencies.resolve(OrderController);
  return cachedController;
};

/**
 * @param event
 * @returns
 */
export const handler = async (
  event: ConnectEvent
): Promise<OrderResult> => {
  // ProcessRoutes
  /**
   * Fetch controller
   */
  const controller = await loadController(cachedController);

  /**
   * Start the execution
   */

  return controller.create(event);
};
