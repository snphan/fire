import { IsEmail, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { User } from '@entities/users.entity';
import { REAsset } from '@entities/re_asset.entity';

@InputType()
export class CreateREAssetDto implements Partial<REAsset> {
  @Field()
  userId: number; /* Send the userId in the request and repository will look for user and save object */

  @Field()
  purchase_price: number;

  @Field()
  address: string;

  @Field()
  postal_code: string

  @Field()
  city: string;

  @Field()
  province: string

  @Field()
  country: string

  @Field((type) => [String])
  picture_links: string[];

  @Field()
  bedrooms: number

  @Field()
  bathrooms: number

  @Field()
  purchase_date: Date

  @Field()
  favorite: boolean

  @Field()
  tracking: boolean
}
