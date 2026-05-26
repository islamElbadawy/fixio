import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../../domain/entities/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@fixio.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterUserDto {
  @ApiProperty({ example: 'admin@fixio.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({ example: 'admin' })
  @IsEnum(UserRole)
  role!: UserRole;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token_here' })
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}

export class TokenResponseDto {
  @ApiProperty({ example: 'access_token_here' })
  accessToken!: string;

  @ApiProperty({ example: 'refresh_token_here' })
  refreshToken!: string;

  @ApiProperty({ example: 3600 })
  expiresIn!: number;
}
