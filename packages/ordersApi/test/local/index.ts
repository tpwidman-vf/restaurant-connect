import * as path from "path"

import { AppConfig } from "ts-lambda-api"
import { ApiConsoleApp } from "ts-lambda-api-local"
import { dependencyMockContainer } from '../mocks/dependencyMockContainer';
import { Container } from "inversify";

let appConfig = new AppConfig()

appConfig.base = "/api/v1";
appConfig.version = "v1";
appConfig.openApi!.enabled = true;


let cachedContainer: Container;
/**
 * @description Return the cached container if it's cached, if not
 *
 * @param cached
 * @returns {Container}
 */
 const loadContainer = async () => {
    if(cachedContainer) return cachedContainer;
    cachedContainer = new Container({ autoBindInjectable: false });
    await cachedContainer.loadAsync(dependencyMockContainer);
    return cachedContainer;
};

loadContainer().then((appContainer) => {
    let app = new ApiConsoleApp([path.join(__dirname, "controllers")], appConfig, appContainer)
    app.configureApi((middleware: any) => {
        middleware.use((req: any, res: any, next: any) => {
            console.log(req.method, "method");
            res.header("Access-Control-Allow-Origin", "*");
            next()
        });
    })
    app.runServer(process.argv)
})