import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { PlaidInfo } from "./plaid_info.entity";

@Entity()
@ObjectType()
export class InvestmentTransaction extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => PlaidInfo, plaidInfo => plaidInfo.investment_transactions)
  plaidInfo: Relation<PlaidInfo>;

  @Field()
  @Column()
  investment_transaction_id: string;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  iso_currency: string;

  @Field()
  @Column()
  amount: number;
}