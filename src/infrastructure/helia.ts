import { json } from '@helia/json';
import { unixfs } from '@helia/unixfs';
import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { createHelia, HeliaLibp2p } from 'helia';
import { CID } from 'multiformats/cid';
import { IPFSClient } from '../domain/ipfs-client.interface';

@Injectable()
export class Helia implements OnApplicationBootstrap, OnModuleDestroy, IPFSClient {
    private helia: HeliaLibp2p;

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const heliaFile = unixfs(this.helia);
        const cid = await heliaFile.addBytes(file.buffer);
        return cid.toString();
    }

    async uploadJSON(record: { data: string }): Promise<string> {
        const heliaJson = json(this.helia);
        const cid = await heliaJson.add(record);
        return cid.toString();
    }

    async getFile(hash: string): Promise<Buffer> {
        const heliaFile = unixfs(this.helia);
        const cid = CID.parse(hash);

        const chunks = [];
        for await (const chunk of heliaFile.cat(cid)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }

    async getRecord(hash: string): Promise<{ data: string }> {
        const heliaJSON = json(this.helia);
        const cid = CID.parse(hash);
        const record = heliaJSON.get(cid) as unknown as { data: string };
        return record;
    }

    async onApplicationBootstrap() {
        this.helia = await createHelia();
    }

    async onModuleDestroy() {
        if (this.helia) await this.helia.stop();
    }
}
