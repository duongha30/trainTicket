import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import path from 'path';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/oss';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        console.log('loginUserDto', loginUserDto);
        return this.userService.login(loginUserDto);
    }

    @Post('new')
    create(@Body() registerUserDto: RegisterUserDto) {
        console.log('registerUserDto', registerUserDto);
        return this.userService.register(registerUserDto);
    }

    @Post('upload/avatar')
    @UseInterceptors(   /* validate type of file (e.g. png, jpg) and size of file (e.g. max 2MB) */
        FileInterceptor('file', {
            dest: 'upload-files',
            storage: storage,
            limits: {
                fileSize: 2 * 1024 * 1024, // 2MB
            },
            fileFilter: (req, file, cb) => {
                const extName = path.extname(file.originalname).toLowerCase();
                if (
                    extName === '.png' ||
                    extName === '.jpg' ||
                    extName === '.jpeg'
                ) {
                    cb(null, true);
                } else {
                    cb(
                        new BadRequestException(
                            'Only .png, .jpg and .jpeg files are allowed',
                        ),
                        false,
                    );
                }
            },
        }),
    )
    uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        console.log('upload file: ', file.path);
        return file.path;
    }

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
