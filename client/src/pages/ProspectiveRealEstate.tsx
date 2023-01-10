import React, { useEffect, useState } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { REListItem } from '@/components/REListItem';
import { Tooltip } from '@material-tailwind/react';
import { AddREAssetForm } from '@/components/AddREAssetForm';
import { Loading } from '@/components/Loading';

export function ProspectiveRealEstate({ userID }: any) {

  const { data: REAssetData, loading, error, refetch: refetchData } = useQuery(GET_USER_BY_ID);
  const [openAddREAsset, setOpenAddREAsset] = useState<boolean>(false);
  const [assetID, setAssetID] = useState<number | null>(null);

  const handleOpenAddREAsset = () => setOpenAddREAsset(!openAddREAsset);

  useEffect(() => {
    refetchData({ userID: userID });
  }, [userID])

  if (error) return <p>{`Error! ${error}`}</p>;

  return (
    <>
      <div className="ml-24 min-h-screen">
        {!assetID ?
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
                return (<REListItem key={item.id} REInfo={item} onClick={() => {
                  console.log("REasset Selected: ", id);
                  setAssetID(id);
                  console.log(REAssetData);
                }} />);
              })}
            </div>
          </>
          :
          /* Property Analysis SubPage */
          <div className="flex flex-col ml-2">
            <div className="flex items-start">
              <div className="flex items-center">
                <Tooltip content={"Back"} className="capitalize bg-gray-900 p-2">
                  <div className="mx-2 hover:bg-gray-700 hover:scale-105  rounded-full cursor-pointer w-12 h-12 flex justify-center items-center"
                    onClick={() => { /* Go Back to list view */ setAssetID(null); }} >
                    <span className="material-icons text-4xl">arrow_back</span>
                  </div>
                </Tooltip>
                <h1>Property Analysis</h1>
              </div>
              <div className="grow"></div>
              {assetID &&
                <REListItem REInfo={REAssetData?.getUserById.re_asset.filter((item: any) => (item.id === assetID))?.at(0)} disabled />
              }
            </div>
          </div>
        }
      </div>
      <AddREAssetForm open={openAddREAsset} handleOpen={handleOpenAddREAsset} userID={userID} />
    </>
  )
}