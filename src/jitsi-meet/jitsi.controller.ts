import { Body, Controller, HttpCode, HttpStatus, Post, UseFilters } from '@nestjs/common';
import { ErrorExceptionFilter } from '../utils/exception-handler/error-exception.filter.js';
import { HttpResponse } from '../utils/http-resources/http-response.js';
import { HttpResponseMapper } from '../utils/http-resources/http-response.mapper.js';
import { MeetingRequestDto } from './dto/request.dto.js';
import { MeetingLinkResponseDto, MeetingTokenResponseDto } from './dto/response.dto.js';
import { JistiService } from './jitsi.service.js';

@UseFilters(ErrorExceptionFilter)
@Controller()
export class JitsiController {
    constructor(private readonly jistiService: JistiService) {}

    @Post('/meeting-link')
    @HttpCode(HttpStatus.OK)
    async getRecord(
        @Body() meetingLinkRequestDto: MeetingRequestDto,
    ): Promise<HttpResponse<{ data: MeetingLinkResponseDto }>> {
        const data = await this.jistiService.generateMeetingLink(meetingLinkRequestDto);
        return HttpResponseMapper.map({ data });
    }

    @Post('/meeting-token')
    @HttpCode(HttpStatus.OK)
    async getMeetingToken(
        @Body() meetingLinkRequestDto: MeetingRequestDto,
    ): Promise<HttpResponse<{ data: MeetingTokenResponseDto }>> {
        const data = await this.jistiService.generateMeetingToken(meetingLinkRequestDto);
        return HttpResponseMapper.map({ data });
    }
}
