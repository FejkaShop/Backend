export class Order {
    id: number;
    userId: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Order>) {
        Object.assign(this, data);
    }
}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
