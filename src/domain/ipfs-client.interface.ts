export interface IPFSClient {
    uploadFile(file: Express.Multer.File): Promise<string>;
    uploadJSON(record: { data: string }): Promise<string>;
    getFile(hash: string): Promise<Buffer>;
    getRecord(hash: string): Promise<{ data: string }>;
}

export enum IPFSEnum {
    PINATA = 'PINATA',
    HELIA = 'HELIA',
}
