import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { User } from "./users.entity";

@Entity()
@ObjectType()
export class Goal extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.goalConnection,
    { onDelete: "CASCADE" }
  )
  user: Relation<User>;

  @Field((type) => [String])
  @Column("text", { array: true, default: [] })
  track_accounts: string[];

  @Field()
  @CreateDateColumn()
  createAt: Date;

  @Field()
  @Column({ default: new Date() })
  due_date: Date;

  @Field()
  @Column({ default: 1 })
  goal_amount: number;

  @Field()
  @Column({ default: '' })
  name: string;

  @Field()
  @Column({ default: 0 })
  start_save_from: number;
}