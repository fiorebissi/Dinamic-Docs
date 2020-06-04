import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  @IsDate()
  createdAt?: Date;

  @Column('int', { unique: true })
  @IsNotEmpty()
  userId?: number;

  @Column('varchar', { length: 15, unique: true })
  @Length(2, 14)
  alias?: string;

  @Column('varchar', { length: 15 })
  @Length(2, 14)
  role?: string;

  @Column('tinyint', { width: 1 })
  @IsNotEmpty({ message: 'No puede estar vacio' })
  @IsBoolean({ message: 'Debe ser un valor boolean' })
  isStatus?: Boolean;

  @Column('tinyint', { width: 1 })
  @IsNotEmpty({ message: 'No puede estar vacio' })
  @IsBoolean({ message: 'Debe ser un valor boolean' })
  isDelete?: Boolean;

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
