import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';
import REAssetRepository from '@/repositories/re_analysis.repository';
import { REAsset } from '@/entities/re_asset.entity';
import { CreateREAssetDto } from '@/dtos/re_asset.dto';
import { REReceipt } from '@/entities/re_receipt.entity';
import { CreateREReceiptDto } from '@/dtos/re_receipt.dto';
import { CreateREAssumptionsDto } from '@/dtos/re_assumptions.dto';
import { REAssumptions } from '@/entities/re_assumption.entity';

@Resolver()
export class REAssetResolver extends REAssetRepository {
  @Mutation(() => REAsset, {
    description: 'Create REAsset',
  })
  async createREAsset(@Arg('REAssetData') REAssetData: CreateREAssetDto): Promise<REAsset> {
    const reAsset: REAsset = await this.REAssetCreate(REAssetData);
    return reAsset;
  }

  @Mutation(() => REReceipt, {
    description: 'Create REReceipt',
  })
  async createREReceipt(@Arg('REReceiptData') REReceiptData: CreateREReceiptDto): Promise<REReceipt> {
    const reReceipt: REReceipt = await this.REReceiptCreate(REReceiptData);
    return reReceipt;
  }

  @Mutation(() => REAssumptions, {
    description: 'Create REAssumptions',
  })
  async createREAssumptions(@Arg('REAssumptionsData') REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const reAssumptions: REAssumptions = await this.REAssumptionsCreate(REAssumptionsData);
    return reAssumptions;
  }

  @Mutation(() => REAssumptions, {
    description: 'Update REAssumptions'
  })
  async updateREAssumptions(@Arg('assumptionId') assumptionId: number, @Arg('REAssumptionsData') REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const reAssumptions: REAssumptions = await this.REAssumptionsUpdate(assumptionId, REAssumptionsData);
    return reAssumptions;
  }
}