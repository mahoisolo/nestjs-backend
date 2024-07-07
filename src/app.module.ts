import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mahder',
      database: 'orga_structure',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    EmployeeModule,
    RoleModule, 
  ],
})
export class AppModule {}
