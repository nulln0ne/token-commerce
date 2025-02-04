import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity, UserRepository } from './infrastructure';
import { UserController } from './presentation';
import { UserService } from './application';
import { UserDomain } from './domain/user.domain'; 
import { BlockchainEthModule } from '../blockchain-eth/blockchain-eth.module';


@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity]),BlockchainEthModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, UserDomain],
    exports: [UserService],
})
export class UserModule {}

        