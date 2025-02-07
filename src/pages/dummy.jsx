import DefaultLayout from "@/layouts/default";
import AvgTable from '../components/AvgTable';
import { useState, useEffect } from "react";
import users from '@/../users.json';
import CurrentPlayers from "../components/CurrentPlayers";


const testUsers = users;

export default function DummyPage({ supabaseClient, supabaseSession }) {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userAverages, setUserAverages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsersAndUserData();
  }, []);

  async function getUsersAndUserData() {
    setLoading(true); // Start loading
    const { data: users, error: usersError } = await supabaseClient.from("profiles").select();
    const { data: userData, error: userDataError } = await supabaseClient.from("entries").select();

    if (usersError || userDataError) {
      console.error("Error fetching data:", usersError || userDataError);
      setLoading(false);
      return;
    }

    setUsers(users);
    setUserData(userData);

    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user.user_id, { ...user, totalTime: 0, count: 0 });
    });

    userData.forEach(entry => {
      if (userMap.has(entry.user_id)) {
        let user = userMap.get(entry.user_id);
        user.totalTime += entry.time;
        user.count += 1;
        userMap.set(entry.user_id, user);
      }
    });

    const result = [];
    userMap.forEach(user => {
      if (user.count > 0) {
        result.push({
          user_id: user.user_id,
          name: user.first_name,
          avgTimeSpent: Math.round(user.totalTime / user.count)
        });
      }
    });

    setUserAverages(result);
    setLoading(false);
  }

  return (
    <DefaultLayout supabaseClient={supabaseClient} supabaseSession={supabaseSession}>
      <div className='w-full flex flex-col items-center gap-10'>
        <AvgTable users={userAverages} isLoading={loading} />

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-serif">Current players</h1>
          <CurrentPlayers users={testUsers.users}/>
        </div>
      </div>
    </DefaultLayout>
  );
}
