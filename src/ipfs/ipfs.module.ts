import { Module } from '@nestjs/common';
import { Helia } from '../infrastructure/helia.js';
import { Pinata } from '../infrastructure/pinata.js';
import { IpfsController } from './ipfs.controller.js';
import { IPFSService } from './ipfs.service.js';

@Module({
  imports: [],
  controllers: [IpfsController],
  providers: [Helia, Pinata, IPFSService],
})
export class IpfsModule {}
