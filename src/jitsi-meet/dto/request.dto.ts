import { IsEmail, IsNumber, IsString, Min } from 'class-validator';

export class MeetingRequestDto {
    @IsString()
    readonly doctorName: string;

    @IsEmail()
    readonly doctorEmail: string;

    @IsString()
    readonly patientName: string;

    @IsEmail()
    readonly patientEmail: string;

    @IsNumber()
    @Min(Date.now())
    readonly appointmentTime: number;
}
