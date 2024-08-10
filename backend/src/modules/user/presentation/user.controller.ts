import { JwtAccessGuard } from 'src/modules/auth/application/jwt-access.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../application';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAccessGuard)
    @Get()
    getAll() {
        return this.userService.getAllUsers();
    }

    @UseGuards(JwtAccessGuard)
    @Get(':userId')
    findOne(@Param('userId') userId: string) {
        return this.userService.findUserByUserId(userId);
    }
}
