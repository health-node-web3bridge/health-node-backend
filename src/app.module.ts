import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { IpfsModule } from './ipfs/ipfs.module.js';
import { JitsiModule } from './jitsi-meet/jitsi.module.js';
import { configValidationSchema } from './utils/config.schema.js';
import { Logger } from './utils/logger.js';

@Module({
    imports: [
        WinstonModule.forRoot(new Logger().getLoggerConfig()),
        ConfigModule.forRoot({
            validationSchema: configValidationSchema,
            isGlobal: true,
        }),
        IpfsModule,
        JitsiModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
