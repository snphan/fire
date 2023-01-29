import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, OneToOne, ManyToOne } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { User } from './users.entity';
import { Products } from 'plaid';
import dayjs from 'dayjs';
import { Transaction } from './transactions.entity';
import { InvestmentTransaction } from './investment_transactions.entity';

@ObjectType()
@Entity()
export class PlaidInfo extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => User)
  @ManyToOne((type) => User, user => user.plaidInfoConnection)
  user: Relation<User>;

  @Field()
  @Column({ nullable: true })
  access_token: string;

  @Field()
  @Column({ nullable: true })
  item_id: string;

  @Field((type) => [Products])
  @Column("text", { array: true })
  products: Products[];

  @Field()
  @Column({ default: "" })
  institution_id: string;

  @Field()
  @Column({ default: "" })
  institution_name: string;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true }) // Plaid Spec, setting null starts txn sync from beginning of history.
  txn_cursor: string;

  @Field()
  @Column({ default: dayjs().subtract(2, 'years').format('YYYY-MM-DD') })
  invest_txn_update_date: string

  @OneToMany((type) => Transaction, (transactions) => transactions.plaidInfo, {
    onDelete: "SET NULL"
  })
  transactions: Promise<Relation<Transaction[]>>;

  @OneToMany(
    (type) => InvestmentTransaction,
    (investment_transactions) => investment_transactions.plaidInfo,
    { onDelete: "SET NULL" }
  )
  investment_transactions: Promise<Relation<InvestmentTransaction[]>>;
}
