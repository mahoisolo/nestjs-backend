import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, QueryFailedError } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { RolesService } from 'src/role/role.service'; 

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private rolesService: RolesService, // Correct injection
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      role: await this.rolesService.findOne(createEmployeeDto.roleId),
    });

    try {
      const newEmployee = await this.employeesRepository.save(employee);
      return newEmployee;
    } catch (err: unknown) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === '23505'
      ) {
        if ((err.driverError?.detail as string).includes('email'))
          throw new BadRequestException(
            'Employee with this email already exists.',
          );
        else
          throw new BadRequestException(
            'Employee with this phone number already exists.',
          );
      }
      throw err;
    }
  }

  async findAll(q = '', page = 1, limit = 10) {
    const skip = (page - 1) * limit,
      take = limit;

    const [results, total] = await this.employeesRepository.findAndCount({
      skip,
      take,
      where: [{ fullName: Like(`%${q}%`) }, { email: Like(`%${q}%`) }],
      order: {
        fullName: 'ASC',
      },
      // relations: {
      //   role: {
      //     reportsTo: true,
      //   },
      // },
    });

    // Removing pagination related values from the returned object
    return results;
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: { role: true },
    });

    if (!employee)
      throw new NotFoundException(`Can't find employee with id '${id}'`);
    return employee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id); 

    const updatedEmployee = this.employeesRepository.create({
      ...employee,
      ...updateEmployeeDto,
      role: await this.rolesService.findOne(updateEmployeeDto.roleId),
    });

    try {
      await this.employeesRepository.save(updatedEmployee);
      return updatedEmployee;
    } catch (err: unknown) {
      if (
        err instanceof QueryFailedError &&
        err.driverError?.code === '23505'
      ) {
        if ((err.driverError?.detail as string).includes('email'))
          throw new BadRequestException(
            'Employee with this email already exists.',
          );
        else
          throw new BadRequestException(
            'Employee with this phone number already exists.',
          );
      }
      throw err;
    }
  }

  async remove(id: string) {
    const employee = await this.findOne(id); 
    await this.employeesRepository.remove(employee);
  }
}
