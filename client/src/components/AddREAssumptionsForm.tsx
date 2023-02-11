import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Tooltip
} from "@material-tailwind/react";
import { REACT_APP_MEDIA_HOST } from '@/config';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_REASSET, UPDATE_REASSUMPTION } from '@/mutations';
import { GET_USER_BY_ID } from '@/queries';


export function AddREAssumptionsForm({ currentAsset, setCurrentAsset, assumptions, className }: any) {

  const [newAssumptions, setNewAssumptions] = useState(JSON.parse(JSON.stringify(assumptions))); // create a state so that we can directly update assumptions.
  const otherExpensePlaceholder = JSON.parse(JSON.stringify(newAssumptions.other_expenses));
  const [updateREAssumption, { loading: updateLoading }] = useMutation(UPDATE_REASSUMPTION)

  useEffect(() => {
    setCurrentAsset({ ...currentAsset, re_assumptions: newAssumptions })
  }, [newAssumptions])

  return (
    <div className={(className ? className : "") + " flex flex-col"}>
      <div className="flex justify-between">
        <h4 className='font-bold m-2'>Assumptions</h4>
        <Tooltip content={"Save to Database"} className="capitalize bg-gray-900 p-2">
          <Button className="m-2 p-2 px-4" color="blue" variant="gradient"
            onClick={() => {
              const { id, __typename, ...assumptionData } = newAssumptions
              updateREAssumption({
                variables: {
                  assumptionId: id,
                  updateReAssumptionsData: { ...assumptionData, reAssetId: currentAsset.id }
                }
              });
            }}
          >
            <span className="material-icons text-gray-300 text-3xl">save</span>
          </Button>
        </Tooltip>
      </div>

      <div className="ml-4">Hold Length</div>

      <div className="flex mx-4 my-2 w-full gap-3">
        <input id="holdlength" className="w-1/4" onChange={(e) => setNewAssumptions({ ...newAssumptions, hold_length: parseInt(e.target.value) })} value={newAssumptions.hold_length} type="range" min="1" max="100" step="1" />
        <label className="text-blue-gray-400" htmlFor="holdlength">{newAssumptions.hold_length} {(newAssumptions.hold_length === 1) ? "Year" : "Years"}</label>
      </div>

      <div className="ml-4">Up-Front</div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, closing_cost: parseFloat(e.target.value) })} value={newAssumptions.closing_cost} type="number" variant="outlined" label="Closing Costs" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, down_percent: parseFloat(e.target.value) })} value={newAssumptions.down_percent} type="number" variant="outlined" label="Down Percent" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, mortgage_length: parseFloat(e.target.value) })} value={newAssumptions.mortgage_length} type="number" variant="outlined" label="Mortgage Length" className="!text-gray-300" ></Input>
      </div>

      <div className="ml-4">Market Forces</div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, inflation: parseFloat(e.target.value) })} value={newAssumptions.inflation} type="number" variant="outlined" label="Inflation %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, interest_rate: parseFloat(e.target.value) })} value={newAssumptions.interest_rate} type="number" variant="outlined" label="Interest Rate %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, property_inc: parseFloat(e.target.value) })} value={newAssumptions.property_inc} type="number" variant="outlined" label="Property Increase %" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, rent_inc: parseFloat(e.target.value) })} value={newAssumptions.rent_inc} type="number" variant="outlined" label="Rent Increase %" className="!text-gray-300" ></Input>

      </div >

      <div className="ml-4">Operation</div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-hidden">
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, rent: parseFloat(e.target.value) })} value={newAssumptions.rent} type="number" variant="outlined" label="Rent" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, insurance: parseFloat(e.target.value) })} value={newAssumptions.insurance} type="number" variant="outlined" label="Insurance" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, maintenance_fee: parseFloat(e.target.value) })} value={newAssumptions.maintenance_fee} type="number" variant="outlined" label="Maintenance Fee (Month)" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, utilities: parseFloat(e.target.value) })} value={newAssumptions.utilities} type="number" variant="outlined" label="Utilities" className="!text-gray-300" ></Input>
        <Tooltip content={"Comma Separated"} className="capitalize bg-gray-900 p-2">
          <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, other_expenses: e.target.value.split(",").map((item: string) => (item ? parseFloat(item) : 0)) })} value={otherExpensePlaceholder.join(",")} variant="outlined" label="Other Expenses (Month)" className="!text-gray-300"></Input>
        </Tooltip>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, property_tax: parseFloat(e.target.value) })} value={newAssumptions.property_tax} type="number" variant="outlined" label="Property Tax (Year)" className="!text-gray-300" ></Input>
        <Input onChange={(e) => setNewAssumptions({ ...newAssumptions, repairs: parseFloat(e.target.value) })} value={newAssumptions.repairs} type="number" variant="outlined" label="Repairs %" className="!text-gray-300" ></Input>
      </div >
    </div>
  )
}