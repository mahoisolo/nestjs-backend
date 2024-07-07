import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './role/role.service';
import { CreateRoleDto } from './role/dtos/create-role.dto';

@Controller()
export class AppController {
  constructor(private readonly roleService: RolesService) {}

  @Post('roles')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }
}
