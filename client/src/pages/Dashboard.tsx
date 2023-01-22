import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useQuery } from '@apollo/client';
import { PLAID_CREATE_LINK_TOKEN } from '@/queries';
import { apolloClient } from '..';
import { Button } from '@material-tailwind/react';
import { usePlaidLink } from 'react-plaid-link';


export function Dashboard({ }: any) {

  const { data: linkToken } = useQuery<any>(PLAID_CREATE_LINK_TOKEN);

  const handleCompleteBankConnect = (publicToken: string) => {
    console.log("Success! Public Token is: " + publicToken);
  }

  const { open: plaidOpen, ready } = usePlaidLink({
    token: linkToken && JSON.parse(linkToken.createLinkToken)["link_token"],
    onSuccess: handleCompleteBankConnect
  });


  return (
    <div className="ml-24 min-h-screen max-w-screen overflow-hidden">
      {linkToken?.createLinkToken}
      <Button onClick={() => plaidOpen()} disabled={!ready}>Connect to Bank</Button>
    </div>
  )
}