import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  IS_BANKACCOUNT_LINKED,
  PLAID_GET_BALANCE,
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
import { DashboardQueriesContext, TxnPeriodContext } from '@/Context';


export function Dashboard({ }: any) {

  const txnPeriodContext = useContext(TxnPeriodContext);
  const dashboardQueriesContext = useContext(DashboardQueriesContext);

  const { data: isBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [openPlaidPrompt, setOpenPlaidPrompt] = useState<boolean>(false);
  const [openPlaidUnlink, setOpenPlaidUnlink] = useState<boolean>(false);
  const { data: balanceData, loading: loadingBalance } = useQuery<any>(PLAID_GET_BALANCE);
  const { data: transactionsData, loading: loadingTransactions } = useQuery<any>(PLAID_GET_TRANSACTIONS,
    {
      variables: {
        startDate: txnPeriodContext.startDate,
        endDate: txnPeriodContext.endDate
      }
    });
  const { data: investmentTransactionsData } = useQuery<any>(PLAID_GET_INVESTMENT_TRANSACTIONS,
    {
      variables: {
        startDate: txnPeriodContext.startDate,
        endDate: txnPeriodContext.endDate
      }
    });
  const [syncUserTransactions, { data: syncSuccess, loading: syncLoading }] = useMutation(SYNC_TRANSACTIONS, {
    refetchQueries: dashboardQueriesContext
  });


  // DEBUG
  useEffect(() => {
  }, [balanceData, transactionsData, investmentTransactionsData]);


  /* Sync data on login */
  useEffect(() => {
    syncUserTransactions();
  }, [])

  return (
    <div className="ml-24 flex flex-col min-h-screen min-w-0 max-w-full overflow-hidden">
      {!isBankLinked?.bankAccountLinked ?
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
            <TotalIncome className="col-span-2 row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
            <TotalIncome className="col-span-2 row-span-6 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
            <ExpensesBreakdown className="row-span-4 col-span-2 flex flex-col bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
            <TotalIncome className="col-span-2 row-span-3 focus:ring focus:ring-blue-300 transition-all bg-zinc-900 p-3 m-4 rounded-xl shadow-xl" loading={loadingTransactions} transactions={transactionsData} />
          </div>
        </>
      }
      {/* Rerender everytime so we can access Plaid Link */}
      {openPlaidPrompt &&
        <PlaidLinkPrompt setOpenPlaidPrompt={setOpenPlaidPrompt} />
      }
      <PlaidUnlinkPrompt openPlaidUnlink={openPlaidUnlink} setOpenPlaidUnlink={setOpenPlaidUnlink} />
    </div>
  )
}