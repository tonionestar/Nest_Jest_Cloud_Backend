import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, OneToOne,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class UsersAudit {
    @PrimaryColumn("uuid", { name: " user_id" })
        userId: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
        modified: string;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
        created: string;

    @Column("timestamp", { nullable: true })
        username: string;

    @Column("timestamp", { nullable: true })
        forename: string;

    @Column("timestamp", { nullable: true })
        surname: string;

    @Column("timestamp", { nullable: true })
        email: string;

    @Column("timestamp", { nullable: true })
        hash: string;

    @Column("timestamp", { nullable: true })
        billing: string;

    @Column("timestamp", { nullable: true })
        shipping: string;

    @Column("timestamp", { nullable: true })
        quota: string;
    @OneToOne(() => Users, user => user.audit, { onDelete: "CASCADE" })
    @JoinColumn({ name: " user_id" })
        user: Users;
}
