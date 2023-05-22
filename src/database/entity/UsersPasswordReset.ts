import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class UsersPasswordReset {
    @PrimaryColumn("uuid", { name: " user_id" })
        userId: string;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
        created: string;

    @Column("timestamp", { nullable: false })
        expired: string;

    @Column()
        secret: number;

    @Column("tinyint")
        used: boolean;

    @OneToOne(() => Users, user => user.passwordReset, { onDelete: "CASCADE" })
    @JoinColumn({ name: " user_id" })
        user: Users;
}
