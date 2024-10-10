export interface IPFSClient {
  uploadFile(file: Express.Multer.File): Promise<string>;
  uploadJSON(record: Record<string, unknown>): Promise<string>;
  getFile(hash: string): Promise<Buffer>;
  getRecord(hash: string): Promise<JSON>;
}

export enum IPFSEnum {
  PINATA = 'PINATA',
  HELIA = 'HELIA',
}
