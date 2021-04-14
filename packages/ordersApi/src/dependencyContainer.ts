import { AsyncContainerModule } from 'inversify';
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { OrderController } from './controllers/OrderController';
import { LoggerService } from './utils/LoggerService';

const container: AsyncContainerModule = new AsyncContainerModule(
  async (bind) => {
    /**
     * Constants
     */
    bind('AWS_REGION').toConstantValue(process.env.AWS_REGION);
    bind('SERVICE_NAME').toConstantValue(process.env.SERVICE_NAME);
    bind('LOG_LEVEL').toConstantValue(process.env.LOG_LEVEL);
    bind('TABLE').toConstantValue(process.env.TABLE_NAME);

    /**
     * Dynamo
     */
    bind<DataMapper>(DataMapper).toDynamicValue(() => {
      return new DataMapper({
        client: new DynamoDB(),
      });
    });
    bind<DocumentClient>(DocumentClient).toDynamicValue(() => {
      return new DynamoDB.DocumentClient();
    });
    /**
     * Controllers
     */
    bind<OrderController>(OrderController).toSelf();

    /**
     * Processors

    /**
     * Services
     */
    bind<LoggerService>(LoggerService).toSelf();
  }
);

export default container;
