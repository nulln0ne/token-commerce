import { Injectable } from '@nestjs/common';
import { UserModel } from '@infrastructure/models/user.model';
import { CreateUserDto } from '@application/dto/create-user.dto';
import { UpdateUserDto } from '@application/dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly userModel: UserModel) {}

    create(createUserDto: CreateUserDto) {
        return this.userModel.create(createUserDto);
    }

    findAll() {
        return this.userModel.findAll();
    }

    findOne(id: string) {
        return this.userModel.findOne(id);
    }

    update(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel.update(id, updateUserDto);
    }

    remove(id: string) {
        return this.userModel.remove(id);
    }
}
