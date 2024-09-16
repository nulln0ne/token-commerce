import { Injectable, Inject, InternalServerErrorException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { IJwtRepository } from '../../domain';
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
    @Inject('IJwtRepository')
    private readonly jwtRepository: IJwtRepository,
  ) {}

  async authenticateUser(createUserDto: CreateUserDto, signature: string) {
    const { walletAddress } = createUserDto;

    const isVerified = await this.signatureService.verifySignature(walletAddress, signature);
    if (!isVerified) {
      throw new UnauthorizedException('Signature verification failed');
    }

    let user = await this.userService.findUserByWalletAddress(walletAddress);

    if (!user) {
      user = await this.userService.createUser(createUserDto);
      user = await this.userService.findUserByWalletAddress(walletAddress);
    }

    if (!user || !user.userId) {
      throw new InternalServerErrorException('User ID not found after user creation or lookup');
    }

    return this.loginUser(user.userId);
  }

  async loginUser(userId: string) {
    if (!userId) {
      throw new InternalServerErrorException('User ID is undefined');
    }

    await this.logoutUser(userId);

    const accessTokenEntity = this.tokenService.generateAccessToken(userId);
    const refreshTokenEntity = this.tokenService.generateRefreshToken(userId);

    await this.jwtRepository.saveAccessToken(accessTokenEntity);
    await this.jwtRepository.saveRefreshToken(refreshTokenEntity);

    return {
      accessToken: accessTokenEntity.accessToken,
      refreshToken: refreshTokenEntity.refreshToken,
    };
  }

  async logoutUser(userId: string) {
    await this.jwtRepository.removeAccessToken(userId);
    await this.jwtRepository.removeRefreshToken(userId);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const refreshTokenConfig = this.tokenService.getRefreshTokenConfig();
      const decoded = await this.tokenService.validateToken(refreshToken, refreshTokenConfig.secret);

      const userId = decoded.sub;

      const storedRefreshToken = await this.jwtRepository.findRefreshTokenByUserId(userId);
      if (!storedRefreshToken || storedRefreshToken.refreshToken !== refreshToken) {
        throw new ForbiddenException('Invalid refresh token');
      }

      await this.jwtRepository.removeRefreshToken(userId);
      return this.loginUser(userId);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  
}
