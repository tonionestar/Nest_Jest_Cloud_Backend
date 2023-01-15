import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { Users } from "./Users";

@Entity()
export class UsersQuota {

    @PrimaryColumn("uuid")
    @OneToOne(() => Users)
    user_id: string;

    @Column("bigint", { unsigned: true, nullable: false })
    used_space: number;

    @Column("bigint", { unsigned: true, nullable: false })
    total_space: number;

}
