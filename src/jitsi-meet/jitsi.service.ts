import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { createHash } from 'node:crypto';
import { MeetingRequestDto } from './dto/request.dto.js';
import { MeetingLinkResponseDto, MeetingTokenResponseDto } from './dto/response.dto.js';
import { JitsiUrlGenerator } from './jitsi-url-generator.js';

const ONE_HOUR_IN_SECONDS = 60 * 60 * 60;
const FIVE_MINUTES_IN_SECONDS = 60 * 5;

interface GenerateTokenParams {
    email: string;
    name: string;
    appointmentTime: number;
    roomName: string;
    isModerator?: boolean;
}

@Injectable()
export class JistiService {
    constructor(private readonly configService: ConfigService) {}
    private async generateToken({ name, email, appointmentTime, roomName, isModerator }: GenerateTokenParams) {
        const jitsiPK = this.configService.get('JITSI_PK')?.replace(/\\n/g, '\n');
        const jitsiKID = this.configService.get('JITSI_KEY_ID');
        const jitsiAppID = this.configService.get('JITSI_APP_ID');

        try {
            const avatar = this.getGravatarUrl(email);
            const id = nanoid();
            const jwtToken = jwt.sign(
                {
                    aud: 'jitsi',
                    context: {
                        user: {
                            id,
                            name,
                            avatar,
                            email,
                            moderator: isModerator ? 'true' : 'false',
                        },
                        features: {
                            livestreaming: 'false',
                            'outbound-call': 'false',
                            transcription: 'false',
                            recording: 'false',
                        },
                    },
                    iss: 'chat',
                    sub: jitsiAppID,
                    exp: Math.round(appointmentTime / 1000) + ONE_HOUR_IN_SECONDS, //Meeting valid for One hour
                    nbf: Math.round(appointmentTime / 1000) - FIVE_MINUTES_IN_SECONDS, //Users can join 5 mins before the call
                    room: roomName,
                },
                jitsiPK,
                { header: { alg: 'RS256', kid: jitsiKID, typ: 'JWT' } },
            );
            return jwtToken;
        } catch (error) {
            console.log(error);
        }
    }

    private getGravatarUrl(email: string, size = 80) {
        const trimmedEmail = email.trim().toLowerCase();
        const hash = createHash('sha256').update(trimmedEmail).digest('hex');
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
    }

    public async generateMeetingLink({
        doctorName,
        doctorEmail,
        patientName,
        patientEmail,
        appointmentTime,
    }: MeetingRequestDto): Promise<MeetingLinkResponseDto> {
        const jitsiAppID = this.configService.get('JITSI_APP_ID');
        const roomName = `meetWithDoctor${doctorName}`;

        //Doctor
        const docURLBuilder = new JitsiUrlGenerator('8x8.vc', `${jitsiAppID}/${roomName}`);
        const docToken = await this.generateToken({
            name: doctorName,
            email: doctorEmail,
            appointmentTime,
            roomName,
            isModerator: true,
        });
        const docURLWithToken = docURLBuilder.updateUserInfo(doctorName, doctorEmail).addJwtToken(docToken).getUrl();

        //Patient
        const patientURLBuilder = new JitsiUrlGenerator('8x8.vc', `${jitsiAppID}/${roomName}`);
        const patientToken = await this.generateToken({
            name: patientName,
            email: patientEmail,
            appointmentTime,
            roomName,
        });
        const patientURLWithToken = patientURLBuilder
            .updateUserInfo(patientName, patientEmail)
            .addJwtToken(patientToken)
            .getUrl();

        return { doctorLink: docURLWithToken, patientLink: patientURLWithToken };
    }

    public async generateMeetingToken({
        doctorName,
        doctorEmail,
        patientName,
        patientEmail,
        appointmentTime,
    }: MeetingRequestDto): Promise<MeetingTokenResponseDto> {
        const jitsiAppID = this.configService.get('JITSI_APP_ID');
        const roomName = `meetWithDoctor${doctorName}`;
        const appRoomName = `${jitsiAppID}/${roomName}`;

        //Doctor
        const docToken = await this.generateToken({
            name: doctorName,
            email: doctorEmail,
            appointmentTime,
            roomName,
            isModerator: true,
        });

        //Patient
        const patientToken = await this.generateToken({
            name: patientName,
            email: patientEmail,
            appointmentTime,
            roomName,
        });

        return { appRoomName, doctorToken: docToken, patientToken };
    }
}
