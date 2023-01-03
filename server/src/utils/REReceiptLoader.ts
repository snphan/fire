import DataLoader from "dataloader";
import { REReceipt } from "@/entities/re_receipt.entity";
import { In } from "typeorm";


const batchREReceipt = async (reAssetIds: number[]) => {
  const findREReceipt = await REReceipt.find({
    where: {
      re_asset: In(reAssetIds)
    }
  })

  return [findREReceipt];
}


export const createREReceiptLoader = () => new DataLoader(batchREReceipt);