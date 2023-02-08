import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, OneToOne, ManyToOne } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { User } from './users.entity';
import { Products } from 'plaid';
import dayjs from 'dayjs';
import { Transaction } from './transactions.entity';
import { InvestmentTransaction } from './investment_transactions.entity';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { DB_ENCRYPTION_KEY } from '@/config';

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
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16,
    }),
    default: ""
  })
  access_token: string;

  @Field()
  @Column({ nullable: true })
  item_id: string;

  @Field((type) => [Products])
  @Column("text", { array: true, default: [] })
  products: Products[];

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16,
    }),
    default: ""
  })
  institution_id: string;

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16,
    }),
    default: ""
  })
  institution_name: string;

  @Field({ nullable: true })
  @Column({ default: null, nullable: true }) // Plaid Spec, setting null starts txn sync from beginning of history.
  txn_cursor: string;

  @Field()
  @Column({ default: dayjs().subtract(2, 'years').format('YYYY-MM-DD') })
  invest_txn_update_date: string

  @OneToMany((type) => Transaction, (transactions) => transactions.plaidInfo, {
    onDelete: "SET NULL",
    cascade: true
  })
  transactions: Promise<Relation<Transaction[]>>;

  @OneToMany(
    (type) => InvestmentTransaction,
    (investment_transactions) => investment_transactions.plaidInfo,
    {
      onDelete: "SET NULL",
      cascade: true
    }
  )
  investment_transactions: Promise<Relation<InvestmentTransaction[]>>;
}
