import { IS_BANKACCOUNT_LINKED, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_BANK_NAMES, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { createContext } from 'react';

export const CurrencyContext = createContext(
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
);
export const MonthYearFormatContext = createContext(
  new Intl.DateTimeFormat('en-us', { month: 'short', year: 'numeric' })
)

const thisMonth = (new Date()).getUTCMonth() + 1;
const nextMonth = thisMonth + 1 > 12 ? 1 : thisMonth + 1;
const thisYear = (new Date()).getUTCFullYear();
const nextYear = thisMonth + 1 > 12 ? thisYear + 1 : thisYear;
const defaultTxnPeriod = {
  startDate: `${thisYear}-${thisMonth}-01`,
  endDate: `${nextYear}-${nextMonth}-01`
}

export const TxnPeriodContext = createContext(defaultTxnPeriod);

export const DashboardQueriesContext = createContext([
  { query: IS_BANKACCOUNT_LINKED },
  { query: PLAID_GET_ACCOUNTS },
  { query: PLAID_GET_BALANCE },
  {
    query: PLAID_GET_TRANSACTIONS, variables: {
      startDate: defaultTxnPeriod.startDate,
      endDate: defaultTxnPeriod.endDate
    }
  },
  {
    query: PLAID_GET_INVESTMENT_TRANSACTIONS, variables: {
      startDate: defaultTxnPeriod.startDate,
      endDate: defaultTxnPeriod.endDate
    }
  },
  { query: PLAID_GET_BANK_NAMES }
]);