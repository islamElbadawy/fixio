import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { UserEntity } from './domain/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { AuthService } from './application/commands/auth.service';
import { JwtStrategy } from './infrastructure/guards/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/guards/jwt-refresh.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { JwtRefreshGuard } from './infrastructure/guards/jwt-refresh.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { AuthController } from './presentaion/auth.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtAuthGuard,
    JwtRefreshGuard,
    RolesGuard,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [
    AuthService,
    JwtAuthGuard,
    JwtRefreshGuard,
    RolesGuard,
    USER_REPOSITORY,
  ],
})
export class IdentityModule {}
