import { Controller, Get, UseGuards, Logger, InternalServerErrorException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/application/jwt.guard';
import { UserService } from '../domain/user.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../domain/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    @ApiOperation({ summary: 'Get a list of all users' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Successfully fetched users', type: [User] })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async findAll() {
        this.logger.log('Received request to fetch all users');
        try {
            const users = await this.userService.findAll();
            this.logger.log(`Successfully fetched ${users.length} users`);
            return users;
        } catch (error) {
            this.logger.error('Failed to fetch users', error.stack);
            throw new InternalServerErrorException('An error occurred while fetching users');
        }
    }
}
