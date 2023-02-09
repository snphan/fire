import React, { useContext, useEffect, useState } from 'react';
import { CurrencyContext } from '@/Context';
import { Tooltip } from '@material-tailwind/react';

export function TransactionsTable({ className, allTransactions, allInvestTransactions, filters }: any) {

  const currencyFormatter = useContext(CurrencyContext);

  const [filteredTxn, setFilteredTxn] = useState<any>(undefined);

  const getFilteredItems = () => {
    let allTxn = allTransactions.slice(); // Slice so that we can sort
    let allInvestTxn = allInvestTransactions;
    const { startDate, endDate, categories, notCategories } = filters;
    if (startDate) {
      allTxn = allTxn.filter((txn: any) => new Date(txn.date) >= new Date(startDate + "T00:00:00.000Z"));
      allInvestTxn = allInvestTxn.filter((txn: any) => new Date(txn.date) >= new Date(startDate + "T00:00:00.000Z"));
    }
    if (endDate) {
      allTxn = allTxn.filter((txn: any) => new Date(txn.date) < new Date(endDate + "T00:00:00.000Z"));
      allInvestTxn = allInvestTxn.filter((txn: any) => new Date(txn.date) < new Date(endDate + "T00:00:00.000Z"));
    }
    if (categories) {
      allTxn = allTxn.filter((txn: any) => categories.includes(txn.category));
    }
    if (notCategories) {
      allTxn = allTxn.filter((txn: any) => !notCategories.includes(txn.category))
    }
    if (categories?.includes('DIVIDENDS')) {
      allInvestTxn = allInvestTxn.filter((item: any) => item.type === "cash" && !item.name.match(/CONTRIBUTION/));
      allTxn = allTxn.concat(allInvestTxn);
    }

    return allTxn.sort((a: any, b: any) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
  }

  useEffect(() => {
    if (allTransactions && allInvestTransactions) setFilteredTxn(getFilteredItems());
  }, [filters, allTransactions, allInvestTransactions])

  const getTotal = () => {
    return filteredTxn?.reduce((a: number, b: any) => a + Math.abs(parseFloat(b.amount)), 0)
  }

  return (
    <button className={className}>
      <div className="flex flex-col h-full items-between">
        <div className="flex justify-between">
          <div className="mb-5 text-sm font-bold">Transactions Table</div>
          {getTotal() &&
            <div className="mb-5 text-md font-bold text-sky-500">{currencyFormatter.format(getTotal())}</div>
          }
        </div>
        <div className="p-4 flex flex-col grow h-10 w-full">
          <div className="grow w-full ">
            <table className="w-full h-full flex flex-col">
              <thead id="txn-header" className="rounded-tl-xl rounded-tr-xl sticky top-0 bg-zinc-800 w-full">
                <tr className="table text-zinc-500 text-left w-full">
                  <th className="w-5/12 p-3 py-4">Name</th>
                  <th className="w-3/12 p-3 py-4">Date</th>
                  <th className="w-4/12 p-3 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="block overflow-y-auto h-96 grow text-zinc-400 text-left scrollbar-thumb-zinc-700 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-xl">
                {filteredTxn?.map((txn: any) => {
                  return (
                    <tr key={txn.transaction_id || txn.investment_transaction_id} className="transition-all duration-300 hover:bg-sky-200 hover:bg-opacity-10">
                      <td className="border-b border-zinc-700 p-3"
                        style={{
                          width: `${document.getElementById("txn-header") && document.getElementById("txn-header")!.offsetWidth * 5 / 12
                            }px`
                        }}
                      >
                        <Tooltip
                          content={
                            txn.category?.split('_').map((substring: string) => substring[0].toUpperCase() + substring.slice(1).toLowerCase()).join(" ")
                            || txn.type?.split('_').map((substring: string) => substring[0].toUpperCase() + substring.slice(1).toLowerCase()).join(" ")
                          }
                          className="capitalize bg-gray-900 p-2">
                          {txn.name}
                        </Tooltip>
                      </td>
                      <td className="w-3/12 border-b border-zinc-700 p-3">{txn.date.split("T")[0]}</td>
                      <td className="w-4/12 border-b border-zinc-700 p-3">{currencyFormatter.format(Math.abs(txn.amount))}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </button >
  )
}