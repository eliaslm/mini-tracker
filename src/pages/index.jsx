import { useState } from "react";
import { Card } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";

import DefaultLayout from "@/layouts/default";
import { MiniAvgBarChart } from "../components/MiniAvgBarChart";

import UserCard from "@/components/UserCard";
import users from '@/../users.json';



function UserCards({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <UserCard key={index} user={user} classNames="my-2" />
      ))}
    </div>
  );
}


export default function IndexPage({supabaseClient, supabaseSession}) {
  
  const defaultUsers = users.users;
  const [allUsers, setAllUsers] = useState(defaultUsers);

  return (
    <DefaultLayout supabaseClient={supabaseClient} supabaseSession={supabaseSession}>
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-row justify-between gap-12 w-full">
          <div className="flex flex-col items-center gap-4 w-1/2">
            <h1 className="text-3xl font-serif">Current Players</h1>
            <div className="w-3/4">
              <Card className="bg-slate-200 h-96">
                <ScrollShadow hideScrollBar>
                  <div className="w-3/4 justify-self-center">
                    <UserCards users={allUsers} />
                  </div>
                </ScrollShadow>
              </Card>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-1/2">
            <h1 className="text-3xl font-serif">Average mini scores</h1>
            <div className="mt-10">
              <MiniAvgBarChart users={allUsers} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-12">
          <h1 className="text-3xl font-serif">Enter your score and see how you compare!</h1>
          <div className="h-10" />
        </div>
      </div>
    </DefaultLayout>
  )
}
