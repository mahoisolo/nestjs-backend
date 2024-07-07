import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeesController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), RoleModule], // Import RoleModule
  controllers: [EmployeesController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
