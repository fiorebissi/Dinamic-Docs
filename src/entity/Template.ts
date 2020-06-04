import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'
import { Variable } from './Variable'

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('varchar', { length: 50 })
  @Length(1, 49)
  @IsOptional()
  name?: string;

  @Column('varchar', { length: 10 })
  @Length(1, 9)
  @IsOptional()
  type?: string;

  @Column('varchar', { length: 50 })
  @Length(1, 49)
  @IsOptional()
  route?: string;

  @Column('varchar', { length: 250 })
  @Length(1, 250)
  @IsOptional()
  image?: string;

  @OneToMany(type => Variable, variable => variable.template)
  variables!: Variable[];

  @Column('tinyint', { width: 1 })
  @IsNotEmpty({ message: 'No puede estar vacio' })
  @IsBoolean({ message: 'Debe ser un valor boolean' })
  isStatus?: boolean;

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  @IsDate()
  fechaCreacion?: Date;
}
