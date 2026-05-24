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
    UploadedFiles,
    Query,
    Res,
} from '@nestjs/common';
import type { Response } from 'express';
import path from 'path';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/oss';
import * as fs from 'fs';

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

    @Post('upload/large-file')
    @UseInterceptors(   /* validate type of file (e.g. png, jpg) and size of file (e.g. max 2MB) */
        FilesInterceptor('files', 20, {
            dest: 'upload-files',
        }),
    )
    uploadLargeFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: { name: string; chunkIndex: string; totalChunks: string },
    ) {
        const file = files[0];
        const filename = body.name;
        const nameDir = 'upload-files/chunks-' + filename;

        if (!fs.existsSync(nameDir)) {
            fs.mkdirSync(nameDir);
        }

        fs.cpSync(file.path, nameDir + '/' + filename + '-' + body.chunkIndex);
        fs.rmSync(file.path);
    }

    @Get('merge/file')
    mergeFile(@Query('file') filename: string, @Res() res: Response) {
        const nameDir = 'upload-files/chunks-' + filename;
        const files = fs.readdirSync(nameDir); // Reads the list of chunk files inside the chunks folder
        let startPos = 0, countFile = 0;
        files.map((file) => {
            const filePath = nameDir + '/' + file;
            // Opens the chunk as a readable stream
            const streamFile = fs.createReadStream(filePath);
            // Pipes (writes) it into the merged output file at the correct byte offset (start: startPos)
            streamFile.pipe(fs.createWriteStream('upload-files/merged-' + filename, {
                start: startPos,
            })).on('finish', () => {
                countFile++;
                if (files.length === countFile) { // Only remove after all chunks have been finished writing to the merged file
                    fs.rm(nameDir, { recursive: true }, () => { });
                }
            });
            // Advances startPos by the chunk's size so the next chunk is written immediately after
            startPos += fs.statSync(filePath).size;
        });

        return res.json({
            link: 'http://localhost:3000/' + 'upload-files/merged-' + filename,
        });
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
