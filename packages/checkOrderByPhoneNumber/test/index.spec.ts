import 'jest';
import { default as axios } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { app } from '../src/index';
import * as stubs from './stubs';
  
describe("Retrieves data from axios correctly", () => {
  const client = axios.create();
  const mock = new MockAdapter(client);
  afterEach(()=> {
    mock.reset();
  })
  it('should return the correct response for a single pizza', async() => {
    mock.onGet('/orders').reply(200, stubs.sampleGETResult);
    const response = await app(stubs.sampleConnectEvent, { httpClient: client });
    expect(response.numberOfOrders).toBe(1);
    expect(response.hasOrders).toBeTruthy();
    console.log(response);
  });
  it('should return the correct response for multiple orders', async() => {
    const items = [
      {
        "phoneNumber": "+11234567890",
        "createdAt": "2021-04-22T20:04:04.173Z",
        "orderStatus": "DELIVERED",
        "pizzaType": "Mushroom",
        "orderId": "57a3a61c-be09-476e-b388-c981afc8ee03",
        "updatedAt": "2021-04-22T20:04:04.173Z"
      },
      {
        "phoneNumber": "+11234567890",
        "createdAt": "2021-04-22T20:04:04.173Z",
        "orderStatus": "IN_PROGRESS",
        "pizzaType": "Pepperoni",
        "orderId": "57a3a61c-be09-476e-b388-c981afc8ee03",
        "updatedAt": "2021-04-22T20:04:04.173Z"
      },
      {
        "phoneNumber": "+11234567890",
        "createdAt": "2021-04-22T20:04:04.173Z",
        "orderStatus": "CANCELLED",
        "pizzaType": "Hawaiian",
        "orderId": "57a3a61c-be09-476e-b388-c981afc8ee03",
        "updatedAt": "2021-04-22T20:04:04.173Z"
      }
    ]
    mock.onGet('/orders').reply(200, Object.assign({}, stubs.sampleGETResult, { Items: items }));
    const response = await app(stubs.sampleConnectEvent, { httpClient: client });
    expect(response.numberOfOrders).toBe(3);
    expect(response.hasOrders).toBeTruthy();
    console.log(response);
  })
});