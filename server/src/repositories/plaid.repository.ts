import { SECRET_KEY } from "@/config";
import { PlaidInfo } from "@/entities/plaid_info.entity";
import { User } from "@/entities/users.entity";
import { HttpException } from "@/exceptions/HttpException";
import { Transaction as PlaidTransaction, InvestmentTransaction as PlaidInvestmentTransaction, PlaidApi, Products } from "plaid";
import { Ctx } from "type-graphql";
import { EntityRepository } from "typeorm";
import CryptoJS from 'crypto-js';
import dayjs from "dayjs";
import { Transaction } from "@/entities/transactions.entity";
import { InvestmentTransaction } from "@/entities/investment_transactions.entity";

@EntityRepository()
export default class PlaidRepository {

  public decryptAccessToken(encryptedAccessToken: string): string {
    const decryptedAccessToken = CryptoJS.AES.decrypt(encryptedAccessToken, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decryptedAccessToken;
  }

  public async getPlaidInfoByUser(user: User) {
    return await PlaidInfo.find({ where: { user: { id: user.id } } })
  }

  private plaidTransactionToEntity(plaidInfo: PlaidInfo, plaidTransaction: PlaidTransaction): Transaction {
    return Transaction.create({
      plaidInfo: plaidInfo,
      transaction_id: plaidTransaction.transaction_id,
      date: new Date(plaidTransaction.date),
      category: plaidTransaction.personal_finance_category.primary,
      name: plaidTransaction.name,
      iso_currency: plaidTransaction.iso_currency_code,
      amount: plaidTransaction.amount
    })
  }

  private plaidInvestTransactionToEntity(plaidInfo: PlaidInfo, plaidInvestTransaction: PlaidInvestmentTransaction): InvestmentTransaction {
    return InvestmentTransaction.create({
      plaidInfo: plaidInfo,
      investment_transaction_id: plaidInvestTransaction.transaction_id,
      date: new Date(plaidInvestTransaction.date),
      type: plaidInvestTransaction.type,
      name: plaidInvestTransaction.name,
      iso_currency: plaidInvestTransaction.iso_currency_code,
      amount: plaidInvestTransaction.amount
    })
  }

  /**
   * Sync the txns with plaid for the input user
   * @param user 
   * @param plaidClient 
   */
  public async syncTransactions(user: User, plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) throw new HttpException(409, "User has not connected to an Account through Plaid");

    const syncedTransactions = {};  // Store updates in memory until written to DB. 
    const newCursors = {};          // Update the cursors after txns have been updated (if crash, we can redo the sync)
    const newInvestUpdateDates = {};// Update the investment sync dates

    // Fetch the new transactions.
    for (const plaidInfo of findPlaidInfo) {
      syncedTransactions[plaidInfo.institution_name] = {};
      if (plaidInfo.products.includes(Products.Transactions)) {
        let cursor = plaidInfo.txn_cursor;
        let added = [];       // New added txns
        let modified = [];    // Txns that were modified
        let removed = [];     // Txns that were removed
        let hasMore = true;
        while (hasMore) {
          const request = {
            access_token: this.decryptAccessToken(plaidInfo.access_token),
            cursor: cursor,
            options: {
              include_personal_finance_category: true
            }
          };
          const response = await plaidClient.transactionsSync(request);
          const data = response.data;
          added = added.concat(data.added);
          modified = modified.concat(data.modified);
          removed = removed.concat(data.removed);
          hasMore = data.has_more;
          cursor = data.next_cursor;
        }
        newCursors[plaidInfo.institution_name] = cursor;
        syncedTransactions[plaidInfo.institution_name]["added"] = added.map((txn) => this.plaidTransactionToEntity(plaidInfo, txn))
        syncedTransactions[plaidInfo.institution_name]["modified"] = modified.map((txn) => this.plaidTransactionToEntity(plaidInfo, txn));
        syncedTransactions[plaidInfo.institution_name]["removed"] = removed.map((txn) => this.plaidTransactionToEntity(plaidInfo, txn));
      }

      if (plaidInfo.products.includes(Products.Investments)) {
        const startDate = plaidInfo.invest_txn_update_date;
        const today = dayjs().format('YYYY-MM-DD');
        const configs = {
          access_token: this.decryptAccessToken(plaidInfo.access_token),
          start_date: startDate,
          end_date: today,
        };

        const response = await plaidClient.investmentsTransactionsGet(configs);
        const data = response.data;
        syncedTransactions[plaidInfo.institution_name]["investment_transactions"] = data.investment_transactions.map((txn) => this.plaidInvestTransactionToEntity(plaidInfo, txn));
        newInvestUpdateDates[plaidInfo.institution_name] = today;
      }
    }

    // Write to DB
    console.log("Writing to the DB!");
    console.log(syncedTransactions["TD Canada Trust"]["added"][0]);
    console.log(syncedTransactions["TD Canada Trust - WebBroker"]["investment_transactions"][0]);
    // console.log(newCursors);
    // console.log(newInvestUpdateDates);

    // Update cursors

    // return { added: added }
  }
}