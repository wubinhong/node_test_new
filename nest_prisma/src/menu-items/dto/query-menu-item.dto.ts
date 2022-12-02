export class QueryMenuItemDto {
    constructor(public id: number, public name: string, public url: string, public parentId?: number, public children?: QueryMenuItemDto[]) {
        this.children = [];
    }
}