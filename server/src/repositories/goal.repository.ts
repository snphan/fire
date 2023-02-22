import { dataSource } from "@/databases";
import { CreateGoalDto } from "@/dtos/goal.dto";
import { Goal } from "@/entities/goal.entity";
import { User } from "@/entities/users.entity";
import { HttpException } from "@/exceptions/HttpException";
import { EntityRepository } from "typeorm";

@EntityRepository()
export default class GoalRepository {

  public async goalUpsert(goalData: CreateGoalDto, user: User): Promise<Goal> {
    const { id, ...goalInfo } = goalData;

    if (!id) {
      const goal: Goal = await Goal.create({ ...goalData, user: { id: user.id } }).save();
      return goal;
    } else {
      await Goal.update(id, goalInfo);
      const findGoal: Goal = await Goal.findOne({ where: { id: id } });
      if (!findGoal) throw new HttpException(409, "Goal Does not exist");
      return findGoal;
    }
  }
}