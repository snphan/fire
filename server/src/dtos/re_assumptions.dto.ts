import { IsNumber, IsString } from 'class-validator';
import { Field, Float, InputType } from 'type-graphql';
import { REReceipt } from '@/entities/re_receipt.entity';
import { REAssumptions } from '@/entities/re_assumption.entity';

@InputType()
export class CreateREAssumptionsDto implements Partial<REAssumptions> {
  @IsNumber()
  @Field({ nullable: false })
  reAssetId: number;

  @IsNumber()
  @Field({ nullable: true })
  rent_inc?: number; /* as a percentage */

  @IsNumber()
  @Field({ nullable: true })
  property_inc?: number; /* as a percentage */

  @IsNumber()
  @Field({ nullable: true })
  inflation?: number; /* as a percentage */

  @IsNumber()
  @Field({ nullable: true })
  rent?: number;

  @IsNumber()
  @Field({ nullable: true })
  maintenance_fee?: number;

  @IsNumber()
  @Field({ nullable: true })
  repairs?: number; /* as a percentage */

  @IsNumber()
  @Field({ nullable: true })
  property_tax?: number; /* per year */

  @IsNumber()
  @Field({ nullable: true })
  utilities?: number; /* per month */

  @IsNumber()
  @Field({ nullable: true })
  insurance?: number; /* per month */

  @IsNumber()
  @Field({ nullable: true })
  management_fee?: number; /* per month */

  @IsNumber({}, { each: true })
  @Field((type) => [Float], { nullable: true })
  other_expenses?: number[]; /* per year: like a special levy */

  @IsNumber({}, { each: true })
  @Field((type) => [Float], { nullable: true })
  other_upfront?: number[]; /* one-time costs */

  @IsNumber()
  @Field({ nullable: true })
  closing_cost?: number;

  @IsNumber()
  @Field({ nullable: true })
  down_percent?: number;

  @IsNumber()
  @Field({ nullable: true })
  interest_rate?: number;

  @IsNumber()
  @Field({ nullable: true })
  mortgage_length?: number;

  @IsNumber()
  @Field({ nullable: true })
  hold_length?: number;

  @IsNumber()
  @Field({ nullable: true })
  rennovations?: number;

  @IsNumber()
  @Field({ nullable: true })
  vacancy_months?: number;
}