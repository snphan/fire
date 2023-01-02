import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { REAsset } from './re_asset.entity';

@ObjectType()
@Entity()
export class REReceipt extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => REAsset, re_asset => re_asset.re_receipts, {
    onDelete: "SET NULL"
  })
  re_asset: REAsset;

  @Field()
  @Column()
  @IsNotEmpty()
  timestamp: number; /* Unix Time */

  @Field({ nullable: false })
  @Column({ nullable: false, default: "gas" })
  @IsNotEmpty()
  type: string;

  @Field(type => [String])
  @Column("text", { array: true })
  receipt_link: string[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  notes?: string;
}