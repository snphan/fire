import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { IS_BANKACCOUNT_LINKED, PLAID_CREATE_LINK_TOKEN, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_INSTITUTION_BY_NAME, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { PLAID_EXCHANGE_TOKEN, PLAID_UNLINK_BANK } from '@/mutations';
import { apolloClient } from '..';
import { Button, Tooltip } from '@material-tailwind/react';
import { usePlaidLink } from 'react-plaid-link';
import { Loading } from '@/components/Loading';


export function Dashboard({ }: any) {

  const { data: isBankLinked, refetch: refetchIsBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const { data: linkToken } = useQuery<any>(PLAID_CREATE_LINK_TOKEN);
  const [exchangeLinkToken, { data: itemId }] = useMutation<any>(PLAID_EXCHANGE_TOKEN, {
    refetchQueries: [
      { query: IS_BANKACCOUNT_LINKED },
      { query: PLAID_GET_ACCOUNTS },
      { query: PLAID_GET_BALANCE },
      { query: PLAID_GET_TRANSACTIONS },
    ]
  });
  const [unlinkBankAccount] = useMutation<any>(PLAID_UNLINK_BANK, {
    refetchQueries: [
      { query: IS_BANKACCOUNT_LINKED },
      { query: PLAID_GET_ACCOUNTS },
      { query: PLAID_GET_BALANCE },
      { query: PLAID_GET_TRANSACTIONS },
    ]
  });
  const { data: accountData } = useQuery<any>(PLAID_GET_ACCOUNTS);
  const { data: balanceData, loading: loadingBalance } = useQuery<any>(PLAID_GET_BALANCE);
  const { data: transactionsData, loading: loadingTransactions } = useQuery<any>(PLAID_GET_TRANSACTIONS);

  const [totalBalance, setTotalBalance] = useState<number | undefined>(undefined);

  const handleCompleteBankConnect = (publicToken: string) => {
    console.log("Success! Public Token is: " + publicToken);
    /* Exchange the PublicToken for a Permanent Access token */
    console.log("Exchanging Public token");
    exchangeLinkToken({ variables: { publicToken: publicToken } });
  }

  const { open: plaidOpen, ready } = usePlaidLink({
    token: linkToken && linkToken.createLinkToken["link_token"],
    onSuccess: handleCompleteBankConnect
  });

  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  useEffect(() => {
    if (balanceData) {
      setTotalBalance(balanceData.getBalance.balance.reduce((a: number, b: any) => a + b.balances.current, 0));
    }
    if (transactionsData) {
      console.log(transactionsData);
    }
    if (accountData) {
      console.log(accountData);
    }
  }, [balanceData, transactionsData, accountData]);

  return (
    <div className="ml-24 flex flex-col min-h-screen min-w-0 max-w-full overflow-hidden">
      {!isBankLinked?.bankAccountLinked ?
        <div className='grow flex justify-center items-center'>
          <Button onClick={() => plaidOpen()} variant="gradient" size="lg" disabled={!ready}>
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
                <span onClick={() => plaidOpen()} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-5xl material-icons">link</span>
              </Tooltip>
              <Tooltip content={"Unlink"} className="capitalize bg-gray-900 p-2">
                <span onClick={() => unlinkBankAccount()} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-5xl material-icons">link_off</span>
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
    </div>
  )
}