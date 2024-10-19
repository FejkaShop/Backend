export class User {
    id: number;
    email: string;
    password: string;
    name?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}
