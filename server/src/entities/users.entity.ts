import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, Relation, OneToOne, JoinColumn } from 'typeorm';
import { Ctx, Field, ObjectType } from 'type-graphql';
import { REAsset } from './re_asset.entity';
import { PlaidInfo } from './plaid_info.entity';

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
    onDelete: "CASCADE", /* Delete all user data */
    cascade: true
  })
  reAssetConnection: Promise<Relation<REAsset[]>>;

  @Field((type) => [REAsset], { nullable: true })
  async re_asset(@Ctx() { REAssetLoader }): Promise<REAsset[]> {
    return REAssetLoader.load(this.id);
  }

  // No Field() because we don't want to send access_token
  // to the client
  @OneToOne((type) => PlaidInfo, {
    nullable: true,
    onDelete: "SET NULL",
    eager: true
  })
  @JoinColumn()
  plaidinfo: Relation<PlaidInfo>
}
