import { DashboardContext } from '@/Context';
import { PLAID_EXCHANGE_TOKEN } from '@/mutations';
import { PLAID_CREATE_LINK_TOKEN } from '@/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import React, { useContext, useState } from 'react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';

export function PlaidLinkPrompt({ setOpenPlaidPrompt }: any) {
  const dashboardContext = useContext(DashboardContext);
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

  const [exchangeLinkToken, { data: itemId }] = useMutation<any>(PLAID_EXCHANGE_TOKEN);

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
      onCompleted: () => { setSelectedProducts([]); dashboardContext()?.sync(); }
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
      <Dialog size={(window.screen.width > 1024) ? "md" : "xl"} open={true} handler={() => setOpenProductSelection(!openProductSelection)} className="bg-zinc-800 max-h-screen overflow-auto">
        <DialogHeader className="text-gray-100">Select Products</DialogHeader>
        <DialogBody className="text-gray-200 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
            {
              [
                "assets",
                "auth",
                "investments",
                "liabilities",
                "transactions",
              ].map((product) => {
                return <div
                  key={product}
                  className={(selectedProducts.includes(product) ? "bg-sky-600 hover:bg-sky-500" : "bg-zinc-900 hover:bg-zinc-500") + " hover:scale-105 shadow-xl cursor-pointer rounded-md p-2 text-sm font-bold"}
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
        <DialogFooter className="flex justify-center items-center">
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