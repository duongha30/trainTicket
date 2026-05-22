import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { DbService } from 'src/db/db.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

    @Inject(DbService)
    dbService: DbService;

    async login(loginUserDto: LoginUserDto) {
        const users: User[] = (await this.dbService.read<User[]>()) || [];
        const user = users.find(user => user.accountname === loginUserDto.accountname && user.password === loginUserDto.password);
        if (!user) {
            throw new BadRequestException('Invalid account name or password');
        }
        return user;
    }

    async register(registerUserDto: RegisterUserDto) {
        const users: User[] = (await this.dbService.read<User[]>()) || [];

        //Check if user already exists
        const existingUser = users.find(user => user.accountname === registerUserDto.accountname);
        if (existingUser) {
            throw new BadRequestException('Account name already exists');
        }

        const user = new User();
        user.accountname = registerUserDto.accountname;
        user.password = registerUserDto.password;
        users.push(user);

        await this.dbService.write(users);
        return user;
    }

    findAll() {
        return `This action returns all user`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
