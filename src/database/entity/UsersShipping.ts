import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { ConstCountries } from "./ConstCountries";
import { Users } from "./Users";

export enum ShippingType {
    ADDRESS = "address",
    BOX = "box",
    PACKSTATION = "packstation"
}

@Entity()
export class UsersShipping {

    @PrimaryGeneratedColumn("increment", { type: "int", unsigned: true })
    id: number;

    @Column("varbinary", { length: 40 })
    @OneToOne(() => Users)
    user_id: string;

    @Column("varchar", { length: 50, nullable: true })
    name: string;

    @Column("varchar", { length: 100, nullable: true })
    forename: string;

    @Column("varchar", { length: 100, nullable: true })
    surname: string;

    @Column({
        type: "enum",
        enum: ShippingType,
        default: ShippingType.ADDRESS
    })
    shipping_type: ShippingType;

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

    @Column("varchar", { length: 10, nullable: true })
    packstation: string;

    @Column("varchar", { length: 20, nullable: true })
    postnumber: string;
}
