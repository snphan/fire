import React, { useEffect, useState } from 'react';
import {
  Button,
  Input
} from "@material-tailwind/react";
import { REACT_APP_MEDIA_HOST } from '@/config';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_REASSET } from '@/mutations';
import { GET_USER_BY_ID } from '@/queries';


export function AddREAssumptionsForm({ setAssumptions, assumptions }: any) {

  return (
    <div className="flex flex-col">
      <h4 className='font-bold m-2'>Assumptions</h4>

      <div className="ml-4">Up-Front Costs</div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Input variant="outlined" label="Closing Costs" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Down Percent" className="!text-gray-300" ></Input>
      </div>

      <div className="ml-4">Market Forces</div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Input variant="outlined" label="Inflation %" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Interest Rate %" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Property Increase %" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Rent Increase %" className="!text-gray-300" ></Input>

      </div >

      <div className="ml-4">Operation</div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Input variant="outlined" label="Rent" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Insurance" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Maintenance Fee (Month)" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Other Expenses (Month)" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Property Tax (Year)" className="!text-gray-300" ></Input>
        <Input variant="outlined" label="Repairs %" className="!text-gray-300" ></Input>
      </div >
    </div>
  )
}