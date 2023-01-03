import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { REReceipt } from '@/entities/re_receipt.entity';

@InputType()
export class CreateREReceiptDto implements Partial<REReceipt> {
  @Field()
  reAssetId: number;

  @Field()
  timestamp: number;

  @Field()
  @IsString()
  type: string;

  @Field(type => [String])
  receipt_link: string[];

  @Field()
  notes: string;
}
