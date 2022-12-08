import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";

@Entity()
export class UsersPasswordReset {
    @PrimaryColumn("uuid")
    user_id: string;

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
    created: string

    @Column("timestamp", { nullable: false })
    expired: string

    @Column()
    secret: number

    @Column("tinyint")
    used: boolean

}
