import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UsersAudit {

    @PrimaryGeneratedColumn("increment", { type: "int", unsigned: true })
    id: number;

    //@ManyToOne(() => Users, (users) => users.id)
    @Column("uuid", { nullable: false })
    user_id: string;

    @UpdateDateColumn()
    @Column("timestamp", { nullable: false })
    modified: string

    @CreateDateColumn()
    @Column("timestamp", { nullable: false })
    created: string
}
