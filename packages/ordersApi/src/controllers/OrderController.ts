import { injectable, inject } from "inversify"
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuid } from 'uuid';

import { 
    apiController,
    GET, 
    POST,
    PUT,
    DELETE,
    pathParam, 
    queryParam, 
    body,
 } from "ts-lambda-api";

import { LoggerService } from "../utils/LoggerService";
import { Order } from "../models/OrdersTable";
import { RequestBody, QueryStringParams } from "../types/ApiTypes";
import { isNil } from "lodash";

@apiController("/orders")
@injectable()
export class OrderController {
    /**
     * 
     * @param mapper 
     * @param client 
     * @param logger 
     */
    constructor(
        @inject(DataMapper) private mapper: DataMapper,
        @inject(DocumentClient) private client: DocumentClient,
        @inject(LoggerService) private logger: LoggerService,
    ) {}

    /**
     * 
     * @param phoneNumber 
     * @returns 
     */
    @GET("/")
    public async findOrders(
        @queryParam("phoneNumber") phoneNumber: string,
        @queryParam("customer") customer: string,
        @queryParam("orderStatus") orderStatus: string,
    ){
        const matchQueryParams = {
            phoneNumber: (phoneNumber) ? `+${phoneNumber}` : undefined,
            customer,
            orderStatus
        }
        this.logger.info(matchQueryParams);
        return await this.queryOrdersTable(matchQueryParams);
    }
    /**
     * 
     * @param matchQueryParams 
     * @returns 
     */
     private async queryOrdersTable(matchQueryParams: QueryStringParams) {
        let baseQueryObject: DocumentClient.ScanInput = {
            TableName: process.env.TABLE_NAME || "Orders"
        };
        if(Object.values(matchQueryParams).some(value => !isNil(value))){
            baseQueryObject.ExpressionAttributeNames = {};
            baseQueryObject.ExpressionAttributeValues = {};
            baseQueryObject.FilterExpression = "";
            Object.keys(matchQueryParams)
                .filter((key) => !isNil(matchQueryParams[key as keyof QueryStringParams]))
                .reduce((prev: any, current): any => {
                    const value = matchQueryParams[current as keyof QueryStringParams];
                    prev.ExpressionAttributeNames[`#${current}`] = current;
                    prev.ExpressionAttributeValues[`:${current}Value`] = value;
                    prev.FilterExpression += (prev.FilterExpression === "") ? `#${current} = :${current}Value` : ` AND #${current} = :${current}Value`
                    return prev;
                }, baseQueryObject);
        }
        const result = await this.client.scan(baseQueryObject).promise();
        return result;
    }
    /**
     * 
     * @param requestBody 
     */
    createOrderFromRequestBody(requestBody: any){
        const defaults = {
            orderStatus: "IN_PROGRESS",
            orderId: uuid(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const order = new Order(Object.assign({}, defaults, requestBody));
        return order
    }
    /**
     * 
     * @param requestBody 
     * @returns 
     */
    @POST("/")
    public async create(@body requestBody: RequestBody) {
        if(Array.isArray(requestBody)){
            const input = requestBody.map(this.createOrderFromRequestBody);
            this.mapper.batchPut(input);
            return input;
        }
        return this.mapper.put(this.createOrderFromRequestBody(requestBody));
    }

    /**
     * 
     * @param id 
     * @returns 
     */
    @GET("/:id")
    public async getById(@pathParam("id") id: string) {
        this.logger.info({ id }, "id");
        return await this.mapper.get(Object.assign(new Order(), { orderId: id }));
    }

    /**
     * 
     * @param id 
     * @param requestBody 
     * @returns 
     */
    @PUT("/:id")
    public async updateById(
        @pathParam("id") id: string,
        @body requestBody: RequestBody
        ) {
        const existingRecord = await this.mapper.get(Object.assign(new Order(), { orderId: id }));
        if(!requestBody.updatedAt){
            requestBody.updatedAt = new Date();
        }
        return this.mapper.put(Object.assign(new Order(), existingRecord, requestBody, { orderId: id }));
    }

    /**
     * 
     * @param id 
     * @param requestBody 
     * @returns 
     */
     @DELETE("/:id")
     public async deleteById(
         @pathParam("id") id: string,
         ) {   
        return this.mapper.delete(Object.assign(new Order(), { orderId: id }));
     }
}
