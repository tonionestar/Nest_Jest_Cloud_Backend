import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

import { ConstCountries } from "./ConstCountries";
import { Users } from "./Users";

@Entity()
export class UsersBilling {

    @PrimaryColumn("uuid")
    user_id: string;

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

    @Column("varchar", { length: 20, nullable: true })
    street_number: string;

    @Column("varchar", { length: 20, nullable: true })
    zip: string;

    @Column("varchar", { length: 50, nullable: true })
    city: string;

    @Column("varchar", { length: 50, nullable: true })
    state: string;

    @ManyToOne(() => ConstCountries, country => country.id)
    country: number;
}
