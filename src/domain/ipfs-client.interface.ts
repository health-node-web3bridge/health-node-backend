import { PostRequestDto } from '../ipfs/dto/request.dto.js';

export interface IPFSClient {
    uploadFile(file: Express.Multer.File): Promise<string>;
    uploadJSON(record: PostRequestDto): Promise<string>;
    getFile(hash: string): Promise<Buffer>;
    getRecord(hash: string): Promise<JSON>;
}

export enum IPFSEnum {
    PINATA = 'PINATA',
    HELIA = 'HELIA',
}
