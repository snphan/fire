import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { PLAID_CREATE_LINK_TOKEN, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { PLAID_EXCHANGE_TOKEN } from '@/mutations';
import { apolloClient } from '..';
import { Button } from '@material-tailwind/react';
import { usePlaidLink } from 'react-plaid-link';


export function Dashboard({ }: any) {

  const { data: linkToken } = useQuery<any>(PLAID_CREATE_LINK_TOKEN);
  const [exchangeLinkToken, { data: itemId }] = useMutation<any>(PLAID_EXCHANGE_TOKEN);
  const [getAccounts, { data: accountData }] = useLazyQuery<any>(PLAID_GET_ACCOUNTS);
  const [getBalance, { data: balanceData }] = useLazyQuery<any>(PLAID_GET_BALANCE);
  const [getTransactions, { data: transactionsData }] = useLazyQuery<any>(PLAID_GET_TRANSACTIONS);
  const [getInvestmentTransactions, { data: investmentTransactionsData }] = useLazyQuery<any>(PLAID_GET_INVESTMENT_TRANSACTIONS);

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

  return (
    <div className="ml-24 min-h-screen max-w-screen overflow-hidden">
    </div>
  )
}