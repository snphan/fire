import { PLAID_EXCHANGE_TOKEN } from '@/mutations';
import { IS_BANKACCOUNT_LINKED, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_TRANSACTIONS } from '@/queries';
import { useMutation } from '@apollo/client';
import { Button } from '@material-tailwind/react';
import React from 'react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';

export function PlaidLinkButton({ linkToken, setLinkToken, selectedProducts, setSelectedProducts, setOpenProductSelection }: any) {
  /* 
    Setup the plaid link like this so we can rerender the component and 
    fix the plaid link not opening on 2nd+ account connection request.
  */
  const [exchangeLinkToken, { data: itemId }] = useMutation<any>(PLAID_EXCHANGE_TOKEN, {
    refetchQueries: [
      { query: IS_BANKACCOUNT_LINKED },
      { query: PLAID_GET_ACCOUNTS },
      { query: PLAID_GET_BALANCE },
      { query: PLAID_GET_TRANSACTIONS },
    ]
  });

  const handleCompleteBankConnect = (publicToken: string) => {
    console.log("Success! Public Token is: " + publicToken);
    /* Exchange the PublicToken for a Permanent Access token */
    console.log("Exchanging Public token");
    exchangeLinkToken({
      variables: { publicToken: publicToken, products: selectedProducts.join(',') },
      onCompleted: () => setSelectedProducts([])
    });
    setLinkToken(null);
    setOpenProductSelection(false);
  }

  const plaidConfig: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleCompleteBankConnect,
    onExit: () => {
      console.log("Exiting");
      setLinkToken(null);
      setOpenProductSelection(false);
    }
  }

  const { open, ready } = usePlaidLink(plaidConfig)
  return (
    <>
      <Button onClick={() => open()} disabled={!ready}>Link</Button>
    </>
  )
}