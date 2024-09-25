import {
    Controller,
    Body,
    Post,
    UseGuards,
    UnauthorizedException,
    Res,
    Req,
    Get,
  } from '@nestjs/common';
  import { Response, Request } from 'express';
  import { AuthenticationService } from '../../application/services/authentication.service';
  import { AuthUserDto } from '../dtos/auth.dto';
  import { JwtAccessGuard } from 'src/libs/guards/jwt-access.guard';
  import { NonceService } from '../../application/services/nonce.service';
  import { JwtPayload } from '../../infrastructure/entities/jwt/jwt-payload';


  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthenticationService,
      private readonly nonceService: NonceService,
    ) {}
  
    @Post()
    async authenticate(
      @Body() authUserDto: AuthUserDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const tokens = await this.authService.authenticateUser(
        authUserDto
      );

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
      });
  
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });
  
      return { success: true };
    }
  
    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const refreshToken = req.cookies['refreshToken'];
  
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is required');
      }
  
      const tokens = await this.authService.refreshTokens(refreshToken);
  
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: true,
      });
  
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });
  
      return { success: true };
    }
  
    @UseGuards(JwtAccessGuard)
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const user = req.user as JwtPayload;
      const id = parseInt(user.sub, 10);
  
      await this.authService.logoutUser(id);
  
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
  
      return { success: true };
    }
  
    @Post('get-nonce')
    async getNonce(@Body('walletAddress') walletAddress: string) {
      if (!walletAddress) {
        throw new UnauthorizedException('Wallet address is required');
      }
      const nonce = await this.nonceService.generateNonce(walletAddress);
      return { nonce: `${nonce}` };
    }
  }
  