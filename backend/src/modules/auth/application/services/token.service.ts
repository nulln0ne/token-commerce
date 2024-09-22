import { Injectable } from '@nestjs/common';
import { JwtAccessTokenEntity, JwtRefreshTokenEntity } from '../../domain';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from '@app/config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigService: JwtConfigService,
  ) {}

  generateAccessToken(id: number): JwtAccessTokenEntity {
    const jwtConfig = this.jwtConfigService.createJwtOptions();
    const expiresIn = jwtConfig.signOptions.expiresIn;
    const ttl = typeof expiresIn === 'string' ? parseInt(expiresIn, 10) : expiresIn;

    const accessToken = this.jwtService.sign(
      { sub: id.toString() },
      { expiresIn: ttl, secret: jwtConfig.secret },
    );

    return new JwtAccessTokenEntity(id, ttl, accessToken, new Date(), new Date());
  }

  generateRefreshToken(id: number): JwtRefreshTokenEntity {
    const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
    const expiresIn = refreshTokenConfig.signOptions.expiresIn;
    const ttl = typeof expiresIn === 'string' ? parseInt(expiresIn, 10) : expiresIn;

    const refreshToken = this.jwtService.sign(
      { sub: id.toString() },
      { expiresIn: ttl, secret: refreshTokenConfig.secret },
    );

    return new JwtRefreshTokenEntity(id, ttl, refreshToken, new Date(), new Date());
  }

  async validateAccessToken(token: string): Promise<any> {
    const jwtConfig = this.jwtConfigService.createJwtOptions();
    return this.jwtService.verifyAsync(token, { secret: jwtConfig.secret });
  }

  async validateRefreshToken(token: string): Promise<any> {
    const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
    return this.jwtService.verifyAsync(token, { secret: refreshTokenConfig.secret });
  }

  getRefreshTokenConfig() {
    return this.jwtConfigService.getRefreshTokenConfig();
  }
}
