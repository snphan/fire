import { CreateGoalDto } from "@/dtos/goal.dto";
import { Goal } from "@/entities/goal.entity";
import { User } from "@/entities/users.entity";
import GoalRepository from "@/repositories/goal.repository";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class GoalResolver extends GoalRepository {

  @Authorized()
  @Mutation(() => Goal, {
    description: 'Create/Update Goal'
  })
  async upsertGoal(@Arg('goalData') goalData: CreateGoalDto, @Ctx('user') user: User): Promise<Goal> {
    const goal: Goal = await this.goalUpsert(goalData, user);
    return goal;
  }

  @Authorized()
  @Mutation(() => Goal, {
    description: 'Delete a goal by its id'
  })
  async deleteGoal(@Arg('goalId') goalId: number) {
    const goal: Goal = await this.goalDelete(goalId);
    return goal;
  }

  @Authorized()
  @Query(() => [Goal], {
    description: 'Get all of the goals by user'
  })
  async getGoals(@Ctx('user') user: User) {
    const goal: Goal[] = await Goal.find({ where: { user: { id: user.id } } });
    console.log(goal);
    return goal;
  }
}