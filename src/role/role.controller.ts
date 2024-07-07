import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  Body,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindAllQueryDto, PaginationQueryDto } from './dtos/find-all-query.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get('/hierachy')
  findAll(@Query() { flat, depth }: FindAllQueryDto) {
    return this.rolesService.findAll(flat, depth);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  //@Get(':id/employees')
  // findEmployeesOfRole(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Query() { limit, page }: PaginationQueryDto,
  // ) {
  //   return this.rolesService.findAllDescendants(id, limit, page);
  // }

  // @Get(':id/except_descendants')
  // getAllRolesExceptDescendants(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.rolesService.getAllRolesExceptDescendants(id);
  // }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }
  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    return this.rolesService.findChildren(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.rolesService.remove(id);
  }
}
