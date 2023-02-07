import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class UsersAudit {
    //@ManyToOne(() => Users, (users) => users.id)
    @PrimaryColumn("uuid")
    user_id: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false, default: () => "CURRENT_TIMESTAMP" })
    modified: string

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
    created: string

    @Column("timestamp", { nullable: true })
    username: string

    @Column("timestamp", { nullable: true })
    forename: string

    @Column("timestamp", { nullable: true })
    surname: string

    @Column("timestamp", { nullable: true })
    email: string

    @Column("timestamp", { nullable: true })
    hash: string

    @Column("timestamp", { nullable: true })
    billing: string

    @Column("timestamp", { nullable: true })
    shipping: string

    @Column("timestamp", { nullable: true })
    quota: string
}
