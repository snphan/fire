import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, PrimaryColumnCannotBeNullableError } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { REReceipt } from './re_receipt.entity';
import { User } from './users.entity';

@ObjectType()
@Entity()
export class REAsset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => [REReceipt])
  @OneToMany((type) => REReceipt, re_receipt => re_receipt.re_asset, {
    onDelete: "SET NULL"
  })
  re_receipts: REReceipt[];

  @Field((type) => User)
  @ManyToOne((type) => User, user => user.reAssetConnection, {
    onDelete: "SET NULL"
  })
  user: User;

  @Field()
  @Column()
  purchase_price: number

  @Field()
  @Column()
  address: string

  @Field()
  @Column()
  postal_code: string

  @Field()
  @Column()
  city: string

  @Field()
  @Column()
  province: string

  @Field()
  @Column()
  country: string

  @Field(type => [String])
  @Column("text", { array: true })
  picture_links: string[]

  @Field()
  @Column()
  purchase_date: Date

  @Field()
  @Column()
  hold_length: number

  @Field()
  @Column()
  favorite: boolean

  @Field()
  @Column()
  tracking: boolean /* When the asset is purchased, it is moved to the tracking page */
}