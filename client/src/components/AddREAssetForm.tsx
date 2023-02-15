import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { REACT_APP_MEDIA_HOST } from '@/config';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_REASSET } from '@/mutations';
import { GET_USER_BY_ID } from '@/queries';

interface REAsset {
  userId: number;
  purchase_price: number;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  country: string;
  picture_links: string[];
  purchase_date: Date;
  favorite: boolean;
  tracking: boolean;
  bedrooms: number;
  bathrooms: number;
}


export function AddREAssetForm({ open, handleOpen, userID }: any) {

  const [createREAsset, { loading: createREAssetLoading }] = useMutation(CREATE_REASSET, {
    refetchQueries: [
      { query: GET_USER_BY_ID, variables: { userID: userID } }
    ]
  });

  const defaultREAsset: REAsset = {
    userId: userID,
    purchase_price: 0,
    address: "",
    postal_code: "",
    city: "",
    province: "",
    country: "",
    picture_links: [],
    purchase_date: new Date(),
    favorite: false,
    tracking: false,
    bedrooms: 0,
    bathrooms: 0
  }

  const uploadFiles = (files: FileList) => {
    console.log("Sending Files");
    let formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    })
    console.log(formData);
    return axios.post(`${REACT_APP_MEDIA_HOST}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  const [REAssetInfo, setREAssetInfo] = useState<REAsset>(JSON.parse(JSON.stringify(defaultREAsset)));

  return (
    <Dialog size="lg" open={open} handler={handleOpen} className="bg-zinc-800 max-h-screen overflow-auto lg:w-auto w-full m-0 max-w-full">
      <DialogHeader className="text-zinc-100">Add a Property</DialogHeader>
      <DialogBody className="text-zinc-200 flex flex-col">

        <div className="flex flex-wrap flex-col mx-3 mb-6">
          <div className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
          >Pictures</div>
          <div className="flex flex-wrap">
            <label htmlFor="Pictures" className="m-1 cursor-pointer hover:scale-105 hover:bg-zinc-400 w-24 h-24 bg-zinc-600 flex items-center justify-center rounded-xl"><span className="material-icons">photo_camera</span></label>
            {REAssetInfo.picture_links.map((link: string) => {
              return <img key={link} className='m-1 rounded-xl w-24 h-24' src={`${REACT_APP_MEDIA_HOST}/media/${link}`} alt="" />
            })}
          </div>
          <input className="hidden"
            type="file" multiple name="" id="Pictures" onChange={async (e) => {
              if (e.target.files) {
                const { picture_links } = REAssetInfo;
                uploadFiles(e.target.files!).then((res) => {
                  setREAssetInfo({ ...REAssetInfo, picture_links: [...picture_links, ...res.data.filenames] });
                }
                );
              }
            }} />
        </div>

        <div className="flex flex-wrap mx-3 mb-6">
          <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
            htmlFor="Purchase Price">Purchase Price</label>
          <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
            type="text" name="" id="Purchase Price" value={REAssetInfo.purchase_price} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, purchase_price: e.target.value ? parseInt(e.target.value) : 0 }))} />
        </div>

        <div className="flex flex-wrap mx-3 mb-6">
          <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
            htmlFor="Address">Address</label>
          <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
            type="text" name="" id="Address" value={REAssetInfo.address} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, address: e.target.value }))} />
        </div>

        <div className="flex flex-wrap mx-3 mb-6">
          <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
            htmlFor="PostalCode">Postal Code</label>
          <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
            type="text" name="" id="PostalCode" value={REAssetInfo.postal_code} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, postal_code: e.target.value }))} />
        </div>


        <div className="flex">
          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="bedrooms">bedrooms</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="number" name="" id="bedrooms" value={REAssetInfo.bedrooms} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, bedrooms: e.target.value ? parseInt(e.target.value) : 0 }))} />
          </div>
          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="bathrooms">bathrooms</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="number" name="" id="bathrooms" value={REAssetInfo.bathrooms} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, bathrooms: e.target.value ? parseInt(e.target.value) : 0 }))} />
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="City">City</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="text" name="" id="City" value={REAssetInfo.city} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, city: e.target.value }))} />
          </div>

          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="Province">Province</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="text" name="" id="Province" value={REAssetInfo.province} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, province: e.target.value }))} />
          </div>

          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="Country">Country</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="text" name="" id="Country" value={REAssetInfo.country} onChange={(e) => setREAssetInfo(({ ...REAssetInfo, country: e.target.value }))} />
          </div>
        </div>

        <div className="flex">
          <div className="flex flex-wrap mx-3 mb-6">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="purchase_date">Purchase Date</label>
            <input className="appearance-none block w-full text-lg bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-zinc-500"
              type="date" name="" defaultValue={REAssetInfo.purchase_date.toString().substring(0, 10)} id="purchase_date" onChange={(e) => {
                setREAssetInfo({ ...REAssetInfo, purchase_date: new Date(e.target.value) });
              }} />
          </div>
        </div>

        <div className="flex mx-3 mb-6">
          <div className="flex flex-col mx-3">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="favorite">favorite</label>
            <input className="w-5 h-5 m-2"
              type="checkbox" name="" checked={REAssetInfo.favorite} id="favorite" onChange={(e) => { setREAssetInfo({ ...REAssetInfo, favorite: e.target.checked }) }} />
          </div>
          <div className="flex flex-col mx-3">
            <label className="block uppercase tracking-wide text-zinc-500 text-xs font-bold mb-2"
              htmlFor="tracking">tracking</label>
            <input className="w-5 h-5 m-2"
              type="checkbox" name="" checked={REAssetInfo.tracking} id="tracking" onChange={(e) => setREAssetInfo(({ ...REAssetInfo, tracking: e.target.checked }))} />
          </div>
        </div>

      </DialogBody>
      {/* Pad the bottom because browsers have seearch bar on the bottom... */}
      <DialogFooter className="pb-36">
        <Button
          variant="text"
          color="red"
          onClick={() => {
            setREAssetInfo(JSON.parse(JSON.stringify(defaultREAsset)));
            handleOpen();
          }}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={() => {
          createREAsset({ variables: { reAssetData: REAssetInfo } });
          setREAssetInfo(JSON.parse(JSON.stringify(defaultREAsset)));
          handleOpen();
        }}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}