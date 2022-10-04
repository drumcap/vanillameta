import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {BaseEntity} from "../../common/entities/base.entity";
import {Widget} from "../../widget/entities/widget.entity";

@Entity()
export class WidgetView extends BaseEntity {
    @PrimaryGeneratedColumn({comment: '위젯 데이터셋 ID'})
    id: number

    @Column({comment: '데이터베이스 ID'})
    databaseId: number

    @Column({type: 'text', comment: '조회 sql'})
    query: string

    @OneToMany(
        (type) => Widget,
        (widget) => widget.datasetId
    )
    widgets!: Widget
}