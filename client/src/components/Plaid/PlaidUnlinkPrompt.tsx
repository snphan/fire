import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from '@material-tailwind/react';
import { PLAID_GET_BANK_NAMES } from '@/queries';
import { PLAID_UNLINK_BANK } from '@/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { DashboardContext } from '@/Context';


export function PlaidUnlinkPrompt({ openPlaidUnlink, setOpenPlaidUnlink }: any) {

  const dashboardContext = useContext(DashboardContext);

  const [unlinkBankNames, setUnlinkBankNames] = useState<string[]>([]);
  const { data: bankNames } = useQuery(PLAID_GET_BANK_NAMES);
  const [unlinkBankAccount] = useMutation<any>(PLAID_UNLINK_BANK, {
    refetchQueries: dashboardContext()?.refetchQueries
  });

  return (
    <Dialog open={openPlaidUnlink} handler={() => { setOpenPlaidUnlink(!openPlaidUnlink); setUnlinkBankNames([]) }} className="bg-zinc-800 max-h-screen overflow-auto">
      <DialogHeader className="text-gray-100">Unlink Accounts</DialogHeader>
      <DialogBody className="text-gray-200 grid grid-cols-2">
        {bankNames ?
          bankNames.getBankNames.map((name: string) =>
            <Checkbox
              onChange={(e) => {
                const bankName = e.target.id;
                if (unlinkBankNames.includes(bankName)) {
                  setUnlinkBankNames(unlinkBankNames.filter((item) => item !== bankName));
                } else {
                  setUnlinkBankNames(unlinkBankNames.concat([bankName]));
                }
              }}
              color="red" icon={<span className="material-icons text-sm">close</span>} labelProps={{ className: "!text-gray-100" }} id={name} key={name} label={name}></Checkbox>
          )
          :
          <div>No banks to display</div>
        }
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => {
            setOpenPlaidUnlink(false);
            setUnlinkBankNames([]);
          }}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={() => {
            unlinkBankAccount({
              variables: { bankNames: unlinkBankNames },
              onCompleted: dashboardContext()?.sync()
            })
            setOpenPlaidUnlink(false);
            setUnlinkBankNames([]);
          }}
          className="mr-1"
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )

}