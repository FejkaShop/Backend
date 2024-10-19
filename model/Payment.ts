export class Payment {
    id: number;
    orderId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Payment>) {
        Object.assign(this, data);
    }
}

export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}
