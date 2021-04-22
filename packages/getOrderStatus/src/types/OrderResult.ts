export interface OrderResult {
    orderId: string,
    orderStatus: string,
    createdAt: string,
    phoneNumber?: string,
    pizzaSize?: string,
    pizzaType?: string,
    customer?: string,
    updatedAt?: string
}