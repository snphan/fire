import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Relation } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { REAsset } from './re_asset.entity';

@ObjectType()
@Entity()
export class REReceipt extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => REAsset)
  @ManyToOne((type) => REAsset, re_asset => re_asset.reReceiptConnection, {
    onDelete: "SET NULL",
    eager: true /* Allows us to get the parent (FK referenced) */
  })
  re_asset: Relation<REAsset>;

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