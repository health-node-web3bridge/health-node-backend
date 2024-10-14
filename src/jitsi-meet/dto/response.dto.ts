import { IsString } from 'class-validator';

export class MeetingLinkResponseDto {
    @IsString()
    readonly doctorLink: string;

    @IsString()
    readonly patientLink: string;
}

export class MeetingTokenResponseDto {
    @IsString()
    readonly appRoomName: string;

    @IsString()
    readonly doctorToken: string;

    @IsString()
    readonly patientToken: string;
}
