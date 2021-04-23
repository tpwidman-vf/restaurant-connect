import { default as axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { default as laconia } from '@laconia/core';
import { logger } from './util/logger';
import { ConnectEvent } from './types/connect/ConnectEvent'
import { CheckOrderResponse } from './types/response';

const instances = () => {
    const client = axios.create({
        baseURL: process.env.BASE_URL
    });
    /*
    client.interceptors.request.use(function (config) {
        logger.debug({ config }, "http client request");
        return config;
    });

    client.interceptors.response.use(function (response) {
        logger.info({ response }, "http client response");
        return response;
    });
    */
    return {
        httpClient: client
    }
};
/**
 * 
 * @param arr 
 * @returns string concattenated using english grammer
 */
const makeString = (arr: string[]): string => {
    if (arr.length === 1) return arr[0];
    const firsts = arr.slice(0, arr.length - 1);
    const last = arr[arr.length - 1];
    return firsts.join(', ') + ' and ' + last;
}
/**
 * 
 * @param orders 
 * @returns generates text string summary of all orders
 */
const orderSummary = (orders: any[]): string => {
    const statusMap = new Map([
        ["IN_PROGRESS", "is in progress"], 
        ["DELIVERED", "has been delivered"], 
        ["CANCELLED", "has been cancelled"], 
    ]);
    const numOrders = orders.length;
    let textString = `Your phone number has ${numOrders} order${numOrders > 1 ? "s" : ""} registered. `;
    if(orders.length === 1){
        let order = orders[0];
        textString += `It is a ${order.pizzaType.toLowerCase()} pizza and it ${statusMap.get(order.orderStatus)}`;
    } else {
        textString += `There is ${makeString(orders.map(order => `a ${order.pizzaType.toLowerCase()} pizza which ${statusMap.get(order.orderStatus)}`))}.`;
    }
    return textString ;
}
/**
 * 
 * @param event ConnectEvent
 * @param instances.httpClient - axios client
 * @returns 
 */
export const app = async (event: ConnectEvent, { httpClient }: { httpClient: AxiosInstance }): Promise<CheckOrderResponse> => {
    const phoneNumber: string = event.Details.ContactData.CustomerEndpoint.Address.replace('+', '');
    try{
        const axiosParams: AxiosRequestConfig = {
            params: {
                phoneNumber: phoneNumber
            }
        }
        const response: AxiosResponse = await httpClient.get('/orders', axiosParams);
        const items: any[] = response.data.Items;
        return {
            textString: items.length > 0 ? orderSummary(items) : `There are no orders associated with the phone number used to place the call`,
            numberOfOrders: items.length,
            hasOrders: items.length > 0
        }
    } catch (error) {
        logger.error({ error });
        return {
            textString: 'There was a problem retrieving orders with the phoneNumber',
            numberOfOrders: 0,
            hasOrders: false
        }
    }
};
export const handler = laconia(app).register(instances);