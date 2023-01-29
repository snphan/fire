import { PersonalFinanceCategory } from "plaid";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, ColumnTypeUndefinedError, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { PlaidInfo } from "./plaid_info.entity";

@Entity()
@ObjectType()
export class Transaction extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => PlaidInfo, (plaidInfo) => plaidInfo.transactions)
  plaidInfo: Relation<PlaidInfo>;

  @Field()
  @Column()
  transaction_id: string;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column()
  category: string;

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