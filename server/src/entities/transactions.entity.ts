import { PersonalFinanceCategory } from "plaid";
import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, ColumnTypeUndefinedError, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation } from "typeorm";
import { PlaidInfo } from "./plaid_info.entity";
import { EncryptionTransformer } from "typeorm-encrypted";
import { DB_ENCRYPTION_KEY } from "@/config";

@Entity()
@ObjectType()
export class Transaction extends BaseEntity {
  @Field()
  @PrimaryColumn({ unique: true })
  transaction_id: string;

  @ManyToOne((type) => PlaidInfo, (plaidInfo) => plaidInfo.transactions)
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
  category: string;

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
  amount: string; // We can only encrypt strings
}