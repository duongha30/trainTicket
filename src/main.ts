import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MyLogger } from './logger/my.logger';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true, // Enable buffering of logs until the logger is set up
    });
    app.useLogger(new MyLogger());
    app.useGlobalPipes(new ValidationPipe());

    //cors
    app.enableCors({
        origin: '*',
    });

    // support from Express static middleware
    app.useStaticAssets(join(__dirname, '../upload-files'), {
        prefix: '/upload-files',
    });
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
