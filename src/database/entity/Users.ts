import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
