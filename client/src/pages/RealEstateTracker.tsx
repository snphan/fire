import React, { useEffect } from 'react';
import { GET_USER_BY_ID } from '@/queries';
import { useLazyQuery, useQuery } from '@apollo/client';


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
      {REAssetData?.getUserById.re_asset.map((item: any) => {
        console.log(item);
        return (<p className="ml-10 m-5">{JSON.stringify(item)}</p>);
      })}
    </div>
  )
}