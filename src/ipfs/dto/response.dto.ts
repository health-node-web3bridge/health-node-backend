import { IsString } from 'class-validator';

export class RecordResponseDto {
    @IsString()
    readonly address: string;
}
