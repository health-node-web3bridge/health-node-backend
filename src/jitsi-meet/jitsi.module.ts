import { Module } from '@nestjs/common';
import { JitsiController } from './jitsi.controller.js';
import { JistiService } from './jitsi.service.js';

@Module({
    imports: [],
    controllers: [JitsiController],
    providers: [JistiService],
})
export class JitsiModule {}
