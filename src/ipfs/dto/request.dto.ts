import { IsString } from 'class-validator';

export class GetRequestDto {
    @IsString()
    readonly hash: string;
}

export class PostRequestDto {
    @IsString()
    readonly address: string;
}
