import { DELETE_REASSET } from '@/mutations';
import { GET_USER_BY_ID } from '@/queries';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button
} from '@material-tailwind/react';
import { Loading } from '@/components/Loading';

export function DeleteREAssetDialog({ userID, assetID, setAssetID, setCurrentAsset, open, handleOpen }: any) {

  const [deleteAsset, { loading }] = useMutation(DELETE_REASSET, {
    refetchQueries: [
      { query: GET_USER_BY_ID, variables: { userID: userID } }
    ]
  });

  return (
    <Dialog size={window.screen.width > 1024 ? 'xs' : 'xl'} className="bg-zinc-900" open={open} handler={handleOpen}>
      {loading ?
        <Loading />
        :
        <>
          <DialogHeader className="text-zinc-300 font-ubuntu">Confirm Delete</DialogHeader>
          <DialogBody className="text-zinc-400 font-ubuntu">
            Are you sure you want to delete this Asset?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="gray"
              onClick={handleOpen}
              className="mr-2"
            >
              <span>Back</span>
            </Button>
            <Button variant="gradient" color="red" onClick={() => {
              deleteAsset({
                variables: { reAssetId: assetID },
                onCompleted: () => {
                  handleOpen();
                  setAssetID(null);
                  setCurrentAsset(null);
                }
              })
            }
            }>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </>
      }
    </Dialog>
  )
}