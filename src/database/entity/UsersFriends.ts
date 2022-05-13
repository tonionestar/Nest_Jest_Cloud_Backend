import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import {Users} from "./Users";

export enum FriendsStatus {
    PENDING = "p",
    APPROVED = "a",
    REJECTED = "r",
    BLOCKED = "b"
}

@Entity()
export class UsersFriends {

    @PrimaryGeneratedColumn("increment", {type: "int", unsigned: true})
    id: number;

    @ManyToOne(() => Users, user => user.id)
    user_id: Users;

    @ManyToOne(() => Users, user => user.id)
    friend_user_id: Users;

    @Column({
        type: "enum",
        enum: FriendsStatus,
        default: FriendsStatus.PENDING
    })
    status: FriendsStatus;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false})
    requested: string

    @UpdateDateColumn()
    @Column("timestamp", { nullable: true})
    updated: string
}
