import { DB_ENCRYPTION_KEY } from "@/config";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { EncryptionTransformer } from "typeorm-encrypted";
import { PlaidInfo } from "./plaid_info.entity";

@Entity()
@ObjectType()
export class InvestmentTransaction extends BaseEntity {
  @Field()
  @PrimaryColumn({ unique: true })
  investment_transaction_id: string;

  @ManyToOne((type) => PlaidInfo, plaidInfo => plaidInfo.investment_transactions,
    { onDelete: "CASCADE" }
  )
  plaidInfo: Relation<PlaidInfo>;

  @Field()
  @Column()
  date: Date;

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  type: string;

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  name: string;

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  iso_currency: string;

  @Field()
  @Column({
    type: "varchar",
    nullable: false,
    transformer: new EncryptionTransformer({
      key: DB_ENCRYPTION_KEY,
      algorithm: 'aes-256-gcm',
      ivLength: 16
    })
  })
  amount: string;
}