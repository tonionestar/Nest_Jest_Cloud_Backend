import {Column, Entity, OneToOne, PrimaryColumn} from "typeorm";
import {Users} from "../entity/Users";

@Entity()
export class UsersCRM {

    @PrimaryColumn("varbinary", { length: 40 })
    id: string;

    @Column("varchar", { length: 50, nullable: true })
    customer_id: string;

}
