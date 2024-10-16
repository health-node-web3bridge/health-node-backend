import { ArrayMinSize, IsArray, IsString } from 'class-validator';

export class GetRequestDto {
    @IsString()
    readonly hash: string;
}

export class GetRecordsRequestDto {
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    readonly hashes: string[];
}

export class PostRequestDto {
    @IsString()
    readonly address: string;
}
