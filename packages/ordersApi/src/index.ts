import { AppConfig, ApiLambdaApp, ApiRequest, } from "ts-lambda-api";
import { Container } from 'inversify';
import container from './dependencyContainer';

const appConfig = new AppConfig();
appConfig.version = "v1";

let cachedContainer: Container;

/**
 * @description Return the cached container if it's cached, if not
 *
 * @param cached
 * @returns {OrderController}
 */
 const loadContainer = async () => {
    if(cachedContainer) return cachedContainer;
    cachedContainer = new Container({ autoBindInjectable: false });
    await cachedContainer.loadAsync(container);
    return cachedContainer;
};

// const appController = new AppController();

// // Pass the customer container into the app - controllersPath is ignored

export async function handler(event: ApiRequest, context: any) {
    const appContainer = await loadContainer();
    const app = new ApiLambdaApp(undefined, appConfig, appContainer);
    return await app.run(event, context);
}