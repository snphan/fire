import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Tooltip
} from "@material-tailwind/react";
import { REACT_APP_MEDIA_HOST } from '@/config';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_REASSET } from '@/mutations';
import { GET_USER_BY_ID } from '@/queries';


export function AddREAssumptionsForm({ assumptions }: any) {

  const [newAssumptions, setNewAssumptions] = useState(JSON.parse(JSON.stringify(assumptions)));
  const otherExpensePlaceholder = JSON.parse(JSON.stringify(newAssumptions.other_expenses));

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <h4 className='font-bold m-2'>Assumptions</h4>
        <Tooltip content={"Save to Database"} className="capitalize bg-gray-900 p-2">
          <Button className="m-2 p-2 px-4" color="blue"><span className="material-icons text-gray-300 text-3xl">save</span></Button>
        </Tooltip>
      </div>

      <div className="ml-4">Up-Front Costs</div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, closing_cost: e.target.value })} value={newAssumptions.closing_cost} type="number" variant="outlined" label="Closing Costs" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, down_percent: e.target.value })} value={newAssumptions.down_percent} type="number" variant="outlined" label="Down Percent" className="!text-gray-300" ></Input>
      </div>

      <div className="ml-4">Market Forces</div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, inflation: e.target.value })} value={newAssumptions.inflation} type="number" variant="outlined" label="Inflation %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, interest_rate: e.target.value })} value={newAssumptions.interest_rate} type="number" variant="outlined" label="Interest Rate %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, property_inc: e.target.value })} value={newAssumptions.property_inc} type="number" variant="outlined" label="Property Increase %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, rent_inc: e.target.value })} value={newAssumptions.rent_inc} type="number" variant="outlined" label="Rent Increase %" className="!text-gray-300" ></Input>

      </div >

      <div className="ml-4">Operation</div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, rent: e.target.value })} value={newAssumptions.rent} type="number" variant="outlined" label="Rent" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, insurance: e.target.value })} value={newAssumptions.insurance} type="number" variant="outlined" label="Insurance" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, maintenance_fee: e.target.value })} value={newAssumptions.maintenance_fee} type="number" variant="outlined" label="Maintenance Fee (Month)" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, utilities: e.target.value })} value={newAssumptions.utilities} type="number" variant="outlined" label="Utilities" className="!text-gray-300" ></Input>
        <Tooltip content={"Comma Separated"} className="capitalize bg-gray-900 p-2">
          <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, other_expenses: e.target.value.split(",").map((item: string) => (item ? parseFloat(item) : 0)) })} value={otherExpensePlaceholder.join(",")} variant="outlined" label="Other Expenses (Month)" className="!text-gray-300"></Input>
        </Tooltip>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, property_tax: e.target.value })} value={newAssumptions.property_tax} type="number" variant="outlined" label="Property Tax (Year)" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, repairs: e.target.value })} value={newAssumptions.repairs} type="number" variant="outlined" label="Repairs %" className="!text-gray-300" ></Input>
      </div >
    </div>
  )
}