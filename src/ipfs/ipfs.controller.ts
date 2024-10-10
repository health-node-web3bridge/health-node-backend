import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPFSService } from './ipfs.service.js';

@Controller()
export class IpfsController {
    constructor(private readonly ipfsService: IPFSService) {}

    @UseInterceptors(FileInterceptor('file'))
    @Post('/upload')
    @HttpCode(HttpStatus.CREATED)
    async uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: 'csv' })
                .addMaxSizeValidator({ maxSize: 256000 })
                .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
        )
        file: Express.Multer.File,
    ): Promise<{ cid: string }> {
        const cid = await this.ipfsService.uploadFile(file);
        return { cid };
    }

    @Post('/record')
    @HttpCode(HttpStatus.CREATED)
    async uploadRecord(@Body() body: Record<string, unknown>): Promise<{ cid: string }> {
        const cid = await this.ipfsService.uploadRecord(body);
        return { cid };
    }

    @Get('/file')
    @HttpCode(HttpStatus.OK)
    async getFile(@Query('hash') hash: string) {
        const base64String = this.ipfsService.getFile(hash);
        return base64String;
    }

    @Get('/record')
    @HttpCode(HttpStatus.OK)
    async getRecord(@Query('hash') hash: string) {
        const record = this.ipfsService.getRecord(hash);
        return record;
    }
}
