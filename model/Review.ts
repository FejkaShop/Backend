export class Review {
    id: number;
    productId: number;
    userId: number;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Review>) {
        Object.assign(this, data);
    }
}
