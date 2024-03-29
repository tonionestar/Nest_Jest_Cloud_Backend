import {
    Column,
    Entity, JoinColumn,
    ManyToOne, PrimaryGeneratedColumn
} from "typeorm";

import { Users } from "./Users";

export enum ShippingType {
    ADDRESS = "address",
    PACKSTATION = "packstation"
}

@Entity()
export class UsersShipping {

    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column("uuid", { name: "user_id" })
        userId: string;

    @Column("varchar", { length: 50, nullable: true })
        name: string;

    @Column("varchar", { length: 150, nullable: true })
        company: string;

    @Column("varchar", { length: 100, nullable: true })
        forename: string;

    @Column("varchar", { length: 100, nullable: true })
        surname: string;

    @Column({
        type: "enum",
        enum: ShippingType,
        default: ShippingType.ADDRESS,
        name: "shipping_type"
    })
        shippingType: ShippingType;

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

    @Column("varchar", { length: 10, nullable: true })
        packstation: string;

    @Column("varchar", { length: 20, nullable: true })
        postnumber: string;

    @ManyToOne(() => Users, user => user.shipping, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
        user: Users;
}
