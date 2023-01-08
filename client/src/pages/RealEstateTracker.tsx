import React, { useEffect } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useQuery } from '@apollo/client';
import { REListItem } from '@/components/REListItem';


export function RealEstateTracker({ userID }: any) {

  const { data: REAssetData, loading, error, refetch: refetchData } = useQuery(GET_USER_BY_ID);

  useEffect(() => {
    refetchData({ userID: userID });
  }, [userID])

  if (loading) return <p>Loading!</p>;
  if (error) return <p>{`Error! ${error}`}</p>;

  return (
    <div className="ml-24 min-h-screen">
      <div className="flex ml-2">
        <h1>Real Estate Tracker</h1>
        <div className="grow"></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
        {REAssetData?.getUserById.re_asset.map((item: any) => {
          return (<REListItem REInfo={item} />);
        })}
      </div>
    </div>
  )
}