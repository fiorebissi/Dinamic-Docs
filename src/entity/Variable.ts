import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsBoolean } from 'class-validator'
import { Template } from '../entity/Template'
import { Option } from './Option'

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

	@OneToMany(type => Option, option => option.variable)
	options!: Option[];

	@Column('tinyint', { width: 1 })
	@IsNotEmpty({ message: 'No puede estar vacio' })
	@IsBoolean({ message: 'Debe ser un valor boolean' })
	isStatus!: boolean;

	@Column({ type: 'timestamp', precision: 3, nullable: true })
	@IsDate()
	createtAt?: Date;
}
