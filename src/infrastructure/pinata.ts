import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Blob } from 'node:buffer';
import { PinataSDK } from 'pinata-web3';
import { IPFSClient } from '../domain/ipfs-client.interface';

@Injectable()
export class Pinata implements OnModuleInit, IPFSClient {
    private pinata: PinataSDK;

    constructor(private readonly configService: ConfigService) {}

    async uploadFile(file: Express.Multer.File): Promise<string> {
        //@ts-expect-error - The buffer will be streamed
        const cid = await this.pinata.upload.stream(file.buffer, {
            metadata: { name: `record-${Date.now()}.${file.mimetype.split('/')[1]}` },
        });

        return cid.IpfsHash;
    }

    async uploadJSON(record: { data: string }): Promise<string> {
        const cid = await this.pinata.upload.json(record, {
            metadata: { name: `record-${Date.now()}.json` },
        });
        return cid.IpfsHash;
    }

    async getFile(hash: string): Promise<Buffer> {
        const { data } = await this.pinata.gateways.get(hash);
        if (data instanceof Blob) {
            const arrayBuffer = await data.arrayBuffer();
            return Buffer.from(arrayBuffer);
        }
        return Buffer.from(data as string);
    }

    async getRecord(hash: string): Promise<{ data: string }> {
        const { data, contentType } = await this.pinata.gateways.get(hash);
        if (contentType !== 'application/json') throw new Error('Unsupported content type');

        return data as unknown as { data: string };
    }

    async onModuleInit() {
        this.pinata = new PinataSDK({
            pinataJwt: this.configService.get('PINATA_JWT'),
            pinataGateway: this.configService.get('PINATA_GATEWAY_URL'),
        });
    }
}
