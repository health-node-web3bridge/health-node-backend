import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';
import { IPFSEnum } from '../domain/ipfs-client.interface.js';
import { Helia } from '../infrastructure/helia.js';
import { Pinata } from '../infrastructure/pinata.js';
import { CryptoService } from '../utils/cryptography.js';
import { PostRequestDto } from './dto/request.dto.js';
import { RecordResponseDto } from './dto/response.dto.js';

@Injectable()
export class IPFSService {
    private readonly ipfsClient: Helia | Pinata;

    constructor(
        private readonly helia: Helia,
        private readonly pinata: Pinata,
        private readonly configService: ConfigService,
        private readonly cryptoService: CryptoService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    ) {
        this.ipfsClient = this.configService.get('IPFS_CLIENT') === IPFSEnum.HELIA ? this.helia : this.pinata;
    }
    async uploadFile(file: Express.Multer.File): Promise<string> {
        try {
            const cid = await this.ipfsClient.uploadFile(file);
            return cid.toString();
        } catch (error) {
            this.logger.error('Error uploading file to IPFS:', error);
            throw new Error('Failed to upload file to IPFS');
        }
    }

    async uploadRecord(record: PostRequestDto): Promise<string> {
        try {
            const encryptedRecord = await this.cryptoService.encryptJsonData(record);
            const cid = await this.ipfsClient.uploadJSON({ data: encryptedRecord });
            return cid;
        } catch (error) {
            this.logger.error('Error uploading JSON to IPFS:', error);
            throw new Error('Failed to upload JSON to IPFS');
        }
    }

    async getFile(hash: string): Promise<string> {
        try {
            const fileBuffer = await this.ipfsClient.getFile(hash);
            const base64Data = fileBuffer.toString('base64');
            return base64Data;
        } catch (error) {
            this.logger.error('Error getting file on IPFS:', error);
            throw new Error('Failed to get file on IPFS');
        }
    }

    async getRecord(hash: string): Promise<RecordResponseDto> {
        try {
            const { data } = await this.ipfsClient.getRecord(hash);
            const decryptedRecord = await this.cryptoService.decryptJsonData(data);
            return decryptedRecord;
        } catch (error) {
            this.logger.error('Error getting Record on IPFS:', error);
            throw new Error('Failed to get Record on IPFS');
        }
    }

    async getFiles(hashes: string[]): Promise<string[]> {
        const records = await Promise.all(hashes.map(hash => this.getFile(hash)));
        return records;
    }

    async getRecords(hashes: string[]): Promise<PostRequestDto[]> {
        const records = await Promise.all(hashes.map(hash => this.getRecord(hash)));

        return records;
    }
}
