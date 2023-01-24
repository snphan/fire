import { PlaidInfo } from "@/entities/plaid_info.entity";
import { User } from "@/entities/users.entity";
import { EntityRepository } from "typeorm";

@EntityRepository()
export default class PlaidRepository {

  public async getPlaidInfoByUser(user: User) {
    return await PlaidInfo.find({ where: { user: user } })
  }
}