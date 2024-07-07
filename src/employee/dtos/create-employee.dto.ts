import { IsNotEmpty, IsString, IsUUID, IsEmail } from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
