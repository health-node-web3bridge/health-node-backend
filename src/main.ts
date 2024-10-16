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
        methods: 'GET,OPTIONS,POST',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
        allowedHeaders:
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    });

    await app.listen(port);
}
bootstrap();
