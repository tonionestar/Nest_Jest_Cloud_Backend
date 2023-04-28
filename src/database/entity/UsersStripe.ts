import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { Users } from "./Users";

@Entity()
export class UsersStripe {

    @PrimaryColumn("varbinary", { name: " user_id", length: 40 })
    @OneToOne(() => Users)
        userId: string;

    @Column("varchar", { name: "stripe_id", length: 50, nullable: true })
        stripeId: string;

}
