import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { REReceipt } from './re_receipt.entity';

@ObjectType()
@Entity()
export class REAsset extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => REReceipt, re_receipt => re_receipt.re_asset, {
    onDelete: "SET NULL"
  })
  re_receipts: REReceipt[];
}