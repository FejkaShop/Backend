export class Pagination<T> {
    constructor(limit: number, offset: number, totalEntries: number, hasMoreEntries: boolean, entries: T[]) {}
}
