import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, validateCustomDecorators: true }));
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    //CORS setting
    app.enableCors({
        origin: '*',
        methods: 'GET,POST',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    await app.listen(port);
}
bootstrap();
