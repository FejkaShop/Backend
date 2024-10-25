export class Pagination<T> {
    constructor(
        public limit: number,
        public offset: number,
        public totalEntries: number,
        public hasMoreEntries: boolean,
        public entries: T[]
    ) {}
}
