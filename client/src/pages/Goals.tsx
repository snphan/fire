import { GET_GOALS, IS_BANKACCOUNT_LINKED } from '@/queries';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { Loading } from '@/components/Loading';
import Carousel from '@/components/Carousel';
export function Goals({ }: any) {

  const { data: goals } = useQuery(GET_GOALS);
  const { data: isBankLinked, loading: isBankLinkedLoading } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const [openAddGoal, setOpenAddGoal] = useState<boolean>(false);

  const handleOpenAddGoal = () => {
    setOpenAddGoal(!openAddGoal);
  }

  useEffect(() => {
    console.log(goals);
    console.log(isBankLinked);
  }, [goals, isBankLinked])

  return (
    <>
      <div className="lg:ml-24 flex flex-col min-h-screen min-w-0 max-w-full lg:overflow-hidden">
        <h1>
          My Goals
        </h1>
        {goals?.length ?
          <div>
            Some Chart!
          </div>
          :
          <>
            <div className="grow"></div>
            <div className="flex flex-col justify-center items-center">
              <div className="text-2xl font-bold m-2">Hello There! 👋</div>
              <h4 className="m-6 mx-10 leading-loose text-lg text-justify font-thin">It doesn't look like you have any <span className="font-bold">Goals</span> set up. Click "Get Started" below to get started.</h4>
              <Button size="lg" onClick={handleOpenAddGoal}>Get Started</Button>

            </div>
            <div className="grow"></div>
          </>
        }
      </div>
      <Dialog size={window.screen.width > 1024 ? 'xs' : 'xl'} className="absolute top-2 right-2 left-2 bg-zinc-900 w-auto max-w-full lg:max-w-[25%] lg:right-auto lg:left-auto lg:top-auto h-3/4 flex flex-col" open={openAddGoal} handler={handleOpenAddGoal}>
        {isBankLinkedLoading ?
          <Loading />
          :
          <>
            <DialogHeader className="text-zinc-300 font-ubuntu">Add a goal!</DialogHeader>
            <DialogBody className="text-zinc-400 font-ubuntu grow">
              <Carousel className="w-full" noLoop arrowPos="bottom">
                <Carousel.Item>Hi world</Carousel.Item>
                <Carousel.Item>Hi world 2</Carousel.Item>
                <Carousel.Item>Hi world 3</Carousel.Item>

              </Carousel>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="text"
                color="gray"
                onClick={handleOpenAddGoal}
                className="mr-2"
              >
                <span>Back</span>
              </Button>
              <Button variant="gradient" color="green" onClick={() => { }}>
                <span>Add</span>
              </Button>
            </DialogFooter>
          </>
        }
      </Dialog>

    </>
  )
}
