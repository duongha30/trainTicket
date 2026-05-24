import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
