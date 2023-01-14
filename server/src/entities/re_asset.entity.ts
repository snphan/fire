import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, PrimaryColumnCannotBeNullableError, OneToOne, JoinColumn } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { REReceipt } from './re_receipt.entity';
import { User } from './users.entity';
import { REAssumptions } from './re_assumption.entity';

@ObjectType()
@Entity()
export class REAsset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => REReceipt, re_receipt => re_receipt.re_asset, {
    onDelete: "SET NULL"
  })
  reReceiptConnection: REReceipt[];

  @Field((type) => [REReceipt])
  async re_receipt(@Ctx() { REReceiptLoader }): Promise<REReceipt[]> {
    return REReceiptLoader.load(this.id);
  }

  @Field((type) => User)
  @ManyToOne((type) => User, user => user.reAssetConnection, {
    onDelete: "SET NULL",
    eager: true
  })
  user: User;

  @OneToOne((type) => REAssumptions, {
    onDelete: "CASCADE",
    eager: true,
    nullable: true
  })
  @JoinColumn()
  @Field((type) => REAssumptions, {
    nullable: true
  })
  re_assumptions: REAssumptions;

  @Field()
  @Column()
  purchase_price: number;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  postal_code: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  province: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column({ default: 1 })
  bedrooms: number;

  @Field()
  @Column({ default: 1 })
  bathrooms: number;

  @Field(type => [String])
  @Column("text", { array: true })
  picture_links: string[];

  @Field()
  @Column()
  purchase_date: Date;

  @Field()
  @Column()
  hold_length: number;

  @Field()
  @Column()
  favorite: boolean;

  @Field()
  @Column()
  tracking: boolean; /* When the asset is purchased, it is moved to the tracking page */
}