import { InvestmentTransaction } from "@/entities/investment_transactions.entity";
import { Transaction } from "@/entities/transactions.entity";
import { User } from "@/entities/users.entity";
import { HttpException } from "@/exceptions/HttpException";
import TransactionRepository from "@/repositories/transactions.repository";
import dayjs from "dayjs";
import { Products } from "plaid";
import { Arg, Authorized, Ctx, Int, Query, Resolver } from "type-graphql";



@Resolver()
export class TransactionResolver extends TransactionRepository {

  @Authorized()
  @Query(() => [Transaction], {
    description: 'Get the transactions from the specified Plaid Item'
  })
  async getTxnByPlaidInfoId(@Arg('plaidInfoId') plaidInfoId: number): Promise<Transaction[]> {
    if (!plaidInfoId) throw new HttpException(400, 'plaidInfoId cannot be empty');
    return this.txnFindByPlaidInfoId(plaidInfoId);
  }

  @Authorized()
  @Query(() => [Transaction], {
    description: 'Get the transactions from the specified Plaid Item. Allows user to specify a date range'
  })
  async getTransactions(
    @Ctx('user') user: User,
    @Arg('startDate', { nullable: true }) startDate: string,
    @Arg('endDate', { nullable: true }) endDate: string): Promise<Transaction[]> {

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    try {
      parsedStartDate = startDate && new Date(startDate);
      parsedEndDate = endDate && new Date(endDate);
    } catch (err) {
      throw new HttpException(400, 'Wrong input for start or end date');
    }

    const plaidInfos = await user.plaidInfoConnection;
    if (!plaidInfos.length) throw new HttpException(409, "User has not connected to an Account through Plaid");
    if ((parsedStartDate && parsedEndDate) && (parsedEndDate < parsedStartDate)) throw new HttpException(400, "End date cannot be less than start date");

    const plaidInfoIds = plaidInfos.filter((item) => (item.products).includes(Products.Transactions)).map((item) => item.id);
    const transactions = await this.txnFindByPlaidInfoIdsBetween(
      plaidInfoIds,
      parsedStartDate ? parsedStartDate : new Date(0),
      parsedEndDate ? parsedEndDate : new Date(dayjs().add(1, 'year').format('YYYY-MM-DD'))
    );
    return transactions;
  }

  @Authorized()
  @Query(() => [InvestmentTransaction], {
    description: 'Get the investment transactions from the specified Plaid Item'
  })
  async getInvestTxnByPlaidInfoId(@Arg('plaidInfoId') plaidInfoId: number): Promise<InvestmentTransaction[]> {
    if (!plaidInfoId) throw new HttpException(400, 'plaidInfoId cannot be empty');
    return this.investTxnFindByPlaidInfoId(plaidInfoId);
  }


  @Authorized()
  @Query(() => [InvestmentTransaction], {
    description: 'Get the transactions from the specified Plaid Item. Allows user to specify a date range'
  })
  async getInvestTransactions(
    @Ctx('user') user: User,
    @Arg('startDate', { nullable: true }) startDate: string,
    @Arg('endDate', { nullable: true }) endDate: string): Promise<InvestmentTransaction[]> {

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;
    try {
      parsedStartDate = startDate && new Date(startDate);
      parsedEndDate = endDate && new Date(endDate);
    } catch (err) {
      throw new HttpException(400, 'Wrong input for start or end date');
    }
    console.log(parsedStartDate);

    const plaidInfos = await user.plaidInfoConnection;
    if (!plaidInfos.length) throw new HttpException(409, "User has not connected to an Account through Plaid");
    if ((parsedStartDate && parsedEndDate) && (parsedEndDate < parsedStartDate)) throw new HttpException(400, "End date cannot be less than start date");

    const plaidInfoIds = plaidInfos.filter((item) => (item.products).includes(Products.Investments)).map((item) => item.id);
    const investmentTransactions = await this.investTxnFindByPlaidInfoIdsBetween(
      plaidInfoIds,
      parsedStartDate ? parsedStartDate : new Date(0),
      parsedEndDate ? parsedEndDate : new Date(dayjs().add(1, 'year').format('YYYY-MM-DD'))
    );
    return investmentTransactions;
  }
}