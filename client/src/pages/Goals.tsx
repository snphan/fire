import { GET_GOALS, IS_BANKACCOUNT_LINKED, PLAID_GET_ACCOUNTS } from '@/queries';
import { useQuery } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Input } from '@material-tailwind/react';
import { Loading } from '@/components/Loading';
import Carousel from '@/components/Carousel';
import { CurrencyContext } from '@/Context';

export function Goals({ }: any) {

  const currencyFormatter = useContext(CurrencyContext);
  const { data: goals } = useQuery(GET_GOALS);
  const { data: isBankLinked, loading: isBankLinkedLoading } = useQuery<any>(IS_BANKACCOUNT_LINKED);
  const { data: balanceData, loading: loadingBalance, refetch: refetchBalance } = useQuery<any>(PLAID_GET_ACCOUNTS);
  const [openAddGoal, setOpenAddGoal] = useState<boolean>(false);
  const [createGoalData, setCreateGoalData] = useState<any>({
    id: undefined,
    name: '',
    track_accounts: [],
    due_date: '',
    goal_amount: '',
    start_save_from: ''
  });

  const handleOpenAddGoal = () => {
    setOpenAddGoal(!openAddGoal);
  }

  const calculateSavingsRate = () => {
    const goalAmount = parseFloat(createGoalData.goal_amount);
    const startCash = parseFloat(createGoalData.start_save_from);
    const dueDate = new Date(createGoalData.due_date);
    const today = new Date();

    let totalMonths = (dueDate.getFullYear() - today.getFullYear()) * 12;
    totalMonths -= today.getMonth();
    totalMonths += dueDate.getMonth();

    return totalMonths <= 0 ? "Invalid Due Date" : currencyFormatter.format((goalAmount - startCash) / (totalMonths)) + "/mo.";
  }

  useEffect(() => {
    console.log(goals);
    console.log(isBankLinked);
  }, [goals])

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
      <Dialog size={window.screen.width > 1024 ? 'xs' : 'xl'} className="rounded-3xl absolute top-2 right-2 left-2 bg-zinc-900 w-auto max-w-full lg:max-w-[25%] lg:right-auto lg:left-auto lg:top-auto h-3/4 flex flex-col" open={openAddGoal} handler={handleOpenAddGoal}>
        {isBankLinkedLoading ?
          <Loading />
          :
          <>
            <DialogHeader className={`text-zinc-300 font-ubuntu h-36 items-start bg-cover`}
              style={{ backgroundImage: `url('${createGoalData.name.toLowerCase()}.png')` }}
            >{createGoalData.name ? createGoalData.name : "Add a goal!"}</DialogHeader>
            <DialogBody className="text-zinc-400 font-ubuntu grow">
              <Carousel className="w-full" noLoop arrowPos="bottom">
                <Carousel.Item className="!justify-start flex-col">
                  <h4 className="text-lg text-center font-thin leading-loose mt-5 mb-14">Please name your goal:</h4>
                  <Input
                    value={createGoalData.name}
                    onChange={(e: any) => setCreateGoalData({ ...createGoalData, name: e.target.value })}
                    size="lg" variant="standard" labelProps={{ className: "!text-zinc-500" }} label="" className="!text-zinc-300 text-center font-thin font-[Ubuntu] text-2xl" />
                </Carousel.Item>

                <Carousel.Item className="!justify-start flex-col">
                  <div className="flex flex-col m-4">
                    <h4 className="text-lg text-center font-thin leading-loose mt-4 mb-10">How much would you like to save?</h4>
                    <Input
                      value={createGoalData.goal_amount}
                      onChange={(e: any) => setCreateGoalData({ ...createGoalData, goal_amount: e.target.value })}
                      size="lg" variant="standard" labelProps={{ className: "!text-zinc-500" }} icon={<span className="material-icons text-zinc-300">attach_money</span>} className="!text-zinc-300 font-thin font-[Ubuntu] text-2xl" />
                  </div>
                </Carousel.Item>

                <Carousel.Item className="!justify-start flex-col">
                  <div className="flex flex-col m-4">
                    <h4 className="text-lg text-center font-thin leading-loose mt-4 mb-10">When do you need to complete this goal?</h4>
                    <Input
                      type="date"
                      value={createGoalData.due_date}
                      onChange={(e: any) => setCreateGoalData({ ...createGoalData, due_date: e.target.value })}
                      size="lg" variant="standard" labelProps={{ className: "!text-zinc-500" }} className="!text-zinc-300 font-[Ubuntu] font-thin text-2xl" />
                  </div>
                </Carousel.Item>

                <Carousel.Item className="!justify-start flex-col">
                  <div className="flex flex-col m-4">
                    <h4 className="text-lg text-center font-thin leading-loose mt-4 mb-6">Select the account(s) to track:</h4>
                    <div className="h-3/4 p-2 overflow-auto">
                      {balanceData?.getAccounts.accounts.filter((account: any) => account.name.toLowerCase().match(/(chequing)|(saving)/)).map((account: any) => {
                        return (<Checkbox
                          onChange={(e) => {
                            const accountName = e.target.id;
                            const { track_accounts } = createGoalData;
                            if (createGoalData.track_accounts.includes(accountName)) {
                              setCreateGoalData({ ...createGoalData, track_accounts: track_accounts.filter((item: string) => item !== accountName) });
                            } else {
                              setCreateGoalData({ ...createGoalData, track_accounts: track_accounts.concat([accountName]) });
                            }
                          }}
                          checked={createGoalData.track_accounts.includes(account.name)}
                          key={account.account_id} id={account.name} label={account.name} labelProps={{ className: "text-sm text-zinc-300" }} />)
                      }
                      )}
                    </div>
                  </div>
                </Carousel.Item>


                <Carousel.Item className="!justify-start flex-col">
                  <div className="flex flex-col m-4">
                    <h4 className="text-lg text-center font-thin leading-loose mt-4 mb-2">What amount do you want to start saving from?</h4>
                    <div className="text-xs text-center font-thin leading-loose mb-8">
                      (Max Amount {
                        currencyFormatter.format(
                          balanceData?.getAccounts.accounts.filter((account: any) => createGoalData.track_accounts.includes(account.name)).reduce((a: number, b: any) => a + b.balances.current, 0)
                        )
                      } from all <span className="material-icons text-sm">check_box</span> accounts)
                    </div>
                    <Input
                      value={createGoalData.start_save_from}
                      onChange={(e: any) => setCreateGoalData({ ...createGoalData, start_save_from: e.target.value })}
                      size="lg" variant="standard" labelProps={{ className: "!text-zinc-500" }} icon={<span className="material-icons text-zinc-300">attach_money</span>} className="!text-zinc-300 font-[Ubuntu] font-thin text-2xl" />
                  </div>
                </Carousel.Item>

                <Carousel.Item className="flex-col">
                  <div className="-mt-6">
                    <h4 className="text-lg text-center font-thin leading-loose mb-2">✨ Your Savings Target ✨</h4>
                    <div className="text-3xl text-center lg:text-4xl font-bold text-sky-500">{calculateSavingsRate()}</div>
                  </div>
                </Carousel.Item>
                <Carousel.Item className="flex-col">
                  <h4 className="text-lg text-center font-thin leading-loose mb-10">Tap the check to start saving!</h4>
                  <button className="animate-bounce font-bold w-14 h-14 rounded-full drop-shadow-strong bg-gradient-to-tr from-sky-400 to-sky-700 text-zinc-200 flex justify-center items-center"><span className="material-icons">check</span></button>
                </Carousel.Item>
              </Carousel>
            </DialogBody>
          </>
        }
      </Dialog>

    </>
  )
}
