import {
    Injectable,
    Inject,
    InternalServerErrorException,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import {
    IJwtRepository,
    INonceRepository,
    JwtAccessTokenEntity,
    JwtRefreshTokenEntity,
  } from '../../domain';
  import { JwtService } from '@nestjs/jwt';
  import { JwtConfigService } from '@app/config';
  import { v4 as uuidv4 } from 'uuid';
  import { ethers } from 'ethers';
  import { UserService } from 'src/modules/user/application';
  import { CreateUserDto } from 'src/modules/user/application';
  
  @Injectable()
  export class AuthService {
    constructor(
      @Inject('IJwtRepository')
      private readonly jwtRepository: IJwtRepository,
      @Inject('INonceRepository')
      private readonly nonceRepository: INonceRepository,
      private readonly jwtService: JwtService,
      private readonly jwtConfigService: JwtConfigService,
      private readonly userService: UserService,
    ) {}
  
    private generateToken(
      id: number,
      expiresIn: number,
      secret: string | Buffer,
    ): string {
      const payload = { sub: id.toString() }; // Convert id to string
      const secretString =
        typeof secret === 'string' ? secret : secret.toString('utf-8');
      return this.jwtService.sign(payload, { expiresIn, secret: secretString });
    }
  
    private generateAccessToken(id: number): JwtAccessTokenEntity {
      const jwtConfig = this.jwtConfigService.createJwtOptions();
      const ttl = Number(jwtConfig.signOptions.expiresIn);
      const accessToken = this.generateToken(id, ttl, jwtConfig.secret);
      return new JwtAccessTokenEntity(
        id,
        ttl,
        accessToken,
        new Date(),
        new Date(),
      );
    }
  
    private generateRefreshToken(id: number): JwtRefreshTokenEntity {
      const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
      const ttl = Number(refreshTokenConfig.signOptions.expiresIn);
      const refreshToken = this.generateToken(
        id,
        ttl,
        refreshTokenConfig.secret,
      );
      return new JwtRefreshTokenEntity(
        id,
        ttl,
        refreshToken,
        new Date(),
        new Date(),
      );
    }
  
    async generateNonce(walletAddress: string): Promise<string> {
      const nonce = uuidv4();
      const nonceEntity = { walletAddress, nonce, createdAt: new Date() };
      await this.nonceRepository.saveNonce(nonceEntity);
      return nonce;
    }
  
    async verifySignature(
      walletAddress: string,
      signature: string,
    ): Promise<boolean> {
      const nonceEntity = await this.nonceRepository.findNonceByWalletAddress(
        walletAddress,
      );
      if (!nonceEntity) {
        throw new UnauthorizedException('Nonce not found or expired');
      }
  
      const nonceMessage = `Sign this nonce: ${nonceEntity.nonce}`;
  
      try {
        const recoveredAddress = ethers.utils.verifyMessage(
          nonceMessage,
          signature,
        );
        if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
          await this.nonceRepository.removeNonce(walletAddress);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        throw new UnauthorizedException('Invalid signature');
      }
    }
  
    async loginUser(id: number) {
      if (id === undefined || id === null) {
        throw new InternalServerErrorException('User ID is undefined or null');
      }
  
      await this.logoutUser(id);
  
      const accessTokenEntity = this.generateAccessToken(id);
      const refreshTokenEntity = this.generateRefreshToken(id);
  
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
  
    async validateToken(token: string, secret: string | Buffer): Promise<any> {
      const secretString =
        typeof secret === 'string' ? secret : secret.toString('utf-8');
      try {
        return await this.jwtService.verifyAsync(token, { secret: secretString });
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  
    async authenticateUser(createUserDto: CreateUserDto, signature: string) {
      const { walletAddress } = createUserDto;
  
      const isVerified = await this.verifySignature(walletAddress, signature);
      if (!isVerified) {
        throw new UnauthorizedException('Signature verification failed');
      }
  
      let user = await this.userService.findUserByWalletAddress(walletAddress);
  
      if (!user) {
        user = await this.userService.createUser(createUserDto);
        user = await this.userService.findUserByWalletAddress(walletAddress);
      }
  
      if (!user || user.id === undefined || user.id === null) {
        throw new InternalServerErrorException(
          'User ID not found after user creation or lookup',
        );
      }
  
      return this.loginUser(user.id);
    }
  
    async refreshTokens(refreshToken: string) {
      try {
        const refreshTokenConfig = this.jwtConfigService.getRefreshTokenConfig();
        const decoded = await this.validateToken(
          refreshToken,
          refreshTokenConfig.secret,
        );
  
        const id = parseInt(decoded.sub, 10);
  
        if (isNaN(id)) {
          throw new UnauthorizedException('Invalid token payload');
        }
  
        const storedRefreshToken =
          await this.jwtRepository.findRefreshTokenById(id);
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
  
    async logout(walletAddress: string) {
      const user = await this.userService.findUserByWalletAddress(walletAddress);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.logoutUser(user.id);
    }
  }
  