import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UsersCRM {

    @PrimaryColumn("varbinary", { length: 40 })
    id: string;

    @Column("varchar", { length: 50, nullable: true })
    customer_id: string;

}
