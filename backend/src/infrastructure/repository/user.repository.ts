import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/entities/user/user.entity';
import { UserModel } from '@infrastructure/models/user.model';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserModel],
    exports: [UserModel],
})
export class UserRepositoryModule {}
