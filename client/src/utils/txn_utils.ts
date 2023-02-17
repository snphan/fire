/**
 * Utilities for easier processing of transactions data from Plaid
 */

import dayjs from "dayjs";
import { Set } from "typescript";

export const reconcileTransactions = (transactions: any) => {
  let reconciledTransactions = transactions;
  // Assume Txn are sorted by date

  reconciledTransactions = reconcilePreAuth(reconciledTransactions);
  reconciledTransactions = reconcileCreditCardPayments(reconciledTransactions);
  /* Reconcile Transfers Between Accounts That are Not Credit Card Payments */
  reconciledTransactions = reconciledTransactions.filter((item: any) => !item.name.match(/(TFR-TO)|(TFR-FR)/));

  return reconciledTransactions;
}

/**
 * Traverse through and keep a hashmap of the prices = {price: txnId} for the current day
 * Check if it is the negative of the price, if it is add to removeTxnIds because it is refund
 * 
 * @param transactions List of transactions
 * @returns reconciled Transactions
 */
const reconcilePreAuth = (transactions: any): Array<any> => {
  const removeTxnIds: Set<string | void> = new Set();

  let dayTxn = new Map();
  let currentDay = dayjs();
  for (const txn of transactions) {
    const amount = parseFloat(txn.amount);
    const date = dayjs(txn.date);
    const { transaction_id } = txn;

    // Reset
    if (!date.isSame(currentDay)) {
      dayTxn = new Map();
      currentDay = dayjs(txn.date);
    }

    // Check if negative exists
    if (dayTxn.has(-amount) && dayTxn.get(-amount).length) {
      removeTxnIds.add(transaction_id);
      removeTxnIds.add(dayTxn.get(-amount).pop()) // Pop because we may have duplicate prices.
    } else {
      dayTxn.has(amount) ? dayTxn.set(amount, [...dayTxn.get(amount), transaction_id]) : dayTxn.set(amount, [transaction_id])
    }
  }

  let reconciledTxn = [];

  for (const txn of transactions) {
    if (!removeTxnIds.has(txn.transaction_id)) {
      reconciledTxn.push(txn);
    }
  }

  return reconciledTxn;
}

/**
 * Look back 3 days assuming it takes 1 business day to process (payment on Friday will take 3 business days)
 * If Txn with the same amount is found, add both Txn Ids to the remove Txn ids.
 * 
 * @param transactions 
 * @returns transactions with credit card payments balanced
 */
const reconcileCreditCardPayments = (transactions: any) => {
  const removeTxnIds: Set<string | void> = new Set();

  transactions.forEach((txn: any, ind: number) => {
    const { category, transaction_id } = txn;
    const amount = parseFloat(txn.amount);
    const maxLookBackdate = dayjs(txn.date).subtract(4, 'days');

    if (category === "LOAN_PAYMENTS") {
      let i = ind + 1;
      while (i < transactions.length && dayjs(transactions[i].date).isAfter(maxLookBackdate)) {
        const prevTxn = transactions[i];
        if (prevTxn.category === "TRANSFER_OUT" && amount === -parseFloat(prevTxn.amount)) {
          removeTxnIds.add(prevTxn.transaction_id);
          removeTxnIds.add(transaction_id);
          break
        }
        i += 1;
      }
    }
  })

  let reconciledTxn = [];

  for (const txn of transactions) {
    if (!removeTxnIds.has(txn.transaction_id)) {
      reconciledTxn.push(txn);
    }
  }
  return reconciledTxn;
}