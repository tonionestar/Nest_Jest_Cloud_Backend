import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { Users } from "./Users";

@Entity()
export class UsersStripe {

    @PrimaryColumn("varbinary", { length: 40 })
    @OneToOne(() => Users)
    user_id: string;

    @Column("varchar", { length: 50, nullable: true })
    stripe_id: string;

}
