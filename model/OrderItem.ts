export class OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;

    constructor(data: Partial<OrderItem>) {
        Object.assign(this, data);
    }
}
