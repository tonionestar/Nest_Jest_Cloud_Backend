import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne} from "typeorm";
import {Users} from "./Users";

@Entity()
export class UsersAudit {

    @PrimaryGeneratedColumn("increment", {type: "int", unsigned: true})
    id: number;

    @ManyToOne(() => Users, (users) => users.id)
    user_id: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false})
    modified: string

    @CreateDateColumn()
    @Column("timestamp", { nullable: false})
    created: string
}
