import { ConflictException, InternalServerErrorException,Injectable } from '@nestjs/common';
import { UserOrmEntity } from '../infrastructure';
import { UserRepository } from '../infrastructure';
import { CreateUserDto } from '../application';

@Injectable()
export class UserDomain {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserOrmEntity> {
        try {
          const existingUser =
            await this.userRepository.findUserByWalletAddress(
              createUserDto.walletAddress,
            );
          if (existingUser) {
            throw new ConflictException(
              'User with this wallet address already exists',
            );
          }
          const newUser = new UserOrmEntity();
          newUser.walletAddress = createUserDto.walletAddress.toLowerCase();
          await this.userRepository.save(newUser);
          return newUser;
        } catch (error) {
          console.error('Error creating user:', error);
          throw new InternalServerErrorException('Failed to create user');
        }
      }

      async findUserByWalletAddress(walletAddress: string,): Promise<UserOrmEntity | null> {
        try {
          return await this.userRepository.findUserByWalletAddress(walletAddress);
        } catch (error) {
          console.error('Error finding user by wallet address:', error);
          throw new InternalServerErrorException(
            'Failed to find user by wallet address',
          );
        }
      }

      async findUserByUserId(id: number): Promise<UserOrmEntity | null> {
        try {
            return await this.userRepository.findUserById(id);
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new InternalServerErrorException('Failed to find user by user ID');
        }
    }

    async getAllUsers(): Promise<UserOrmEntity[]> {
        try {
            return await this.userRepository.getAllUsers();
        } catch (error) {
            console.error('Error retrieving all users:', error);
            throw new InternalServerErrorException('Failed to retrieve users');
        }
    }
}
