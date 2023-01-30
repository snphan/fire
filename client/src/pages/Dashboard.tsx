import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  IS_BANKACCOUNT_LINKED,
  PLAID_CREATE_LINK_TOKEN,
  PLAID_GET_ACCOUNTS,
  PLAID_GET_BALANCE,
  PLAID_GET_INSTITUTION_BY_NAME,
  PLAID_GET_INVESTMENT_TRANSACTIONS,
  PLAID_GET_TRANSACTIONS,
  PLAID_SYNC_TRANSACTIONS
} from '@/queries';
import { PLAID_EXCHANGE_TOKEN, PLAID_UNLINK_BANK } from '@/mutations';
import { apolloClient } from '..';
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Tooltip } from '@material-tailwind/react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { Loading } from '@/components/Loading';
import { PlaidLinkPrompt } from '@/components/Plaid/PlaidLinkPrompt';
import { PlaidUnlinkPrompt } from '@/components/Plaid/PlaidUnlinkPrompt';
import { TotalBalance } from '@/components/Dashboard/TotalBalance';
import { TotalIncome } from '@/components/Dashboard/TotalIncome';
import { ExpensesBreakdown } from '@/components/Dashboard/ExpensesBreadown';


export function Dashboard({ }: any) {

  const thisMonth = (new Date()).getUTCMonth() + 1;
  const nextMonth = thisMonth + 1 > 12 ? 1 : thisMonth + 1;
  const thisYear = (new Date()).getUTCFullYear();
  const nextYear = thisMonth + 1 > 12 ? thisYear + 1 : thisYear;

  const { data: isBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [openPlaidPrompt, setOpenPlaidPrompt] = useState<boolean>(false);
  const [openPlaidUnlink, setOpenPlaidUnlink] = useState<boolean>(false);
  const { data: balanceData, loading: loadingBalance } = useQuery<any>(PLAID_GET_BALANCE);
  const { data: transactionsData, loading: loadingTransactions } = useQuery<any>(PLAID_GET_TRANSACTIONS,
    { variables: { startDate: `${thisYear}-${thisMonth}-01`, endDate: `${nextYear}-${nextMonth}-01` } });
  const { data: investmentTransactionsData } = useQuery<any>(PLAID_GET_INVESTMENT_TRANSACTIONS,
    { variables: { startDate: `${thisYear}-${thisMonth}-01`, endDate: `${nextYear}-${nextMonth}-01` } });

  // DEBUG
  useEffect(() => {
  }, [balanceData, transactionsData, investmentTransactionsData]);



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
              <Tooltip content={"Link/Update Account"} className="capitalize bg-gray-900 p-2">
                <span onClick={() => setOpenPlaidPrompt(!openPlaidPrompt)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">account_balance</span>
              </Tooltip>
              <Tooltip content={"Unlink"} className="capitalize bg-gray-900 p-2">
                <span onClick={() => setOpenPlaidUnlink(!openPlaidUnlink)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">link_off</span>
              </Tooltip>
            </div>
          </div>
          <div className="flex justify-start">
            <TotalBalance loading={loadingBalance} balanceData={balanceData} />
            <TotalIncome loading={loadingTransactions} transactions={transactionsData} />
          </div>
          <ExpensesBreakdown className="grow w-2/5" loading={loadingTransactions} transactions={transactionsData} />
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