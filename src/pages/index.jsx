import DefaultLayout from "@/layouts/default";
import AvgTable from '../components/AvgTable';
import { useState, useEffect } from "react";
import CurrentPlayers from "../components/CurrentPlayers";
import { MovingAvgLines } from "@/components/MovingAvgLines";
import { DateTimes } from "@/components/DatePicker";
import { resolveAvatarUrl } from "@/lib/avatar-utils";

export default function IndexPage({ supabaseClient, supabaseSession }) {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userAverages, setUserAverages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPlayers, setCurrentPlayers] = useState([]);

  useEffect(() => {
    getUsersAndUserData();
  }, []);

  async function getUsersAndUserData() {
    setLoading(true);
    const { data: users, error: usersError } = await supabaseClient.from("profiles").select();
    const { data: userData, error: userDataError } = await supabaseClient.from("entries").select();

    if (usersError || userDataError) {
      console.error("Error fetching data:", usersError || userDataError);
      setLoading(false);
      return;
    }

    // Get avatar URLs for each user
    const usersWithAvatars = await Promise.all(
      users.map(async (user) => {
        const profile_picture = resolveAvatarUrl(user.avatar, supabaseClient);
        return {
          ...user,
          profile_picture,
          name: user.name,
          title: "Mini Player"
        };
      })
    );

    setUsers(usersWithAvatars);
    setCurrentPlayers(usersWithAvatars);
    setUserData(userData);

    // Compute overall averages for the table.
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
    const averagesResult = [];
    userMap.forEach(user => {
      if (user.count > 0) {
        averagesResult.push({
          user_id: user.user_id,
          name: user.name,
          avgTimeSpent: Math.round(user.totalTime / user.count)
        });
      }
    });
    setUserAverages(averagesResult);

    // --------------------------
    // Compute moving averages for the chart.
    // For each user, calculate a moving average of a window of up to 5 entries.
    const userMovingAverages = new Map();
    users.forEach(user => {
      // Filter entries for the user and sort them by date ascending.
      const entries = userData
        .filter(entry => entry.user_id === user.user_id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const movingAverages = [];
      for (let i = 0; i < entries.length; i++) {
        // Calculate average over the window of up to 5 entries ending at i.
        const start = Math.max(0, i - 4);
        const windowEntries = entries.slice(start, i + 1);
        const sum = windowEntries.reduce((acc, cur) => acc + cur.time, 0);
        const avg = sum / windowEntries.length;
        movingAverages.push({
          date: entries[i].date,
          avg: Math.round(avg)
        });
      }
      // Take only the last 5 moving average points (if available)
      const lastFive = movingAverages.slice(-5);
      userMovingAverages.set(user.user_id, { name: user.name, data: lastFive });
    });

    // Merge all users' moving averages into a single chartData array.
    // We use a common x-axis: for simplicity "Entry 1" ... "Entry 5"
    const maxPoints = 5;
    const mergedChartData = [];
    for (let i = 0; i < maxPoints; i++) {
      const pointObj = { point: `T${i - (maxPoints - 1)}` };
      userMovingAverages.forEach((value, userId) => {
        if (value.data[i]) {
          // Use the user's name as key and the computed average as value.
          pointObj[value.name] = value.data[i].avg;
        }
      });
      mergedChartData.push(pointObj);
    }
    setChartData(mergedChartData);
    setLoading(false);
  }

  return (
    <DefaultLayout supabaseClient={supabaseClient} supabaseSession={supabaseSession}>
      <div className='w-full flex flex-col items-center gap-10'>

        <div className="flex items-start justify-center gap-20 w-full">
          <AvgTable users={userAverages} isLoading={loading} />
          <MovingAvgLines chartData={chartData} />
        </div>

        {!supabaseSession ? (
          <div>
            <h1 className="text-2xl font-serif">Log in to see and update your scores</h1>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <h1 className="text-2xl font-serif">See and update your scores!</h1>
            <DateTimes supabaseClient={supabaseClient} supabaseSession={supabaseSession}/>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-serif">Current players</h1>
          <CurrentPlayers users={currentPlayers} />
        </div>
      </div>
    </DefaultLayout>
  );
}
