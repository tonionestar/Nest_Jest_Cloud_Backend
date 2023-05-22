import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersAudit } from "./UsersAudit";
import { UsersBilling } from "./UsersBilling";
import { UsersFirebase } from "./UsersFirebase";
import { UsersPasswordReset } from "./UsersPasswordReset";
import { UsersQuota } from "./UsersQuota";
import { UsersShipping } from "./UsersShipping";
import { UsersStripe } from "./UsersStripe";

@Entity()
export class Users {

    @PrimaryGeneratedColumn("uuid")
        id: string;

    @Column("varchar", { length: 40, nullable: false, unique: true })
        username: string;

    @Column("varchar", { length: 200, nullable: false, unique: true })
        email: string;

    @Column("varchar", { length: 32, nullable: false })
        salt: string;

    @Column("varchar", { length: 32, nullable: false })
        session: string;

    @Column("varchar", { length: 128, nullable: false })
        hash: string;

    @Column("varchar", { length: 100, nullable: true })
        forename: string;

    @Column("varchar", { length: 100, nullable: true })
        surname: string;

    @OneToOne(() => UsersBilling, billing => billing.user)
        billing: Promise<UsersBilling>;

    @OneToOne(() => UsersAudit, audit => audit.user)
        audit: Promise<UsersAudit>;

    @OneToOne(() => UsersFirebase, firebase => firebase.user)
        firebase: Promise<UsersFirebase>;

    @OneToOne(() => UsersPasswordReset, passwordReset => passwordReset.user)
        passwordReset: Promise<UsersPasswordReset>;

    @OneToOne(() => UsersQuota, quota => quota.user)
        quota: Promise<UsersQuota>;

    @OneToMany(() => UsersShipping, shipping => shipping.user)
        shipping: Promise<UsersShipping[]>;

    @OneToOne(() => UsersStripe, stripe => stripe.user)
        stripe: Promise<UsersStripe>;
}
