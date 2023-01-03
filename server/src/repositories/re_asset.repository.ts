import { EntityRepository } from 'typeorm';
import { User } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REAsset } from '@/entities/re_asset.entity';


@EntityRepository()
export default class REAssetRepository {
  public async REAssetCreate(REAssetData: CreateREAssetDto): Promise<REAsset> {
    const { userId, ...REAssetInfo } = REAssetData;

    const findUser: User = await User.findOne({ where: { id: userId } });

    const createREAssetData: REAsset = await REAsset.create({ user: findUser, ...REAssetInfo }).save();

    return createREAssetData;
  }
}