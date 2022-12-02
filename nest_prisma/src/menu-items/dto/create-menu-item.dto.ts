export class CreateMenuItemDto {
    constructor(public name: string, public url: string, public parentId?: number) { }
}
