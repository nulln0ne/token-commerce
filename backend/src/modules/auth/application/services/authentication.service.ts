import {Injectable,InternalServerErrorException,UnauthorizedException,ForbiddenException,} from '@nestjs/common';
import { JwtRepository } from '../../infrastructure';
import { UserService } from 'src/modules/user/application';
import { CreateUserDto } from 'src/modules/user/application';
import { TokenService } from './token.service';
import { SignatureService } from './signature.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly signatureService: SignatureService,
    private readonly userService: UserService,
    private readonly jwtRepository: JwtRepository,
  ) {}


  async authenticateUser(createUserDto: CreateUserDto, signature: string) {

    const { walletAddress } = createUserDto;
    const isVerified = await this.signatureService.verifySignature(walletAddress,signature,);
    
    if (!isVerified) {
      throw new UnauthorizedException('Signature verification failed');
    }

    let user = await this.userService.findUserByWalletAddress(walletAddress);

    if (!user) {
      user = await this.userService.createUser(createUserDto);
      if (!user || user.id === undefined || user.id === null) {
        throw new InternalServerErrorException(
          'User creation failed',
        );
      }
    }

    return this.loginUser(user.id);
  }

  async loginUser(id: number) {
    if (id === undefined || id === null) {
      throw new InternalServerErrorException('User ID is undefined or null');
    }

    await this.logoutUser(id);

    const accessTokenEntity = this.tokenService.generateAccessToken(id);
    const refreshTokenEntity = this.tokenService.generateRefreshToken(id);

    await this.jwtRepository.saveAccessToken(accessTokenEntity);
    await this.jwtRepository.saveRefreshToken(refreshTokenEntity);

    return {
      accessToken: accessTokenEntity.accessToken,
      refreshToken: refreshTokenEntity.refreshToken,
    };
  }

  async logoutUser(id: number) {
    await this.jwtRepository.removeAccessToken(id);
    await this.jwtRepository.removeRefreshToken(id);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const refreshTokenConfig = this.tokenService.getRefreshTokenConfig();
      const decoded = await this.tokenService.validateToken(
        refreshToken,
        refreshTokenConfig.secret,
      );

      const id = parseInt(decoded.sub, 10);

      if (isNaN(id)) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const storedRefreshToken = await this.jwtRepository.findRefreshTokenById(
        id,
      );
      if (
        !storedRefreshToken ||
        storedRefreshToken.refreshToken !== refreshToken
      ) {
        throw new ForbiddenException('Invalid refresh token');
      }

      await this.jwtRepository.removeRefreshToken(id);
      return this.loginUser(id);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
