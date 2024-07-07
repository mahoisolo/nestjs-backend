import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './role/role.controller';
import { RolesService } from './role/role.service';
import { CreateRoleDto } from './role/dtos/create-role.dto';
import { UpdateRoleDto } from './role/dtos/update-role.dto';
import { Role } from './role/entities/role.entity';
import { NotFoundException } from '@nestjs/common';

describe('RolesController', () => {
  let rolesController: RolesController;
  let rolesService: RolesService;

  const mockRole = {
    id: '1',
    name: 'Test Role',
    description: 'Test Desc',
    parentId: null,
  };

  const mockRolesService = {
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    remove: jest.fn().mockResolvedValue(undefined),
    findChildren: jest.fn().mockResolvedValue([mockRole]),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    rolesController = moduleRef.get<RolesController>(RolesController);
    rolesService = moduleRef.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(rolesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a role', async () => {
      const dto: CreateRoleDto = {
        name: 'Test Role',
        description: 'Test Desc',
        parentId: null,
      };
      expect(await rolesController.create(dto)).toEqual(mockRole);
      expect(rolesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      expect(await rolesController.findAll({ flat: true, depth: 1 })).toEqual([
        mockRole,
      ]);
      expect(rolesService.findAll).toHaveBeenCalledWith({
        flat: true,
        depth: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single role', async () => {
      expect(await rolesController.findOne('1')).toEqual(mockRole);
      expect(rolesService.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(rolesService, 'findOne').mockResolvedValueOnce(null);
      await expect(rolesController.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a role', async () => {
      const dto: UpdateRoleDto = {
        name: 'Updated Role',
        description: 'Updated Desc',
        parentId: null,
      };
      expect(await rolesController.update('1', dto)).toEqual(mockRole);
      expect(rolesService.update).toHaveBeenCalledWith('1', dto);
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(rolesService, 'update').mockResolvedValueOnce(null);
      const dto: UpdateRoleDto = {
        name: 'Updated Role',
        description: 'Updated Desc',
        parentId: null,
      };
      await expect(rolesController.update('invalid-id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      expect(await rolesController.remove('1')).toBeUndefined();
      expect(rolesService.remove).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(rolesService, 'remove').mockResolvedValueOnce(null);
      await expect(rolesController.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findChildren', () => {
    it('should return an array of children roles', async () => {
      expect(await rolesController.findChildren('1')).toEqual([mockRole]);
      expect(rolesService.findChildren).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if role is not found', async () => {
      jest.spyOn(rolesService, 'findChildren').mockResolvedValueOnce(null);
      await expect(rolesController.findChildren('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
