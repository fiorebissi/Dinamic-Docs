import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsOptional, IsBoolean, Min } from 'class-validator'
import { Template } from './Template'

@Entity()
export class Mailing {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('varchar', { length: 50 })
    @Length(1, 49)
    @IsOptional()
    author!: string;

    @ManyToOne(type => Template)
    template!: Template;

    @Column('varchar', { length: 10 })
    @Length(1, 9)
    @IsOptional()
    type?: string;

    @Column('varchar', { length: 50 })
    @Min(1)
    @IsOptional()
    count?: Number;

    @Column('tinyint', { width: 1 })
    @IsNotEmpty({ message: 'No puede estar vacio' })
    @IsBoolean({ message: 'Debe ser un valor boolean' })
    isStatus?: boolean;

    @Column({ type: 'timestamp', precision: 3, nullable: true })
    @IsDate()
    createtAt?: Date;
}
