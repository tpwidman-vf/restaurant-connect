enum orderStatus {
    IN_PROGRESS = "IN_PROGRESS",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export interface Order {
    phoneNumber: string,
    createdAt: string,
    pizzaType: string,
    orderStatus: orderStatus,
    orderId: string,
    updatedAt: string
}