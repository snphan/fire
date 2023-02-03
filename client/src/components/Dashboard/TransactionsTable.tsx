import React, { useContext, useEffect } from 'react';
import { CurrencyContext, DashboardContext } from '@/Context';
import { Tooltip } from '@material-tailwind/react';

export function TransactionsTable({ className, allTransactions }: any) {

  const currencyFormatter = useContext(CurrencyContext);
  const dashboardContext = useContext(DashboardContext);

  const getFilteredItems = () => {
    let allTxn = allTransactions.slice();
    if (dashboardContext) {
      const { txnTableFilters } = dashboardContext;
      const { startDate, endDate, categories, notCategories } = txnTableFilters.state;
      if (startDate) {
        allTxn = allTxn.filter((txn: any) => new Date(txn.date) >= new Date(startDate));
      }
      if (endDate) {
        allTxn = allTxn.filter((txn: any) => new Date(txn.date) <= new Date(endDate));
      }
      if (categories) {
        allTxn = allTxn.filter((txn: any) => categories.includes(txn.category));
      }
      if (notCategories) {
        allTxn = allTxn.filter((txn: any) => !notCategories.includes(txn.category))
      }
    }
    return allTxn.sort((a: any, b: any) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
  }


  return (
    <button className={className}>
      <div className="flex flex-col h-full items-start">
        <div className="mb-5 text-sm font-bold">Transactions Table</div>
        <div className="p-4 flex flex-col grow h-10 w-full">
          <div className="grow w-full ">
            <table className="w-full h-full flex flex-col">
              <thead className="rounded-tl-xl rounded-tr-xl sticky top-0 bg-zinc-800 w-full">
                <tr className="table text-zinc-500 text-left w-full">
                  <th className="w-5/12 p-3 py-4">Name</th>
                  <th className="w-3/12 p-3 py-4">Date</th>
                  <th className="w-4/12 p-3 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="block overflow-y-auto h-96 grow text-zinc-400 text-left scrollbar-thumb-zinc-700 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-xl">
                {allTransactions && getFilteredItems().map((txn: any) => {
                  return (
                    <tr key={txn.transaction_id} className="transition-all duration-300 hover:bg-sky-200 hover:bg-opacity-10">
                      <td className="w-5/12 border-b border-zinc-700 p-3">{txn.name}</td>
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
    </button>
  )
}