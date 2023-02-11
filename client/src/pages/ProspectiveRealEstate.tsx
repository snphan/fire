import React, { useEffect, useState } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { REListItem } from '@/components/REListItem';
import {
  Button,
  Tooltip,
} from '@material-tailwind/react';
import { AddREAssetForm } from '@/components/AddREAssetForm';
import { AddREAssumptionsForm } from '@/components/AddREAssumptionsForm';
import { DeleteREAssetDialog } from '@/components/DeleteREAssetDialog';
import { Loading } from '@/components/Loading';
import Carousel from '@/components/Carousel';
import { REACT_APP_MEDIA_HOST } from '@/config';
import { CREATE_REASSUMPTION } from '@/mutations';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { fireTheme } from '@/config/echart.config';
import { REAnalyzer } from '@/utils/re_analysis';

echarts.registerTheme('my_theme', fireTheme);
const CADFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function ProspectiveRealEstate({ userID }: any) {

  const { data: REAssetData, loading, error, refetch: refetchData } = useQuery(GET_USER_BY_ID);
  const [createREAssumption, { loading: REAssumptionLoading }] = useMutation(CREATE_REASSUMPTION);
  const [openAddREAsset, setOpenAddREAsset] = useState<boolean>(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false);
  const [assetID, setAssetID] = useState<number | null>(null);
  const [currentAsset, setCurrentAsset] = useState<any>(null);

  const handleOpenAddREAsset = () => setOpenAddREAsset(!openAddREAsset);
  const handleOpenConfirmDelete = () => setOpenConfirmDelete(!openConfirmDelete);

  const reAnalyzer = currentAsset?.re_assumptions && new REAnalyzer(currentAsset);

  const projectionOptions = currentAsset?.re_assumptions && {
    xAxis: {
      type: 'category',
      data: [...Array(currentAsset.re_assumptions.hold_length + 1).keys()].map((item) => {
        let date = new Date();
        date.setFullYear(date.getFullYear() + item);
        return date.toISOString().split('T')[0];
      }),
      name: "Date",
      nameGap: 30,
      nameLocation: "center"
    },
    yAxis: {
      type: 'value',
      name: 'Dollars ($)'
    },
    legend: {
      data: ['Stocks (8%)', 'RE Cumulative Cashflow', 'RE Cashflow']
    },
    series: [
      {
        data: [...Array(currentAsset.re_assumptions.hold_length + 1).keys()].map((item) => {
          return Math.round(reAnalyzer.totalOutOfPocket * Math.pow(1.08, item));
        }),
        type: 'line',
        smooth: true,
        name: 'Stocks (8%)'
      },
      {
        data: reAnalyzer.cashFlowCumulative,
        type: 'line',
        smooth: true,
        name: 'RE Cumulative Cashflow'
      },
      {
        data: [...[0], ...reAnalyzer.cashFlow],
        type: 'line',
        smooth: true,
        name: 'RE Cashflow'
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  useEffect(() => {
    refetchData({ userID: userID });
  }, [userID])

  useEffect(() => {
    if (assetID) {
      setCurrentAsset(REAssetData?.getUserById.re_asset.filter((item: any) => (item.id === assetID))?.at(0));
    }
  }, [assetID, REAssetData])

  if (error) return <p>{`Error! ${error}`}</p>;

  return (
    <>
      <div className="lg:ml-24 min-h-screen max-w-screen lg:overflow-hidden">
        {!currentAsset ? // List View occurs if no REAsset is selected
          /* List view for Prospective Real Estate */
          <>
            <div className="flex items-between lg:items-center lg:ml-2">
              <h1 className="text-base ml-14 lg:ml-5 lg:text-5xl ">Real Estate</h1>
              <div className="grow"></div>
              <Tooltip content={"Add"} className="capitalize bg-gray-900 p-2">
                <span onClick={handleOpenAddREAsset} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-3xl lg:text-5xl material-icons material-symbols-outlined">add</span>
              </Tooltip>
            </div>
            {loading ?
              <Loading className="w-36 h-36" />
              :
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {REAssetData?.getUserById.re_asset.map((item: any) => {
                  const { id } = item;
                  return (<REListItem
                    className="items-center"
                    key={item.id}
                    REInfo={item} onClick={() => {
                      setAssetID(id);
                    }} />);
                })}
              </div>
            }
          </>
          :
          /* Property Analysis Detail View */
          <div className="flex flex-col min-h-screen">

            <header className="flex items-center">
              <Tooltip content={"Back"} className="capitalize bg-gray-900 p-2">
                <div className="z-[51] fixed lg:z-auto mx-2 hover:bg-gray-700 hover:scale-105 bg-zinc-800 rounded-full cursor-pointer w-12 h-12 flex justify-center items-center"
                  onClick={() => { /* Go Back to list view */ setAssetID(null); setCurrentAsset(null); }} >
                  <span className="material-icons lg:text-4xl">arrow_back</span>
                </div>
              </Tooltip>
              <h1>Property Analysis</h1>
              <div className="grow"></div>
              <Tooltip content={"Delete"} className="capitalize bg-gray-900 p-2">
                <div className="transition-all mr-5 hover:bg-gradient-to-tr hover:from-pink-800 hover:to-pink-500 hover:bg-red-700 hover:shadow-pink-300/20 hover:scale-105 rounded-full cursor-pointer w-12 h-12 flex justify-center items-center"
                  onClick={() => {
                    handleOpenConfirmDelete();
                    /* Go Back to list view */
                  }} >
                  <span className="material-icons lg:text-4xl">delete</span>
                </div>
              </Tooltip>
            </header>

            <div className='grid grid-cols-3'>
              <Carousel className="col-span-1 row-span-3 bg-zinc-900 mx-5 rounded-xl p-2 h-96">
                {
                  currentAsset?.picture_links.map((link: string, index: number) => {
                    return (<Carousel.Item key={index} imgSrc={`${REACT_APP_MEDIA_HOST}/media/${link}`}>
                    </Carousel.Item>)
                  })
                }
              </Carousel>
              <div className="col-span-2 row-span-4 bg-zinc-900 mr-5 mb-5 rounded-xl drop-shadow-strong">
                <div className="flex flex-col justify-between h-full">
                  <h4 className='font-bold m-2'>Projection</h4>
                  {currentAsset?.re_assumptions &&
                    <>
                      <ReactECharts theme="my_theme" style={{ height: "65%" }} option={projectionOptions} />
                      <div id='quickstats' className="m-4 flex flex-wrap justify-between">
                        <Tooltip content={"Total Out of Pocket"} className="capitalize bg-gray-900 p-2">
                          <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-pink-300/20 shadow-md hover:shadow-lg hover:shadow-pink-300/20 bg-gradient-to-tr from-pink-800 to-pink-500 text-gray-200">
                            <div><span className="material-icons material-symbols-outlined">point_of_sale</span></div>
                            <div className="font-bold">{"-" + CADFormatter.format(reAnalyzer.totalOutOfPocket)}</div>
                          </div>
                        </Tooltip>
                        <div className="w-1 bg-zinc-400 rounded-xl"></div>
                        <Tooltip content={"Mortgage Payment (Month)"} className="capitalize bg-gray-900 p-2">
                          <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-pink-300/20 shadow-md hover:shadow-lg hover:shadow-pink-300/20 bg-gradient-to-tr from-pink-800 to-pink-500 text-gray-200">
                            <div><span className="material-icons material-symbols-outlined">house</span></div>
                            <div className="font-bold">{"-" + CADFormatter.format(reAnalyzer.mortgagePayment)}</div>
                          </div>
                        </Tooltip>
                        <Tooltip content={"Average Total Operating Expense"} className="capitalize bg-gray-900 p-2">
                          <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-pink-300/20 shadow-md hover:shadow-lg hover:shadow-pink-300/20 bg-gradient-to-tr from-pink-800 to-pink-500 text-gray-200">
                            <div><span className="material-icons material-symbols-outlined">lightbulb</span></div>
                            <div className="font-bold">{"-" + CADFormatter.format(reAnalyzer.avgTotalOpExpense)}</div>
                          </div>
                        </Tooltip>
                        <Tooltip content={"Average Rent (Month)"} className="capitalize bg-gray-900 p-2">
                          <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-light-green-300/20 shadow-md hover:shadow-lg hover:shadow-light-green-300/20 bg-gradient-to-tr from-light-green-800 to-light-green-500 text-gray-200">
                            <div><span className="material-icons material-symbols-outlined">attach_money</span></div>
                            <div className="font-bold">{"+" + CADFormatter.format(reAnalyzer.avgRent)}</div>
                          </div>
                        </Tooltip>
                        <div className="w-1 bg-zinc-400 rounded-xl"></div>
                        {(reAnalyzer.avgRent - (reAnalyzer.avgTotalOpExpense + reAnalyzer.mortgagePayment) >= 0) ?

                          <Tooltip content={"Profit"} className="capitalize bg-gray-900 p-2">
                            <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-light-green-300/20 shadow-md hover:shadow-lg hover:shadow-light-green-300/20 bg-gradient-to-tr from-light-green-800 to-light-green-500 text-gray-200">
                              <div><span className="material-icons material-symbols-outlined">payment</span></div>
                              <div className="font-bold">{"+" + CADFormatter.format(reAnalyzer.avgRent - (reAnalyzer.avgTotalOpExpense + reAnalyzer.mortgagePayment))}</div>
                            </div>
                          </Tooltip>
                          :
                          <Tooltip content={"Loss"} className="capitalize bg-gray-900 p-2">
                            <div className="p-2 flex flex-col justify-center items-center h-20 rounded-xl shadow-pink-300/20 shadow-md hover:shadow-lg hover:shadow-pink-300/20 bg-gradient-to-tr from-pink-800 to-pink-500 text-gray-200">
                              <div><span className="material-icons material-symbols-outlined">payment</span></div>
                              <div className="font-bold">{CADFormatter.format(reAnalyzer.avgRent - (reAnalyzer.avgTotalOpExpense + reAnalyzer.mortgagePayment))}</div>
                            </div>
                          </Tooltip>
                        }
                      </div>
                    </>
                  }
                </div>
              </div>
              <REListItem
                className="col-span-1 row-span-1 items-center"
                REInfo={currentAsset} disabled
              />
            </div>


            {currentAsset?.re_assumptions ?
              <div className="rounded-xl grow mx-5 mb-5 bg-zinc-900 drop-shadow-strong">
                <AddREAssumptionsForm currentAsset={currentAsset} setCurrentAsset={setCurrentAsset} assumptions={currentAsset.re_assumptions}></AddREAssumptionsForm>
              </div>
              :
              // If server crashes when asset is being created, this is a fall back
              <div className="rounded-xl grow mx-5 mb-5 flex justify-center items-center bg-gray-800 drop-shadow-strong">
                <Button onClick={() => createREAssumption({
                  variables: { reAssumptionsData: { reAssetId: assetID } },
                  onCompleted: () => {
                    refetchData({ userID: userID });
                  }
                })}>Create Assumptions</Button>
              </div>
            }
          </div>
        }
      </div>
      <AddREAssetForm open={openAddREAsset} handleOpen={handleOpenAddREAsset} userID={userID} />
      <DeleteREAssetDialog
        userID={userID}
        assetID={assetID}
        setAssetID={setAssetID}
        setCurrentAsset={setCurrentAsset}
        open={openConfirmDelete}
        handleOpen={handleOpenConfirmDelete} />
    </>
  )
}