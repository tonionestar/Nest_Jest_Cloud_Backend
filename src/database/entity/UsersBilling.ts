import {
    Column,
    Entity, JoinColumn, OneToOne,
    PrimaryColumn,
} from "typeorm";
import { Users } from "./Users";

@Entity()
export class UsersBilling {

    @PrimaryColumn("uuid", { name: "user_id" })
        userId: string;

    @Column("varchar", { length: 150, nullable: true })
        company: string;

    @Column("varchar", { length: 100, nullable: true })
        forename: string;

    @Column("varchar", { length: 100, nullable: true })
        surname: string;

    @Column("varchar", { length: 50, nullable: true })
        box: string;

    @Column("varchar", { length: 150, nullable: true })
        street: string;

    @Column("varchar", { name: "street_number", length: 20, nullable: true })
        streetNumber: string;

    @Column("varchar", { length: 20, nullable: true })
        zip: string;

    @Column("varchar", { length: 50, nullable: true })
        city: string;

    @Column("varchar", { length: 50, nullable: true })
        state: string;

    @Column("int", { nullable: true })
        country: number;

    @Column("varchar", { nullable: true })
        contactId: string;

    @OneToOne(() => Users, user => user.billing, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
        user: Users;
}
