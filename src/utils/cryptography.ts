import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { PostRequestDto } from '../ipfs/dto/request.dto';
import { RecordResponseDto } from '../ipfs/dto/response.dto';

@Injectable()
export class CryptoService {
    private readonly algorithm: string;
    private secretKey: Buffer;

    constructor(private readonly configService: ConfigService) {
        this.algorithm = this.configService.get('ENCRYPTION_ALGORITHM');
        this.secretKey = createHash('sha256').update(this.configService.get('SECRET_KEY')).digest();
    }

    async encryptJsonData(data: PostRequestDto): Promise<string> {
        const iv = randomBytes(16); // Generate a random IV

        const cipher = createCipheriv(this.algorithm, this.secretKey, iv);
        let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
        encryptedData += cipher.final('hex');

        // Concatenate IV and encrypted data into a single string (iv:encryptedData)
        return `${iv.toString('hex')}:${encryptedData}`;
    }

    async decryptJsonData(encryptedString: string): Promise<RecordResponseDto> {
        // Split the string to retrieve the IV and the encrypted data
        const [ivHex, encryptedData] = encryptedString.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        const decipher = createDecipheriv(this.algorithm, this.secretKey, iv);
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');

        return JSON.parse(decryptedData); // Convert back to JSON object
    }
}
