import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';
import { JwtAccessGuard } from 'src/auth/application/jwt-access.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAccessGuard)
    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @UseGuards(JwtAccessGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }
}
