import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {Employee} from 'src/employee/entities/employee.entity'
@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Role, (role) => role.children)
  reportsTo: Role;

  @OneToMany(() => Role, (role) => role.reportsTo)
  children: Role[];

  @OneToMany(() => Employee, (employee) => employee.role)
  employees: Employee[];
}
