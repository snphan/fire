import React, { useEffect, useState } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { REListItem } from '@/components/REListItem';
import { Tooltip } from '@material-tailwind/react';
import { AddREAssetForm } from '@/components/AddREAssetForm';


export function RealEstateTracker({ userID }: any) {

  const { data: REAssetData, loading, error, refetch: refetchData } = useQuery(GET_USER_BY_ID);
  const [openAddREAsset, setOpenAddREAsset] = useState<boolean>(false);

  const handleOpenAddREAsset = () => setOpenAddREAsset(!openAddREAsset);

  useEffect(() => {
    refetchData({ userID: userID });
  }, [userID])

  if (loading) return <p>Loading!</p>;
  if (error) return <p>{`Error! ${error}`}</p>;

  return (
    <>
      <div className="ml-24 min-h-screen">
        <div className="flex items-center ml-2">
          <h1>Real Estate Tracker</h1>
          <div className="grow"></div>
          <Tooltip content={"Add"} className="capitalize bg-gray-900 p-2">
            <span onClick={handleOpenAddREAsset} className="m-4 text-gray-600 hover:text-gray-200 cursor-pointer text-5xl material-icons material-symbols-outlined">add</span>
          </Tooltip>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {REAssetData?.getUserById.re_asset.map((item: any) => {
            return (<REListItem REInfo={item} />);
          })}
        </div>
      </div>
      <AddREAssetForm open={openAddREAsset} handleOpen={handleOpenAddREAsset} />
    </>
  )
}