import { SECRET_KEY } from "@/config";
import { PlaidInfo } from "@/entities/plaid_info.entity";
import { User } from "@/entities/users.entity";
import { HttpException } from "@/exceptions/HttpException";
import { Transaction as PlaidTransaction, InvestmentTransaction as PlaidInvestmentTransaction, PlaidApi, Products, RemovedTransaction } from "plaid";
import { Ctx } from "type-graphql";
import { EntityRepository, In } from "typeorm";
import CryptoJS from 'crypto-js';
import dayjs from "dayjs";
import { Transaction } from "@/entities/transactions.entity";
import { InvestmentTransaction } from "@/entities/investment_transactions.entity";
import { app } from "@/server";

interface UpdatesFromPlaid {
  [key: string]: {
    plaidInfoId: number,
    added: Transaction[],
    modified: Transaction[],
    removed: RemovedTransaction[],
    investment_transactions: InvestmentTransaction[],
    investUpdateDate: string,
    txnCursor: string
  }
}

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
      amount: String(plaidTransaction.amount) // So that we can encrypt it.
    })
  }

  private plaidInvestTransactionToEntity(plaidInfo: PlaidInfo, plaidInvestTransaction: PlaidInvestmentTransaction): InvestmentTransaction {
    return InvestmentTransaction.create({
      plaidInfo: plaidInfo,
      investment_transaction_id: plaidInvestTransaction.investment_transaction_id,
      date: new Date(plaidInvestTransaction.date),
      type: plaidInvestTransaction.type,
      name: plaidInvestTransaction.name,
      iso_currency: plaidInvestTransaction.iso_currency_code,
      amount: String(plaidInvestTransaction.amount)
    })
  }

  /**
   * Sync the txns with plaid for the input user
   * @param user 
   * @param plaidClient 
   */
  public async syncTransactions(user: User, plaidClient: PlaidApi) {
    const findPlaidInfo = await this.getPlaidInfoByUser(user);
    if (!findPlaidInfo.length) { console.log("No plaid connection"); return; }

    const syncedTransactions: UpdatesFromPlaid = {};  // Store updates in memory until written to DB. 

    // Fetch the new transactions.
    for (const plaidInfo of findPlaidInfo) {
      const { institution_name } = plaidInfo;

      syncedTransactions[institution_name] = {
        plaidInfoId: plaidInfo.id,
        added: undefined,
        modified: undefined,
        removed: undefined,
        investment_transactions: undefined,
        investUpdateDate: undefined,
        txnCursor: undefined
      };
      try {
        if (plaidInfo.products.includes(Products.Transactions)) {
          let cursor = plaidInfo.txn_cursor;
          let added: PlaidTransaction[] = [];       // New added txns
          let modified: PlaidTransaction[] = [];    // Txns that were modified
          let removed: RemovedTransaction[] = [];     // Txns that were removed
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
          syncedTransactions[institution_name].txnCursor = cursor;
          syncedTransactions[institution_name].added = added.map((txn) => this.plaidTransactionToEntity(plaidInfo, txn));
          syncedTransactions[institution_name].modified = modified.map((txn) => this.plaidTransactionToEntity(plaidInfo, txn));
          syncedTransactions[institution_name].removed = removed;
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
          syncedTransactions[institution_name].investment_transactions = data.investment_transactions.map((txn) => this.plaidInvestTransactionToEntity(plaidInfo, txn));
          syncedTransactions[institution_name].investUpdateDate = today;
        }
      } catch (err) {
        console.log(err.response.statusText);
        return;
      }
    }

    // Write to DB
    console.log("Writing to the DB!");
    console.log(syncedTransactions["TD Canada Trust"]["added"][0]);
    for (const institution_name of Object.keys(syncedTransactions)) {
      const { added, modified, removed, investment_transactions, txnCursor, investUpdateDate, plaidInfoId } = syncedTransactions[institution_name];

      try {
        if (added)
          await app.appDataSource
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values(added)
            .orUpdate(
              ['date', 'category', 'name', 'iso_currency', 'amount'],
              ['transaction_id'],
              { skipUpdateIfNoValuesChanged: true }
            )
            .execute();

        if (modified)
          await app.appDataSource
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values(modified)
            .orUpdate(
              ['date', 'category', 'name', 'iso_currency', 'amount'],
              ['transaction_id'],
              { skipUpdateIfNoValuesChanged: true }
            )
            .execute()

        if (removed)
          await app.appDataSource
            .createQueryBuilder()
            .delete()
            .from(Transaction)
            .where({ transaction_id: In(removed.map((item: RemovedTransaction) => item.transaction_id)) })
            .execute()

        /* Only after all the Sync Completes for a Institution should cursor update. */
        if (txnCursor) await PlaidInfo.update(plaidInfoId, { txn_cursor: txnCursor });

        if (investment_transactions)
          await app.appDataSource
            .createQueryBuilder()
            .insert()
            .into(InvestmentTransaction)
            .values(syncedTransactions[institution_name]["investment_transactions"])
            .orUpdate(
              ['date', 'type', 'name', 'iso_currency', 'amount'],
              ['investment_transaction_id'],
              { skipUpdateIfNoValuesChanged: true }
            )
            .execute();

        /* Only after all the Sync Completes for a Institution should date update. */
        if (investUpdateDate)
          await PlaidInfo.update(plaidInfoId, { invest_txn_update_date: investUpdateDate });

      } catch (err) {
        console.log(err);
      }
    }
  }
}