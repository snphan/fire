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

  /* REAssets */

  public async REAssetCreate(REAssetData: CreateREAssetDto): Promise<REAsset> {
    const { userId, ...REAssetInfo } = REAssetData;
    const findUser: User = await User.findOne({ where: { id: userId } });
    const createREAssetData: REAsset = await REAsset.create({ user: findUser, ...REAssetInfo }).save();
    /* Initialize assumptions with default values */
    await this.REAssumptionsCreate({ reAssetId: createREAssetData.id });
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: createREAssetData.id } })
    return findREAsset;
  }

  public async REAssetDelete(reAssetId: number): Promise<REAsset> {
    const findAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    if (!findAsset) throw new HttpException(409, "RE Asset doesn't exist");

    await REAsset.delete({ id: reAssetId });

    /* 
      Manually delete the assumption because the onDelete constraint is SET NULL and we don't
      want deleting assumption to delete the asset. 
    */
    await REAssumptions.delete({ id: findAsset.re_assumptions.id })

    return findAsset;
  }

  /* REReceipts */

  public async REReceiptCreate(REReceiptData: CreateREReceiptDto): Promise<REReceipt> {
    const { reAssetId, ...REReceiptInfo } = REReceiptData;
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    const createREReceiptData: REReceipt = await REReceipt.create({ re_asset: findREAsset, ...REReceiptInfo }).save();
    return createREReceiptData;
  }

  public async REReceiptById(reReceiptId: number): Promise<REReceipt> {
    const findREReceipt: REReceipt = await REReceipt.findOne({ where: { id: reReceiptId } });
    if (!findREReceipt) throw new HttpException(409, "RE Receipt doesn't exist");
    return findREReceipt;
  }

  /* REAssumptions */

  public async REAssumptionsCreate(REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const { reAssetId, ...REAssumptionsInfo } = REAssumptionsData;
    const findREAsset: REAsset = await REAsset.findOne({ where: { id: reAssetId } });
    if (findREAsset.re_assumptions) throw new HttpException(409, "Assumption already Exists");

    const createREAssumptionsData: REAssumptions = await REAssumptions.create({ re_asset: findREAsset, ...REAssumptionsData }).save();
    return createREAssumptionsData;
  }

  public async REAssumptionsById(reAssumptionsId: number): Promise<REAssumptions> {
    const findREAssumptions: REAssumptions = await REAssumptions.findOne({ where: { id: reAssumptionsId } });
    if (!findREAssumptions) throw new HttpException(409, "RE Assumption doesn't exist");
    return findREAssumptions;
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