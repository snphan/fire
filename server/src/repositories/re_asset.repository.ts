import { EntityRepository } from 'typeorm';
import { User } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REAsset } from '@/entities/re_asset.entity';
import { CreateREReceiptDto } from '@/dtos/re_receipt.dto';
import { REReceipt } from '@/entities/re_receipt.entity';


@EntityRepository()
export default class REAssetRepository {
  public async REAssetCreate(REAssetData: CreateREAssetDto): Promise<REAsset> {
    const { userId, ...REAssetInfo } = REAssetData;
    const findUser: User = await User.findOne({ where: { id: userId } });
    const createREAssetData: REAsset = await REAsset.create({ user: findUser, ...REAssetInfo }).save();
    return createREAssetData;
  }

  public async REReceiptCreate(REReceiptData: CreateREReceiptDto): Promise<REReceipt> {
    const { reAssetId, ...REReceiptInfo } = REReceiptData;
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    const createREReceiptData: REReceipt = await REReceipt.create({ re_asset: findREAsset, ...REReceiptInfo }).save();
    return createREReceiptData;
  }
}