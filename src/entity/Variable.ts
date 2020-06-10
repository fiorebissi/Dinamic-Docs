import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsBoolean } from 'class-validator'
import { Template } from '../entity/Template'

@Entity()
export class Variable {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(type => Template, template => template.variables)
    template!: Template;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    name?: string;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    type?: string;

    @Column('varchar', { length: 20 })
    @Length(1, 19)
    key?: string;

    @Column('tinyint', { width: 1 })
    @IsNotEmpty({ message: 'No puede estar vacio' })
    @IsBoolean({ message: 'Debe ser un valor boolean' })
    isStatus!: boolean;

    @Column({ type: 'timestamp', precision: 3, nullable: true })
    @IsDate()
    createtAt?: Date;
}
