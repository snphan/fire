import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToOne, JoinTable } from 'typeorm';
import { Field, Float, ObjectType } from 'type-graphql';
import { REAsset } from './re_asset.entity';

@ObjectType()
@Entity()
export class REAssumptions extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => REAsset)
  @OneToOne(() => REAsset, re_asset => re_asset.re_assumptions, {
    onDelete: "CASCADE",
  })
  re_asset: REAsset;

  @Field()
  @Column("float", { default: 3 })
  rent_inc: number; /* as a percentage */

  @Field()
  @Column("float", { default: 3 })
  property_inc: number; /* as a percentage */

  @Field()
  @Column("float", { default: 3.8 })
  inflation: number; /* as a percentage */

  @Field()
  @Column("float", { default: 1000 })
  rent: number;

  @Field()
  @Column("float", { default: 500 })
  maintenance_fee: number;

  @Field()
  @Column("float", { default: 1 })
  repairs: number; /* as a percentage */

  @Field()
  @Column("float", { default: 800 })
  property_tax: number; /* per year */

  @Field()
  @Column("float", { default: 300 })
  utilities: number; /* per month */

  @Field()
  @Column("float", { default: 50 })
  insurance: number; /* per month */

  @Field()
  @Column("float", { default: 100 })
  management_fee: number; /* per month */

  @Field((type) => [Float])
  @Column("float", { array: true, default: [] })
  other_expenses: number[]; /* per year: like a special levy */

  @Field()
  @Column("float", { default: 2500 })
  closing_cost: number;

  @Field()
  @Column("float", { default: 20 })
  down_percent: number;

  @Field()
  @Column("float", { default: 5 })
  interest_rate: number;

  @Field()
  @Column("float", { default: 25 })
  mortgage_length: number;

  @Field()
  @Column("int", { default: 10 })
  hold_length: number;
}