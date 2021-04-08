import { AsyncContainerModule } from 'inversify';
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { OrderController } from '../../src/controllers/OrderController';
import { LoggerService } from "../../src/utils/LoggerService";

const constants = {
  AWS_REGION: 'AWS_REGION',
  SERVICE_NAME: 'SERVICE_NAME',
  LOG_LEVEL: 'LOG_LEVEL',
  TABLE: 'TABLE_NAME',
};

const baseConfig = { region: 'us-east-1', endpoint: 'http://localhost:4566' };

export const dependencyMockContainer: AsyncContainerModule = new AsyncContainerModule(
  async (bind) => {
    /**
     * Constants
     */
    bind(constants.AWS_REGION).toConstantValue('us-east-1');
    bind(constants.LOG_LEVEL).toConstantValue('silent');
    bind(constants.SERVICE_NAME).toConstantValue('createOrder');
    bind(constants.TABLE).toConstantValue('Orders');

    /**
     * Dynamo
     */
    bind<DataMapper>(DataMapper).toDynamicValue(() => {
      return new DataMapper({
        client: new DynamoDB({ ...baseConfig }),
      });
    });
    bind<DocumentClient>(DocumentClient).toDynamicValue(() => {
      return new DynamoDB.DocumentClient({ ...baseConfig });
    });

    /**
     * Models
     */

    /**
     * Controllers
     */
    bind<OrderController>(OrderController).toSelf();

    /**
     * Services
     */
    bind<LoggerService>(LoggerService).toSelf();
    /**
     * Processors
     */
  }
);
