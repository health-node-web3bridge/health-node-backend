import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IpfsModule } from './ipfs/ipfs.module.js';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), IpfsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
