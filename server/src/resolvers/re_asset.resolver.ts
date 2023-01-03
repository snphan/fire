import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';
import REAssetRepository from '@/repositories/re_asset.repository';
import { REAsset } from '@/entities/re_asset.entity';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';

@Resolver()
export class REAssetResolver extends REAssetRepository {
  @Mutation(() => REAsset, {
    description: 'Create REAsset',
  })
  async createREAsset(@Arg('REAssetData') REAssetData: CreateREAssetDto): Promise<REAsset> {
    const reAsset: REAsset = await this.REAssetCreate(REAssetData);
    return reAsset;
  }
}