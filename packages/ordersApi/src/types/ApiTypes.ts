export interface RequestBody {
    orderId?: string;
    orderStatus?: string;
    phoneNumber?: string;
    pizzaSize?: string;
    pizzaType?: string;
    customer?: string;
    createdAt?: string|Date;
    updatedAt?: string|Date;
}
export interface ResponseBody {
    data: string[]
}
export interface QueryStringParams {
    orderStatus?: string;
    phoneNumber?: string;
    customer?: string;
}