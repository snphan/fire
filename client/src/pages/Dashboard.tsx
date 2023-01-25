import React, { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { IS_BANKACCOUNT_LINKED, PLAID_CREATE_LINK_TOKEN, PLAID_GET_ACCOUNTS, PLAID_GET_BALANCE, PLAID_GET_INSTITUTION_BY_NAME, PLAID_GET_INVESTMENT_TRANSACTIONS, PLAID_GET_TRANSACTIONS } from '@/queries';
import { PLAID_EXCHANGE_TOKEN, PLAID_UNLINK_BANK } from '@/mutations';
import { apolloClient } from '..';
import { Button, Chip, Dialog, DialogBody, DialogFooter, DialogHeader, Tooltip } from '@material-tailwind/react';
import { PlaidLinkOptions, usePlaidLink } from 'react-plaid-link';
import { Loading } from '@/components/Loading';
import { PlaidLinkButton } from '@/components/Plaid/PlaidLinkButton';


export function Dashboard({ }: any) {

  const { data: isBankLinked, refetch: refetchIsBankLinked } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [getLinkToken, { data: linkTokenData }] = useLazyQuery<any>(PLAID_CREATE_LINK_TOKEN, {
    fetchPolicy: "no-cache"
  });
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidLinkReady, setPlaidLinkReady] = useState<boolean>(false);
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
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [openProductSelection, setOpenProductSelection] = useState<boolean>(false);

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
  }, [balanceData, transactionsData, accountData]);

  const handleClickProduct = (product: string) => {
    if (selectedProducts.includes(product)) {
      const index = selectedProducts.indexOf(product);
      setSelectedProducts(selectedProducts.filter(item => item !== product));
    } else {
      setSelectedProducts(selectedProducts.concat(product));
    }
  }

  return (
    <div className="ml-24 flex flex-col min-h-screen min-w-0 max-w-full overflow-hidden">
      {!isBankLinked?.bankAccountLinked ?
        <div className='grow flex justify-center items-center'>
          <Button onClick={() => setOpenProductSelection(!openProductSelection)} variant="gradient" size="lg">
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
                <span onClick={() => setOpenProductSelection(!openProductSelection)} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">account_balance</span>
              </Tooltip>
              <Tooltip content={"Unlink"} className="capitalize bg-gray-900 p-2">
                <span onClick={() => unlinkBankAccount()} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl material-icons">link_off</span>
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

      <Dialog size="lg" open={openProductSelection} handler={() => setOpenProductSelection(!openProductSelection)} className="bg-gray-800 max-h-screen overflow-auto">
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
              setOpenProductSelection(!openProductSelection);
              setSelectedProducts([]);
              setLinkToken(null);
            }}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>

          {!linkToken ?
            <Button variant="gradient" color="green" onClick={() => {
              const formatProducts = selectedProducts.join(',');
              // setOpenProductSelection(!openProductSelection);
              getLinkToken({
                variables: {
                  products: formatProducts

                },
                onCompleted: (res) => {
                  setLinkToken(res.createLinkToken['link_token']);
                }
              })
            }}>
              <span>Confirm</span>
            </Button>
            :
            <PlaidLinkButton
              linkToken={linkToken}
              setLinkToken={setLinkToken}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              setOpenProductSelection={setOpenProductSelection}
            />
          }
        </DialogFooter>
      </Dialog>
    </div>
  )
}