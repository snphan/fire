import { Goal } from "@/entities/goal.entity";
import { IsDate, IsNumber, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateGoalDto implements Partial<Goal> {
  @IsNumber()
  @Field({ nullable: true })
  id?: number;

  @IsString({ each: true })
  @Field((type) => [String])
  track_accounts: string[];

  @IsDate()
  @Field()
  due_date: Date;

  @IsNumber()
  @Field()
  goal_amount: number;
}