import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DocumentNode, InternalRefetchQueriesInclude, useMutation, useQuery } from '@apollo/client';
import {
  IS_BANKACCOUNT_LINKED,
  PLAID_GET_ACCOUNTS,
  PLAID_GET_ALL_INVEST_TXN,
  PLAID_GET_ALL_TRANSACTIONS,
  PLAID_GET_BANK_NAMES,
  PLAID_GET_INVESTMENT_TRANSACTIONS,
  PLAID_GET_TRANSACTIONS,
} from '@/queries';
import { SYNC_TRANSACTIONS } from '@/mutations';
import { Button, Tooltip } from '@material-tailwind/react';
import { PlaidLinkPrompt } from '@/components/Plaid/PlaidLinkPrompt';
import { PlaidUnlinkPrompt } from '@/components/Plaid/PlaidUnlinkPrompt';
import { TotalBalance } from '@/components/Dashboard/TotalBalance';
import { TotalIncome } from '@/components/Dashboard/TotalIncome';
import { ExpensesBreakdown } from '@/components/Dashboard/ExpensesBreakdown';
import { DashboardContext } from '@/Context';
import dayjs from 'dayjs';
import { IncomeByMonth } from '@/components/Dashboard/IncomeByMonth';
import { ExpensesByMonth } from '@/components/Dashboard/ExpensesByMonth';
import { TransactionsTable } from '@/components/Dashboard/TransactionsTable';

export interface IDashboardContext {
  sync(): any;
  refetchQueries: Array<{
    query: DocumentNode,
    variables?: {
      [key: string]: string;
    }
  }>;
  defaultPeriod: {
    startDate: string;
    endDate: string;
  };
}

export function Dashboard({ }: any) {

  const defaultPeriod = {
    startDate: dayjs().format('YYYY-MM'),
    endDate: dayjs().add(1, 'month').format('YYYY-MM')
  }

  const [TxnTableFilters, setTxnTableFilters] = useState({
    startDate: null,
    endDate: null,
    categories: null,
    notCategories: null
  });

  const dashboardRefetchQueries = [
    { query: IS_BANKACCOUNT_LINKED },
    { query: PLAID_GET_ACCOUNTS },
    {
      query: PLAID_GET_TRANSACTIONS, variables: defaultPeriod
    },
    { query: PLAID_GET_ALL_TRANSACTIONS },
    { query: PLAID_GET_ALL_INVEST_TXN },
    {
      query: PLAID_GET_INVESTMENT_TRANSACTIONS, variables: defaultPeriod
    },
    { query: PLAID_GET_BANK_NAMES },
  ]

  const [hideTxnTable, setHideTxnTable] = useState<boolean>(true);
  const { data: isBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [openPlaidPrompt, setOpenPlaidPrompt] = useState<boolean>(false);
  const [openPlaidUnlink, setOpenPlaidUnlink] = useState<boolean>(false);
  const { data: balanceData, loading: loadingBalance } = useQuery<any>(PLAID_GET_ACCOUNTS);
  const { data: transactionsData, loading: loadingTransactions } = useQuery<any>(PLAID_GET_TRANSACTIONS,
    {
      variables: defaultPeriod
    });
  const { data: allTransactionsData, loading: loadingAllTransactions } = useQuery<any>(PLAID_GET_ALL_TRANSACTIONS);
  const { data: investmentTransactionsData } = useQuery<any>(PLAID_GET_INVESTMENT_TRANSACTIONS,
    {
      variables: defaultPeriod
    });
  const { data: allInvestTxnData, loading: loadingAllInvestTransactions } = useQuery<any>(PLAID_GET_ALL_INVEST_TXN);
  const [syncUserTransactions, { data: syncSuccess, loading: syncLoading }] = useMutation(SYNC_TRANSACTIONS, {
    refetchQueries: dashboardRefetchQueries
  });

  /* Use Callbacks so that the eCharts do not need to rerender (DataZoom position gets reset) */
  const getCurrentMonthTransactions = useCallback(() => transactionsData?.getTransactions, [transactionsData]);

  const getAllExpenses = useCallback(() => allTransactionsData?.getTransactions.filter((item: any) =>
    !["INCOME", "TRANSFER_IN", "TRANSFER_OUT", "LOAN_PAYMENTS"].includes(item.category)
  ), [allTransactionsData])

  const getAllIncome = useCallback(() => allTransactionsData?.getTransactions.filter((item: any) => item.category === "INCOME"
  ), [allTransactionsData])

  const getAllDividend = useCallback(() => allInvestTxnData?.getInvestTransactions.filter((item: any) => item.type === "cash" && !item.name.match(/CONTRIBUTION/)
  ), [allInvestTxnData])

  const setTxnTableFiltersCallback = useCallback((filters: any) => setTxnTableFilters(filters), []);

  const getDashboardStore = useCallback(() => ({
    sync: syncUserTransactions,
    refetchQueries: dashboardRefetchQueries,
    defaultPeriod: defaultPeriod,
  }), []);

  const openTxnTable = useCallback(() => setHideTxnTable(false), [])
  const closeTxnTable = useCallback(() => setHideTxnTable(true), [])

  // DEBUG
  useEffect(() => {
  }, [balanceData, transactionsData, investmentTransactionsData, allInvestTxnData]);


  /* Sync data on login */
  useEffect(() => {
    syncUserTransactions();
  }, [])

  return (
    <DashboardContext.Provider value={getDashboardStore}>
      <div className="lg:ml-24 flex flex-col min-h-screen min-w-0 max-w-full lg:overflow-hidden">
        {(isBankLinked?.bankAccountLinked === false) ?
          <div className='grow flex justify-center items-center'>
            <Button onClick={() => setOpenPlaidPrompt(!openPlaidPrompt)} variant="gradient" size="lg">
              <div className="flex items-center">
                <div>Link Bank Account</div>
                <div><span className="ml-3 material-icons">account_balance</span></div>
              </div>
            </Button>
          </div>
          :
          <>
            <div className="flex justify-between">
              <h1 className="text-base ml-14 lg:ml-5 lg:text-5xl ">Dashboard</h1>
              <div>
                <Tooltip content={"Sync Transactions"} className="capitalize bg-gray-900 p-2">
                  {syncLoading ?
                    <span className="m-4 text-gray-800 lg:text-3xl material-icons">pending</span>
                    :
                    <span onClick={() => syncUserTransactions()} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer lg:text-3xl material-icons">sync</span>
                  }
                </Tooltip>
                <Tooltip content={"Link/Update Account"} className="capitalize bg-gray-900 p-2">
                  <span onClick={() => setOpenPlaidPrompt(!openPlaidPrompt)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer lg:text-3xl material-icons">account_balance</span>
                </Tooltip>
                <Tooltip content={"Unlink"} className="capitalize bg-gray-900 p-2">
                  <span onClick={() => setOpenPlaidUnlink(!openPlaidUnlink)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer lg:text-3xl material-icons">link_off</span>
                </Tooltip>
              </div>
            </div>

            {/* Dashboard Viz Components */}
            <div className="lg:h-auto lg:grow w-full grid grid-cols-2 lg:grid-cols-6 lg:grid-rows-6">
              <TotalBalance className="h-24 lg:h-auto lg:row-span-2 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 lg:p-3 lg:m-4 m-2 p-2 rounded-xl shadow-xl"
                loading={loadingBalance}
                balanceData={balanceData}
              />
              <TotalIncome className="h-24 lg:h-auto lg:row-span-2 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 lg:p-3 lg:m-4 m-2 p-2 rounded-xl shadow-xl"
                loading={loadingTransactions}
                transactions={transactionsData}
              />
              <ExpensesBreakdown className="h-60 lg:h-auto lg:row-span-5 lg:order-5 col-span-2 flex flex-col bg-zinc-900 lg:p-3 lg:m-4 m-2 p-2 rounded-xl shadow-xl"
                loading={loadingTransactions}
                transactions={getCurrentMonthTransactions}
                setTxnTableFiltersCallback={setTxnTableFiltersCallback}
                openTxnTable={openTxnTable}
              />
              <IncomeByMonth className="h-60 lg:h-auto lg:order-3 col-span-2 lg:row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 lg:p-3 lg:m-4 m-2 p-2 rounded-xl shadow-xl"
                allIncome={getAllIncome}
                allDividends={getAllDividend}
                setTxnTableFiltersCallback={setTxnTableFiltersCallback}
                openTxnTable={openTxnTable}
              />
              <ExpensesByMonth className="h-60 lg:h-auto lg:order-6 col-span-2 lg:row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 lg:p-3 lg:m-4 m-2 p-2 rounded-xl shadow-xl"
                allExpenses={getAllExpenses}
                setTxnTableFiltersCallback={setTxnTableFiltersCallback}
                openTxnTable={openTxnTable}
              />
              <TransactionsTable className={(hideTxnTable ? "top-full " : "top-1/4 z-20 ") + "h-3/4 w-full duration-500 lg:w-auto fixed lg:top-auto lg:h-auto lg:static lg:block lg:order-4 max-h-full col-span-2 row-span-6 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 lg:p-3 lg:m-4 p-4 lg:rounded-xl rounded-t-3xl shadow-xl"}
                loading={loadingAllTransactions}
                allTransactions={allTransactionsData?.getTransactions}
                allInvestTransactions={allInvestTxnData?.getInvestTransactions}
                filters={TxnTableFilters}
                closeTxnTable={closeTxnTable}
                hideTxnTable={hideTxnTable}
              />
            </div>
          </>
        }
        {/* Rerender everytime so we can access Plaid Link */}
        {openPlaidPrompt &&
          <PlaidLinkPrompt setOpenPlaidPrompt={setOpenPlaidPrompt} />
        }
        <PlaidUnlinkPrompt openPlaidUnlink={openPlaidUnlink} setOpenPlaidUnlink={setOpenPlaidUnlink} />
      </div>
    </DashboardContext.Provider>
  )
}