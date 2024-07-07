import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, parentId } = createRoleDto;
    const parentRole = parentId
      ? await this.rolesRepository.findOne({ where: { id: parentId } })
      : null;
    const role = this.rolesRepository.create({
      name,
      description,
      // reportsTo: parentRole,
    });
    return this.rolesRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    console.log(`Updating role with ID: ${id}`);

    // Fetch the existing role with its relations
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['children', 'reportsTo'],
    });
    if (!role) {
      console.error(`Role with ID ${id} not found`);
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const { name, description, parentId } = updateRoleDto;

    // Log the update details
    // console.log(
    //   `Updating role name: ${name}, description: ${description}, parentId: ${parentId}`,
    // );

    // Handle parent role assignment
    let parentRole = null;
    if (parentId) {
      if (parentId === id) {
        throw new BadRequestException('A role cannot be its own parent');
      }
      parentRole = await this.rolesRepository.findOne({
        where: { id: parentId },
      });
      if (!parentRole) {
        throw new BadRequestException('Parent role not found');
      }
    }

    // Update the role fields
    role.name = name;
    role.description = description;
    role.reportsTo = parentRole;

    const updatedRole = await this.rolesRepository.save(role);

    // Log the updated role
    // console.log(`Role updated: ${JSON.stringify(updatedRole)}`);

    return updatedRole;
  }

  async findOne(id: string, flat?: boolean): Promise<Role> {
    const relations = flat ? [] : ['children', 'employees'];
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: flat ? [] : ['employees'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async findAll(flat?: boolean, depth?: number): Promise<Role[]> {
    const relations = flat ? [] : ['children', 'reportsTo'];
    const roles = await this.rolesRepository.find({
      relations,
    });
    if (flat) {
      return roles;
    }
    return this.buildHierarchy(roles);
  }

  async findAllDescendants(
    id: string,
    limit?: number,
    page?: number,
  ): Promise<Role[]> {
    const role = await this.findOne(id);
    const query = this.rolesRepository
      .createQueryBuilder('role')
      .where('role.reportsToId = :id', { id })
      .skip(limit * (page - 1))
      .take(limit);
    return query.getMany();
  }

  // async getAllRolesExceptDescendants(id: string): Promise<Role[]> {
  //   const descendants = await this.findAllDescendants(id);
  //   const descendantIds = descendants.map((role) => role.id);
  //   const query = this.rolesRepository
  //     .createQueryBuilder('role')
  //     .where('role.id NOT IN (:...descendantIds)', { descendantIds });
  //   return query.getMany();
  // }

  async findChildren(id: string): Promise<Role[]> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['children'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role.children;
  }

  async remove(id: string): Promise<void> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['children', 'reportsTo'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const parentRole = role.reportsTo;

    if (role.children && role.children.length > 0) {
      for (const child of role.children) {
        child.reportsTo = parentRole;
        await this.rolesRepository.save(child);
      }
    }

    await this.rolesRepository.delete(role.id);
  }

  private buildHierarchy(roles: Role[]): Role[] {
    const roleMap = new Map<string, Role>();

    roles.forEach((role) => {
      role.children = [];
      roleMap.set(role.id, role);
    });

    const roots: Role[] = [];

    roles.forEach((role) => {
      if (role.reportsTo) {
        const parentRole = roleMap.get(role.reportsTo.id);
        if (parentRole) {
          parentRole.children.push(role);
        }
      } else {
        roots.push(role);
      }
    });

    return roots;
  }
}
