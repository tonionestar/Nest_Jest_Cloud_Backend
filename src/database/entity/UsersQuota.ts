import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { Users } from "./Users";

@Entity()
export class UsersQuota {

    @PrimaryColumn("uuid", { name: "user_id" })
        userId: string;

    @Column("bigint", { name: "used_space", unsigned: true, nullable: false, default: 0 })
        usedSpace: number;

    @Column("bigint", { name: "total_space", unsigned: true, nullable: false, default: 5242880 })
        totalSpace: number;

    @OneToOne(() => Users, user => user.quota, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
        user: Users;
}
