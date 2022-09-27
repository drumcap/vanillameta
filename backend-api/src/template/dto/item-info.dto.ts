import {TemplateItem} from "../entities/template-item.entity";

export class ItemInfoDto {
    x: number;
    y: number;
    w: number;
    h: number;
    category: string;
    type: string;

    constructor(templateItem:TemplateItem) {
        this.x = templateItem.x;
        this.y = templateItem.y;
        this.w = templateItem.width;
        this.h = templateItem.height;
        this.category = templateItem.recommendCategory;
        this.type = templateItem.recommendType;
    };
}
