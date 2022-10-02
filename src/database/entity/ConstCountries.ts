import { Column,Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConstCountries {

    @PrimaryGeneratedColumn("increment", { type: "smallint", unsigned: true })
    id: number;

    @Column("char", { length: 2, nullable: false })
    country_code: string;

    @Column("varchar", { length: 80, nullable: false })
    country_name: string;

    @Column("char", { length: 3, nullable: false })
    iso3: string;

    @Column("smallint", { nullable: false })
    phonecode: number;

    @Column("varchar", { length: 2, nullable: false })
    continent_code: string;
}
