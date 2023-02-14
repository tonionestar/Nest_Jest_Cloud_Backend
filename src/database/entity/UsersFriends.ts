import { Column, CreateDateColumn, Entity, ManyToOne,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => Users, user => user.id)
    @Column("varchar", { name: " user_id" })
    userId: Users;

    @ManyToOne(() => Users, user => user.id)
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
    requested: string

    @UpdateDateColumn()
    @Column("timestamp", { nullable: true })
    updated: string
}
