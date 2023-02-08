import { IsEmail, IsString, IsNumber, IsDate, IsBoolean } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '@entities/users.entity';
import { REAsset } from '@entities/re_asset.entity';

@InputType()
export class CreateREAssetDto implements Partial<REAsset> {
  @IsNumber()
  @Field()
  userId: number; /* Send the userId in the request and repository will look for user and save object */

  @IsNumber()
  @Field()
  purchase_price: number;

  @IsString()
  @Field()
  address: string;

  @IsString()
  @Field()
  postal_code: string

  @IsString()
  @Field()
  city: string;

  @IsString()
  @Field()
  province: string

  @IsString()
  @Field()
  country: string

  @IsString({ each: true })
  @Field((type) => [String])
  picture_links: string[];

  @IsNumber()
  @Field()
  bedrooms: number

  @IsNumber()
  @Field()
  bathrooms: number

  @IsDate()
  @Field()
  purchase_date: Date

  @IsBoolean()
  @Field()
  favorite: boolean

  @IsBoolean()
  @Field()
  tracking: boolean
}
