import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, OneToOne, ManyToOne } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { User } from './users.entity';
import { Products } from 'plaid';

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
}