import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Users } from "./Users";

export enum FriendsStatus {
    PENDING = "p",
    APPROVED = "a",
    REJECTED = "r",
    BLOCKED = "b"
}

@Entity()
export class UsersFriends {

    @PrimaryGeneratedColumn("increment", { type: "int", unsigned: true })
        id: number;

    @Column("varchar", { name: " user_id" })
        userId: Users;

    @Column("varchar", { name: "friend_user_id" })
        friendUserId: Users;

    @Column({
        type: "enum",
        enum: FriendsStatus,
        default: FriendsStatus.PENDING
    })
        status: FriendsStatus;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
        requested: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: true })
        updated: string;

}
