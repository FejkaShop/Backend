export class User {

    constructor(
        id: number,
        email: string,
        password: string,
        name: string | undefined,
        role: UserRole,
        createdAt: Date,
    ) {}

}

export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
}
