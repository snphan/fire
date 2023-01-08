import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export function AddREAssetForm({ open, handleOpen }: any) {
  return (
    <Dialog open={open} handler={handleOpen} className="bg-slate-100 h-44 w-1/2">
      <DialogHeader>Its a simple dialog.</DialogHeader>
      <DialogBody>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ad
        reprehenderit omnis perspiciatis aut odit! Unde architecto
        perspiciatis, dolorum dolorem iure quia saepe autem accusamus eum
        praesentium magni corrupti explicabo!
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleOpen}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}