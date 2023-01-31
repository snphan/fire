import { SYNC_TRANSACTIONS } from '@/mutations';
import { IDashboardContext } from '@/pages/Dashboard';
import { IS_BANKACCOUNT_LINKED, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_BANK_NAMES, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { createContext } from 'react';

export const CurrencyContext = createContext(
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
);
export const MonthYearFormatContext = createContext(
  new Intl.DateTimeFormat('en-us', { month: 'short', year: 'numeric' })
)

export const DashboardContext = createContext<IDashboardContext | null>(null);