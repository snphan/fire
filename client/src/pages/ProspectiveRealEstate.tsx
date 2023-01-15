import React, { useEffect, useState } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { REListItem } from '@/components/REListItem';
import { Button, Tooltip } from '@material-tailwind/react';
import { AddREAssetForm } from '@/components/AddREAssetForm';
import { AddREAssumptionsForm } from '@/components/AddREAssumptionsForm';
import { Loading } from '@/components/Loading';
import Carousel from '@/components/Carousel';
import { REACT_APP_MEDIA_HOST } from '@/config';
import { CREATE_REASSUMPTION } from '@/mutations';

export function ProspectiveRealEstate({ userID }: any) {

  const { data: REAssetData, loading, error, refetch: refetchData } = useQuery(GET_USER_BY_ID);
  const [createREAssumption, { loading: REAssumptionLoading }] = useMutation(CREATE_REASSUMPTION);
  const [openAddREAsset, setOpenAddREAsset] = useState<boolean>(false);
  const [assetID, setAssetID] = useState<number | null>(null);
  const [currentAsset, setCurrentAsset] = useState<any>(null);

  const handleOpenAddREAsset = () => setOpenAddREAsset(!openAddREAsset);

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
      <div className="ml-24 min-h-screen">
        {!currentAsset ? // List View occurs if no REAsset is selected
          /* List view for Prospective Real Estate */
          <>
            <div className="flex items-center ml-2">
              <h1>Prospective Real Estate</h1>
              <div className="grow"></div>
              <Tooltip content={"Add"} className="capitalize bg-gray-900 p-2">
                <span onClick={handleOpenAddREAsset} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-5xl material-icons material-symbols-outlined">add</span>
              </Tooltip>
            </div>
            {loading &&
              <Loading />
            }
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
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
          </>
          :
          /* Property Analysis SubPage */
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center">
              <Tooltip content={"Back"} className="capitalize bg-gray-900 p-2">
                <div className="mx-2 hover:bg-gray-700 hover:scale-105  rounded-full cursor-pointer w-12 h-12 flex justify-center items-center"
                  onClick={() => { /* Go Back to list view */ setAssetID(null); setCurrentAsset(null); }} >
                  <span className="material-icons text-4xl">arrow_back</span>
                </div>
              </Tooltip>
              <h1>Property Analysis</h1>
            </div>

            <div className='flex'>
              <div className="flex w-2/5 flex-col">
                <Carousel className="bg-gray-800 mx-5 rounded-xl p-2 h-96">
                  {
                    currentAsset?.picture_links.map((link: string, index: number) => {
                      return (<Carousel.Item key={index} imgSrc={`${REACT_APP_MEDIA_HOST}/media/${link}`}>
                      </Carousel.Item>)
                    })
                  }
                </Carousel>
                <REListItem
                  className="items-center"
                  REInfo={currentAsset} disabled
                />
              </div>
              <div className="grow bg-gray-800 mr-5 mb-5 rounded-xl drop-shadow-strong">
                <div className='font-bold m-2'>Projection</div>
              </div>
            </div>


            {currentAsset.re_assumptions ?
              <div className="rounded-xl grow mx-5 mb-5 bg-gray-800 drop-shadow-strong">
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
    </>
  )
}