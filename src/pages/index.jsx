import { useState, useEffect } from "react";
import { Card } from "@nextui-org/react";
import { ScrollShadow } from "@nextui-org/react";
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

import { createClient } from '@supabase/supabase-js'

import DefaultLayout from "@/layouts/default";
import { MiniAvgBarChart } from "../components/MiniAvgBarChart";

import UserCard from "@/components/UserCard";
import users from '@/../users.json';

const supabase = createClient('http://localhost:8000', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE')

function UserCards({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <UserCard key={index} user={user} classNames="my-2" />
      ))}
    </div>
  );
}


export default function IndexPage() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  const defaultUsers = users.users;
  const [allUsers, setAllUsers] = useState(defaultUsers);

  return (
    <DefaultLayout>
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-row justify-center gap-12 w-full">
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
          <div className="flex flex-row gap-12 justify-center w-full">
            {!session ?
              <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
              :
              <p onClick={() => supabase.auth.signOut()}>Logged in!</p>
            }
          </div>
          <div className="h-10" />
        </div>
      </div>
    </DefaultLayout>
  )
}
