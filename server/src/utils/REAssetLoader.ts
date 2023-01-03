import DataLoader from "dataloader";
import { REAsset } from "@/entities/re_asset.entity";
import { In } from "typeorm";


const batchREAsset = async (userIds: number[]) => {
  const findREAsset = await REAsset.find({
    where: {
      user: In(userIds)
    }
  })

  return [findREAsset];
}


export const createREAssetLoader = () => new DataLoader(batchREAsset);