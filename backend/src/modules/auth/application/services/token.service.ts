import {Injectable,} from '@nestjs/common';
import {JwtAccessTokenEntity,JwtRefreshTokenEntity,} from '../../domain';
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
    const ttl = Number(jwtConfig.signOptions.expiresIn);
    const accessToken = this.jwtService.sign(
      { sub: id.toString() }, // Convert id to string for JWT payload
      { expiresIn: ttl, secret: jwtConfig.secret },
    );
    return new JwtAccessTokenEntity(id, ttl, accessToken, new Date(), new Date());
  }

  generateRefreshToken(id: number): JwtRefreshTokenEntity {
    const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
    const ttl = Number(refreshTokenConfig.signOptions.expiresIn);
    const refreshToken = this.jwtService.sign(
      { sub: id.toString() }, // Convert id to string for JWT payload
      { expiresIn: ttl, secret: refreshTokenConfig.secret },
    );
    return new JwtRefreshTokenEntity(id, ttl, refreshToken, new Date(), new Date());
  }

  async validateToken(token: string, secret: string | Buffer): Promise<any> {
    const secretString =
      typeof secret === 'string' ? secret : secret.toString('utf-8');
    return this.jwtService.verifyAsync(token, { secret: secretString });
  }

  getRefreshTokenConfig() {
    return this.jwtConfigService.getRefreshTokenConfig();
  }
}
