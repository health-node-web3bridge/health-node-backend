import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RecordResponseDto } from '../../../src/ipfs/dto/response.dto.js';
import { IpfsController } from '../../../src/ipfs/ipfs.controller.js';
import { IPFSService } from '../../../src/ipfs/ipfs.service.js';
import { HttpResponseMapper } from '../../../src/utils/http-resources/http-response.mapper.js';

describe('IpfsController', () => {
    let ipfsController: IpfsController;
    const ipfsServiceMock: MockProxy<IPFSService> = mock<IPFSService>();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [IpfsController],
            providers: [IPFSService, { provide: WINSTON_MODULE_PROVIDER, useValue: jest.fn() }],
        })
            .overrideProvider(IPFSService)
            .useValue(ipfsServiceMock)
            .compile();

        ipfsController = app.get<IpfsController>(IpfsController);
    });

    describe('File', () => {
        it('should successfully upload file', async () => {
            await ipfsController.uploadFile(null);

            expect(ipfsServiceMock.uploadFile).toHaveBeenCalled();
            expect(ipfsServiceMock.uploadFile).toHaveBeenCalledWith(null);
        });

        it('should successfully get file', async () => {
            const hash = '#';
            const data = 'base64#';
            const expectedReturnData = HttpResponseMapper.map({ data });

            ipfsServiceMock.getFile.mockResolvedValue(data);
            const returnData = await ipfsController.getFile({ hash });

            expect(ipfsServiceMock.getFile).toHaveBeenCalled();
            expect(ipfsServiceMock.getFile).toHaveBeenCalledWith(hash);
            expect(returnData).toEqual(expectedReturnData);
        });
    });

    describe('Record', () => {
        const record = { address: '0x' };
        it('should successfully upload JSON record', async () => {
            await ipfsController.uploadRecord(record);

            expect(ipfsServiceMock.uploadRecord).toHaveBeenCalled();
            expect(ipfsServiceMock.uploadRecord).toHaveBeenCalledWith(record);
        });

        it('should successfully get JSON record', async () => {
            const hash = '#';
            const data = JSON.stringify(record) as unknown as RecordResponseDto;
            const expectedReturnData = HttpResponseMapper.map({ data });

            ipfsServiceMock.getRecord.mockResolvedValue(data);
            const returnData = await ipfsController.getRecord({ hash });

            expect(ipfsServiceMock.getRecord).toHaveBeenCalled();
            expect(ipfsServiceMock.getRecord).toHaveBeenCalledWith(hash);
            expect(returnData).toEqual(expectedReturnData);
        });
    });
});
