import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { IS_BANKACCOUNT_LINKED, PLAID_CREATE_LINK_TOKEN, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_INSTITUTION_BY_NAME, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { PLAID_EXCHANGE_TOKEN, PLAID_UNLINK_BANK } from '@/mutations';
import { apolloClient } from '..';
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Tooltip } from '@material-tailwind/react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { Loading } from '@/components/Loading';
import { PlaidLinkPrompt } from '@/components/Plaid/PlaidLinkPrompt';
import { PlaidUnlinkPrompt } from '@/components/Plaid/PlaidUnlinkPrompt';


export function Dashboard({ }: any) {

  const { data: isBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [openPlaidPrompt, setOpenPlaidPrompt] = useState<boolean>(false);
  const [openPlaidUnlink, setOpenPlaidUnlink] = useState<boolean>(false);
  const { data: accountData } = useQuery<any>(PLAID_GET_ACCOUNTS);
  const { data: balanceData, loading: loadingBalance } = useQuery<any>(PLAID_GET_BALANCE);
  const { data: transactionsData, loading: loadingTransactions } = useQuery<any>(PLAID_GET_TRANSACTIONS);
  const { data: investmentTransactionsData } = useQuery<any>(PLAID_GET_INVESTMENT_TRANSACTIONS);

  const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined);

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  useEffect(() => {
    if (balanceData) {
      setTotalBalance(balanceData.getBalance.balance.reduce(
        (a: number, b: any) => {
          if (b.balances.iso_currency_code === 'USD') {
            return a + b.balances.current * 1.3;
          } else {
            return a + b.balances.current;
          }
        }

        , 0));
    }
    if (transactionsData) {
      console.log(transactionsData);
    }
    if (accountData) {
      console.log(accountData);
    }
    if (investmentTransactionsData) {
      console.log(investmentTransactionsData);
    }
  }, [balanceData, transactionsData, accountData, investmentTransactionsData]);

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
          <div className="flex justify-between">
            <div className="flex flex-col bg-zinc-900 h-52 p-3 m-4 rounded-xl shadow-xl">
              <div className="text-sm font-bold">Total Balance</div>
              <div className="grow flex justify-center items-center">
                {loadingBalance ?
                  <Loading className="w-12 h-12"></Loading>
                  :
                  <div className="text-4xl font-bold text-sky-500">{totalBalance && currencyFormatter.format(totalBalance!)}</div>
                }
              </div>
            </div>
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