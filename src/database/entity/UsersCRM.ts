import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class UsersCRM {

    @PrimaryColumn("varbinary", { length: 40 })
        id: string;

    @Column("varchar", { name: "customer_id", length: 50, nullable: true })
        customerId: string;


}
