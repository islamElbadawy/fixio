import { Inject, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';

// Lightweight local type to avoid depending on external jsonwebtoken types here
type JwtSignOptions = { expiresIn?: string | number; secret?: string };
import { UserRole } from '../../domain/entities/role.enum';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterUserDto, TokenResponseDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<{ id: string; email: string; role: UserRole }> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      role: dto.role,
    });

    await this.userRepository.save(user);
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refresh(
    userId: string,
    refreshToken: string,
  ): Promise<TokenResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );
    if (!tokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.refreshTokenHash = null;
      await this.userRepository.save(user);
    }
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<TokenResponseDto> {
    const accessSecret = this.config.get<string>('jwt.accessSecret') as string;
    const refreshSecret = this.config.get<string>(
      'jwt.refreshSecret',
    ) as string;
    const accessExpiresIn = this.config.get<string>(
      'jwt.accessExpiresIn',
    ) as string;
    const refreshExpiresIn = this.config.get<string>(
      'jwt.refreshExpiresIn',
    ) as string;

    interface AuthPayload {
      sub: string;
      email: string;
      role: UserRole;
    }

    const payload: AuthPayload = { sub: userId, email, role };

    const accessOpts: JwtSignOptions = { expiresIn: accessExpiresIn };
    const refreshOpts: JwtSignOptions = { expiresIn: refreshExpiresIn };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { ...(accessOpts as object), secret: accessSecret } as any),
      this.jwtService.signAsync(payload, { ...(refreshOpts as object), secret: refreshSecret } as any),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(accessExpiresIn, 10),
    };
  }

  private async storeRefreshToken(
    userId: string,
    token: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      user.refreshTokenHash = await bcrypt.hash(token, 10);
      await this.userRepository.save(user);
    }
  }
}
