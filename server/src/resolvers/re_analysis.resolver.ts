import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
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

  @Authorized()
  @Mutation(() => REAsset, {
    description: 'Create REAsset',
  })
  async upsertREAsset(@Arg('REAssetData') REAssetData: CreateREAssetDto): Promise<REAsset> {
    const reAsset: REAsset = await this.REAssetCreateOrUpdate(REAssetData);
    return reAsset;
  }

  @Authorized()
  @Mutation(() => REAsset, {
    description: 'Delete REAsset'
  })
  async deleteREAsset(@Arg('reAssetId') reAssetId: number): Promise<REAsset> {
    const reAsset: REAsset = await this.REAssetDelete(reAssetId);
    return reAsset;
  }

  @Authorized()
  @Mutation(() => REReceipt, {
    description: 'Create REReceipt',
  })
  async createREReceipt(@Arg('REReceiptData') REReceiptData: CreateREReceiptDto): Promise<REReceipt> {
    const reReceipt: REReceipt = await this.REReceiptCreate(REReceiptData);
    return reReceipt;
  }

  @Authorized()
  @Query(() => REReceipt, {
    description: 'Get REReceipt by id'
  })
  async getREReceiptById(@Arg('reReceiptId') reReceiptId: number): Promise<REReceipt> {
    const reReceipt: REReceipt = await this.REReceiptById(reReceiptId);
    return reReceipt;
  }

  @Authorized()
  @Mutation(() => REAssumptions, {
    description: 'Create REAssumptions',
  })
  async createREAssumptions(@Arg('REAssumptionsData') REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const reAssumptions: REAssumptions = await this.REAssumptionsCreate(REAssumptionsData);
    return reAssumptions;
  }

  @Authorized()
  @Query(() => REAssumptions, {
    description: 'Get REAssumptions by id'
  })
  async getREAssumptionsById(@Arg('reAssumptionsId') reAssumptionsId: number): Promise<REAssumptions> {
    const reAssumptions: REAssumptions = await this.REAssumptionsById(reAssumptionsId);
    return reAssumptions;
  }

  @Authorized()
  @Mutation(() => REAssumptions, {
    description: 'Update REAssumptions'
  })
  async updateREAssumptions(@Arg('assumptionId') assumptionId: number, @Arg('REAssumptionsData') REAssumptionsData: CreateREAssumptionsDto): Promise<REAssumptions> {
    const reAssumptions: REAssumptions = await this.REAssumptionsUpdate(assumptionId, REAssumptionsData);
    return reAssumptions;
  }

}