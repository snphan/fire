import { CreateGoalDto } from "@/dtos/goal.dto";
import { Goal } from "@/entities/goal.entity";
import { User } from "@/entities/users.entity";
import GoalRepository from "@/repositories/goal.repository";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class GoalResolver extends GoalRepository {

  @Authorized()
  @Mutation(() => Goal, {
    description: 'Create/Update Goal'
  })
  async upsertGoal(@Arg('goalData') goalData: CreateGoalDto, @Ctx('user') user: User): Promise<Goal> {
    console.log(goalData);
    const goal: Goal = await this.goalUpsert(goalData, user);
    return goal;
  }
}