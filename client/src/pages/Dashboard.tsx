import React, { useContext, useEffect, useState } from 'react';
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
  txnTableFilters: {
    state: {
      startDate: string | null;
      endDate: string | null;
      categories: string[] | null;
      notCategories: string[] | null;
    };
    set: any;
  }
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
    {
      query: PLAID_GET_INVESTMENT_TRANSACTIONS, variables: defaultPeriod
    },
    { query: PLAID_GET_BANK_NAMES },
  ]

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

  const dashboardStore: IDashboardContext = {
    sync: syncUserTransactions,
    refetchQueries: dashboardRefetchQueries,
    defaultPeriod: defaultPeriod,
    txnTableFilters: {
      state: TxnTableFilters,
      set: setTxnTableFilters
    }
  }

  // DEBUG
  useEffect(() => {
  }, [balanceData, transactionsData, investmentTransactionsData, allInvestTxnData]);


  /* Sync data on login */
  useEffect(() => {
    syncUserTransactions();
  }, [])

  return (
    <DashboardContext.Provider value={dashboardStore}>
      <div className="ml-24 flex flex-col min-h-screen min-w-0 max-w-full overflow-hidden">
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
              <h1>Dashboard</h1>
              <div>
                <Tooltip content={"Sync Transactions"} className="capitalize bg-gray-900 p-2">
                  {syncLoading ?

                    <span className="m-4 text-gray-800 text-3xl material-icons">pending</span>
                    :
                    <span onClick={() => syncUserTransactions()} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">sync</span>
                  }
                </Tooltip>
                <Tooltip content={"Link/Update Account"} className="capitalize bg-gray-900 p-2">
                  <span onClick={() => setOpenPlaidPrompt(!openPlaidPrompt)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">account_balance</span>
                </Tooltip>
                <Tooltip content={"Unlink"} className="capitalize bg-gray-900 p-2">
                  <span onClick={() => setOpenPlaidUnlink(!openPlaidUnlink)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">link_off</span>
                </Tooltip>
              </div>
            </div>

            {/* Dashboard Viz Components */}
            <div className="grow w-full grid xl:grid-cols-6 xl:grid-rows-6">
              <TotalBalance className="row-span-2 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingBalance} balanceData={balanceData} />
              <TotalIncome className="row-span-2 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
              <IncomeByMonth className="col-span-2 row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl"
                loading={loadingTransactions}
                allIncome={allTransactionsData?.getTransactions.filter((item: any) => item.category === "INCOME")}
                allDividends={allInvestTxnData?.getInvestTransactions.filter((item: any) => item.type === "cash" && !item.name.match(/CONTRIBUTION/))}
              />

              <TransactionsTable className="max-h-full col-span-2 row-span-6 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingAllTransactions} allTransactions={allTransactionsData?.getTransactions} />
              <ExpensesBreakdown className="row-span-4 col-span-2 flex flex-col bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
              <ExpensesByMonth className="col-span-2 row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl"
                loading={loadingTransactions}
                allExpenses={allTransactionsData?.getTransactions.filter((item: any) =>
                  !["INCOME", "TRANSFER_IN", "TRANSFER_OUT", "LOAN_PAYMENTS"].includes(item.category)
                )}
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