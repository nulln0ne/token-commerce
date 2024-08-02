import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../application/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards()
    @Get()
    getAll() {
        return this.userService.getAll();
    }

    @UseGuards()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOneById(id);
    }
}
