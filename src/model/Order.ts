export type OrderCreateRequest = {
    userId: number;
    orderItems: OrderItem[];
};

export type OrderUpdateRequest = {
    orderItems?: OrderItem[];
};

export type OrderItem = {
    productId: number;
    quantity: number;
};

export type OrderPaymentRequest = {
    method: string;
    amount: number;
}
