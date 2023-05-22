import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

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
        created: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false })
        modified: string;

    @OneToOne(() => Users, user => user.firebase, { onDelete: "CASCADE" })
    @JoinColumn({ name: " user_id" })
        user: Users;
}
