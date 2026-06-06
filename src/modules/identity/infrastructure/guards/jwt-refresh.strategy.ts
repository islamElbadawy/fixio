import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService) {
    const cookieExtractor = (req: Request) =>
      req?.cookies?.refreshToken ||
      (typeof req?.headers['x-refresh-token'] === 'string'
        ? req.headers['x-refresh-token'] as string
        : undefined);
    const opts: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret') as string,
      passReqToCallback: true,
    };
    super(opts);
  }

  validate(req: Request, payload: any) {
    const refreshToken: string = req.cookies?.refreshToken;
    return { ...payload, refreshToken };
  }
}
