import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsBoolean } from 'class-validator'
import { Variable } from './Variable'

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(type => Variable, varaible => varaible.options)
    variable!: Variable;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    name?: string;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    type?: string;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    value?: string;

    @Column('tinyint', { width: 1 })
    @IsNotEmpty({ message: 'No puede estar vacio' })
    @IsBoolean({ message: 'Debe ser un valor boolean' })
    isStatus!: boolean;

    @Column({ type: 'timestamp', precision: 3, nullable: true })
    @IsDate()
    createtAt?: Date;
}
