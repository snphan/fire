import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { REAsset } from './re_asset.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Field()
  @Column()
  @IsNotEmpty()
  last_name: string;

  @Field()
  @Column()
  @IsNotEmpty()
  first_name: string;

  @Field()
  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => REAsset, re_asset => re_asset.user, {
    onDelete: "CASCADE" /* Delete all user data */
  })
  re_asset: REAsset;
}
