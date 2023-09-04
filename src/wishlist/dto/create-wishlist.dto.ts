// create-wishlist.dto.ts

import { IsString } from 'class-validator';

export class CreateWishlistDto {
    @IsString()
    fullPairName: string;

    @IsString()
    pairId: string;
}
