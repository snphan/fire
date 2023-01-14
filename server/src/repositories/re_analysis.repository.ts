import { EntityRepository } from 'typeorm';
import { User } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REAsset } from '@/entities/re_asset.entity';
import { CreateREReceiptDto } from '@/dtos/re_receipt.dto';
import { REReceipt } from '@/entities/re_receipt.entity';
import { CreateREAssumptionsDto } from '@/dtos/re_assumptions.dto';
import { REAssumptions } from '@/entities/re_assumption.entity';


@EntityRepository()
export default class REAssetRepository {
  public async REAssetCreate(REAssetData: CreateREAssetDto): Promise<REAsset> {
    const { userId, ...REAssetInfo } = REAssetData;
    const findUser: User = await User.findOne({ where: { id: userId } });
    const createREAssetData: REAsset = await REAsset.create({ user: findUser, ...REAssetInfo }).save();
    // Initialize assumptions with default values
    await this.REAssumptionsCreate({ reAssetId: createREAssetData.id });
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: createREAssetData.id } })
    return findREAsset;
  }

  public async REReceiptCreate(REReceiptData: CreateREReceiptDto): Promise<REReceipt> {
    const { reAssetId, ...REReceiptInfo } = REReceiptData;
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    const createREReceiptData: REReceipt = await REReceipt.create({ re_asset: findREAsset, ...REReceiptInfo }).save();
    return createREReceiptData;
  }

  public async REAssumptionsCreate(REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const { reAssetId, ...REAssumptionsInfo } = REAssumptionsData;
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    if (findREAsset.re_assumptions) throw new HttpException(409, "Assumption already Exists");

    const createREAssumptionsData: REAssumptions = await REAssumptions.create({ re_asset: findREAsset, ...REAssumptionsData }).save();
    return createREAssumptionsData;
  }

  public async REAssumptionsUpdate(assumptionId: number, REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const { reAssetId, ...REAssumptionsInfo } = REAssumptionsData;
    const findREAssumption: REAssumptions = await REAssumptions.findOne({ where: { id: assumptionId } })
    if (!findREAssumption) throw new HttpException(409, "RE Assumption doesn't exist");
    await REAssumptions.update(assumptionId, REAssumptionsInfo);

    const updateREAssumption: REAssumptions = await REAssumptions.findOne({ where: { id: assumptionId } });
    return updateREAssumption;
  }
}