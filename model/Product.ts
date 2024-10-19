export class Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Product>) {
        Object.assign(this, data);
    }
}
