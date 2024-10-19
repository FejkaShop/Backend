export class Order {

    constructor(
        id: number,
        userId: number,
        totalAmount: number,
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date,
    ) {}

}

export enum OrderStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED',
}
