import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import { IpfsController } from '../../../src/ipfs/ipfs.controller.js';
import { IPFSService } from '../../../src/ipfs/ipfs.service.js';

describe('IpfsController', () => {
    let ipfsController: IpfsController;
    const ipfsServiceMock: MockProxy<IPFSService> = mock<IPFSService>();

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [IpfsController],
            providers: [IPFSService],
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
            const expectedReturnData = 'base64#';

            ipfsServiceMock.getFile.mockResolvedValue(expectedReturnData);
            const returnData = await ipfsController.getFile(hash);

            expect(ipfsServiceMock.getFile).toHaveBeenCalled();
            expect(ipfsServiceMock.getFile).toHaveBeenCalledWith(hash);
            expect(returnData).toEqual(expectedReturnData);
        });
    });

    describe('Record', () => {
        const record = { test: 'test' };
        it('should successfully upload JSON record', async () => {
            await ipfsController.uploadRecord(record);

            expect(ipfsServiceMock.uploadRecord).toHaveBeenCalled();
            expect(ipfsServiceMock.uploadRecord).toHaveBeenCalledWith(record);
        });

        it('should successfully get JSON record', async () => {
            const hash = '#';
            const expectedReturnData = JSON.stringify(record) as unknown as JSON;

            ipfsServiceMock.getRecord.mockResolvedValue(expectedReturnData);
            const returnData = await ipfsController.getRecord(hash);

            expect(ipfsServiceMock.getRecord).toHaveBeenCalled();
            expect(ipfsServiceMock.getRecord).toHaveBeenCalledWith(hash);
            expect(returnData).toEqual(expectedReturnData);
        });
    });
});
