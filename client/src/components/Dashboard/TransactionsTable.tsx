import React, { useEffect } from 'react';

export function TransactionsTable({ className, allTransactions }: any) {

  return (
    <button className={className}>
      <div className="flex flex-col h-full items-start">
        <div className="mb-5 text-sm font-bold">Transactions Table</div>
        <div className="p-4 flex flex-col grow h-10 w-full">
          <div className="grow w-full ">
            <table className="w-full h-full flex flex-col">
              <thead className="rounded-tl-xl rounded-tr-xl sticky top-0 bg-zinc-800 w-full">
                <tr className="table text-zinc-500 text-left w-full">
                  <th className="w-2/5 p-3 py-4">Name</th>
                  <th className="w-2/5 p-3 py-4">Date</th>
                  <th className="w-1/5 p-3 py-4">Amount</th>
                </tr>
              </thead>
              <tbody className="block overflow-y-auto h-96 grow text-zinc-400 text-left scrollbar-thumb-zinc-700 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded-xl">
                {allTransactions?.slice().sort((a: any, b: any) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime()).map((txn: any) => {
                  return (
                    <tr key={txn.transaction_id} className="transition-all duration-300 hover:bg-sky-200 hover:bg-opacity-10">
                      <td className="w-2/5 border-b border-zinc-700 p-3">{txn.name}</td>
                      <td className="w-2/5 border-b border-zinc-700 p-3">{txn.date.split("T")[0]}</td>
                      <td className="w-1/5 border-b border-zinc-700 p-3">{txn.amount}</td>
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