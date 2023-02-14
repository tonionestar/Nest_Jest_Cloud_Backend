import { Column, CreateDateColumn, Entity, ManyToOne,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Users } from "./Users";

@Entity()
export class UsersFirebase {

    @PrimaryGeneratedColumn("increment", { type: "int", unsigned: true })
    id: number;

    @Column("varchar", { length: 600 })
    token: string;

    @ManyToOne(() => Users, user => user.id)
    @Column("varchar", { name: " user_id" })
    userId: Users;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
    created: string

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false })
    modified: string
}
