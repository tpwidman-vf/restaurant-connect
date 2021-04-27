import { DataMapper } from '@aws/dynamodb-data-mapper';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { LoggerService } from "../utils/LoggerService";
import { Order } from "../models/OrdersTable";
import { RequestBody } from "../types/ApiTypes";
export declare class OrderController {
    private mapper;
    private client;
    private logger;
    /**
     *
     * @param mapper
     * @param client
     * @param logger
     */
    constructor(mapper: DataMapper, client: DocumentClient, logger: LoggerService);
    /**
     *
     * @param phoneNumber
     * @returns
     */
    findOrders(phoneNumber: string, customer: string, orderStatus: string): Promise<import("aws-sdk/lib/request").PromiseResult<DocumentClient.ScanOutput, import("aws-sdk").AWSError>>;
    /**
     *
     * @param matchQueryParams
     * @returns
     */
    private queryOrdersTable;
    /**
     *
     * @param requestBody
     * @returns
     */
    create(requestBody: RequestBody): Promise<Order & RequestBody>;
    /**
     *
     * @param id
     * @returns
     */
    getById(id: string): Promise<Order & {
        orderId: string;
    }>;
    /**
     *
     * @param id
     * @param requestBody
     * @returns
     */
    updateById(id: string, requestBody: RequestBody): Promise<Order & RequestBody & {
        orderId: string;
    }>;
    /**
     *
     * @param id
     * @param requestBody
     * @returns
     */
    deleteById(id: string): Promise<(Order & {
        orderId: string;
    }) | undefined>;
}
