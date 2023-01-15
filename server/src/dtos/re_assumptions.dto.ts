import { IsString } from 'class-validator';
import { Field, Float, InputType } from 'type-graphql';
import { REReceipt } from '@/entities/re_receipt.entity';
import { REAssumptions } from '@/entities/re_assumption.entity';

@InputType()
export class CreateREAssumptionsDto implements Partial<REAssumptions> {
  @Field({ nullable: false })
  reAssetId: number;

  @Field({ nullable: true })
  rent_inc?: number; /* as a percentage */

  @Field({ nullable: true })
  property_inc?: number; /* as a percentage */

  @Field({ nullable: true })
  inflation?: number; /* as a percentage */

  @Field({ nullable: true })
  rent?: number;

  @Field({ nullable: true })
  maintenance_fee?: number;

  @Field({ nullable: true })
  repairs?: number; /* as a percentage */

  @Field({ nullable: true })
  property_tax?: number; /* per year */

  @Field({ nullable: true })
  utilities?: number; /* per month */

  @Field({ nullable: true })
  insurance?: number; /* per month */

  @Field({ nullable: true })
  management_fee?: number; /* per month */

  @Field((type) => [Float], { nullable: true })
  other_expenses?: number[]; /* per year: like a special levy */

  @Field({ nullable: true })
  closing_cost?: number;

  @Field({ nullable: true })
  down_percent?: number;

  @Field({ nullable: true })
  interest_rate?: number;

  @Field({ nullable: true })
  mortgage_length?: number;

  @Field({ nullable: true })
  hold_length?: number;
}