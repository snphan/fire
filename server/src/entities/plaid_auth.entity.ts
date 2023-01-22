import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, OneToOne } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { User } from './users.entity';

@ObjectType()
@Entity()
export class PlaidInfo extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => User)
  @OneToOne((type) => User, user => user.plaidinfo)
  user: Relation<User>;

  @Field()
  @Column({ nullable: true })
  access_token: string;

  @Field()
  @Column()
  item_id: string;
}