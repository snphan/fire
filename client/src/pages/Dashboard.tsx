import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PLAID_CREATE_LINK_TOKEN, PLAID_EXCHANGE_TOKEN, PLAID_GET_ACCOUNTS } from '@/queries';
import { apolloClient } from '..';
import { Button } from '@material-tailwind/react';
import { usePlaidLink } from 'react-plaid-link';


export function Dashboard({ }: any) {

  const { data: linkToken } = useQuery<any>(PLAID_CREATE_LINK_TOKEN);
  const [exchangeLinkToken, { data: itemId }] = useLazyQuery<any>(PLAID_EXCHANGE_TOKEN);
  const [getAccounts, { data: accountData }] = useLazyQuery<any>(PLAID_GET_ACCOUNTS);

  const handleCompleteBankConnect = (publicToken: string) => {
    console.log("Success! Public Token is: " + publicToken);
    /* Exchange the PublicToken for a Permanent Access token */
    console.log("Exchanging Public token");
    exchangeLinkToken({ variables: { publicToken: publicToken } });
  }

  const { open: plaidOpen, ready } = usePlaidLink({
    token: linkToken && JSON.parse(linkToken.createLinkToken)["link_token"],
    onSuccess: handleCompleteBankConnect
  });

  return (
    <div className="ml-24 min-h-screen max-w-screen overflow-hidden">
      {linkToken?.createLinkToken}
      <Button onClick={() => plaidOpen()} disabled={!ready}>Connect to Bank</Button>
      {accountData?.getAccounts}
      <Button onClick={() => getAccounts()}>Get Accounts</Button>
    </div>
  )
}