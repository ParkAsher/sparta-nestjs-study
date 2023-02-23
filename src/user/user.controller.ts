import { Controller, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('/login')
    async login() {
        return await this.userService.login('asdf', 'asdf');
    }

    @Post('/signup')
    async createUser() {
        return await this.userService.createUser('asdf', 'asdf', 'asdf');
    }

    @Put('/update')
    async updateUser() {
        this.userService.updateUser('asdf', 'dfdf', 'dfdf');
    }
}
