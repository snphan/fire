import { PLAID_EXCHANGE_TOKEN } from '@/mutations';
import { IS_BANKACCOUNT_LINKED, PLAID_CREATE_LINK_TOKEN, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_BANK_NAMES, PLAID_GET_TRANSACTIONS } from '@/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React, { useState } from 'react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';

export function PlaidLinkPrompt({ setOpenPlaidPrompt }: any) {
  /* 
    Setup the plaid link like this so we can rerender the component and 
    fix the plaid link not opening on 2nd+ account connection request.
  */
  const [openProductSelection, setOpenProductSelection] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [getLinkToken, { data: linkTokenData }] = useLazyQuery<any>(PLAID_CREATE_LINK_TOKEN, {
    fetchPolicy: "no-cache"
  });
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const [exchangeLinkToken, { data: itemId }] = useMutation<any>(PLAID_EXCHANGE_TOKEN, {
    refetchQueries: [
      { query: IS_BANKACCOUNT_LINKED },
      { query: PLAID_GET_ACCOUNTS },
      { query: PLAID_GET_BALANCE },
      { query: PLAID_GET_TRANSACTIONS },
      { query: PLAID_GET_BANK_NAMES }
    ]
  });

  const handleClickProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      const index = selectedProducts.indexOf(product);
      setSelectedProducts(selectedProducts.filter(item => item !== product));
    } else {
      setSelectedProducts(selectedProducts.concat(product));
    }
  }

  const handleCompleteBankConnect = (publicToken: string) => {
    /* Exchange the PublicToken for a Permanent Access token */
    exchangeLinkToken({
      variables: { publicToken: publicToken, products: selectedProducts },
      onCompleted: () => setSelectedProducts([])
    });
    setLinkToken(null);
    setOpenPlaidPrompt(false);
  }

  const plaidConfig: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleCompleteBankConnect,
    onExit: () => {
      console.log("Exiting");
      setLinkToken(null);
      setOpenPlaidPrompt(false);
    }
  }

  const { open, ready } = usePlaidLink(plaidConfig)
  return (
    <>
      <Dialog size="lg" open={true} handler={() => setOpenProductSelection(!openProductSelection)} className="bg-zinc-800 max-h-screen overflow-auto">
        <DialogHeader className="text-gray-100">Select Products</DialogHeader>
        <DialogBody className="text-gray-200 flex flex-col">
          <div className="grid grid-cols-3 gap-1">
            {
              [
                "assets",
                "auth",
                "balance",
                "identity",
                "investments",
                "liabilities",
                "payment_initiation",
                "identity_verification",
                "transactions",
                "credit_details",
                "income",
                "income_verification",
                "deposit_switch",
                "standing_orders",
                "transfer",
                "employment",
                "recurring_transactions"
              ].map((product) => {
                return <div
                  key={product}
                  className={(selectedProducts.includes(product) ? "bg-sky-600" : "bg-zinc-800") + " hover:bg-zinc-500 hover:scale-105 shadow-xl cursor-pointer rounded-md p-2 text-sm font-bold"}
                  onClick={() => {
                    handleClickProduct(product);
                  }}
                >
                  {product.replace(/_/g, " ").toUpperCase()}
                </div>
              })
            }
          </div>

        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setOpenPlaidPrompt(false);
              setSelectedProducts([]);
              setLinkToken(null);
            }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>

          {!linkToken ?
            <Button variant="gradient" color="green" onClick={() => {
              // setOpenProductSelection(!openProductSelection);
              getLinkToken({
                variables: {
                  products: selectedProducts

                },
                onCompleted: (res) => {
                  setLinkToken(res.createLinkToken['link_token']);
                }
              })
            }}>
              <span>Confirm</span>
            </Button>
            :
            <Button onClick={() => open()} disabled={!ready}>Link</Button>
          }
        </DialogFooter>
      </Dialog>
    </>
  )
}