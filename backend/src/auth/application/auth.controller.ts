import {
    Controller,
    Post,
    Body,
    Logger,
    BadRequestException,
    InternalServerErrorException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { AuthService } from '../domain/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new user with a wallet address' })
    @ApiBody({ description: 'User data', type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiResponse({ status: 409, description: 'User with this wallet address already exists.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async create(@Body() createUserDto: CreateUserDto) {
        this.logger.log(`Received request to create a user with wallet address: ${createUserDto.walletAddress}`);
        try {
            const result = await this.authService.create(createUserDto);
            this.logger.log(`Successfully created user with ID: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create user', error.stack);
            if (error instanceof BadRequestException) {
                throw new BadRequestException('Invalid input data');
            }
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw new InternalServerErrorException('An error occurred while creating the user');
        }
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh JWT tokens' })
    @ApiBody({ description: 'Refresh token', type: String })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async refresh(@Body('refreshToken') refreshToken: string) {
        this.logger.log(`Received request to refresh tokens`);
        try {
            const userId = await this.authService.validateRefreshToken(refreshToken);
            if (!userId) {
                throw new UnauthorizedException('Invalid refresh token');
            }
            const tokens = await this.authService.refreshTokens(userId, refreshToken);
            this.logger.log(`Tokens refreshed for user ID: ${userId}`);
            return tokens;
        } catch (error) {
            this.logger.error('Failed to refresh tokens', error.stack);
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException(error.message);
            }
            throw new InternalServerErrorException('An error occurred while refreshing tokens');
        }
    }
}
