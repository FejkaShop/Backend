export class Address {
    id: number;
    userId: number;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Address>) {
        Object.assign(this, data);
    }
}
