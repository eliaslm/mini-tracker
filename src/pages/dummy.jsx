import DefaultLayout from "@/layouts/default";
import AvgTable from '../components/AvgTable';
import { useState, useEffect } from "react";
import users from '@/../users.json';
import CurrentPlayers from "../components/CurrentPlayers";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { formatTime } from "../components/AvgTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig = {
  // Define a color palette or configuration as needed.
  // For simplicity, we define two colors; ideally, extend this to support more users.
  colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"],
};

export function AvgLines({ chartData = [] }) {
  // Determine which keys to draw lines for. Exclude the "point" key.
  const lineKeys = chartData.length > 0 ? Object.keys(chartData[0]).filter(k => k !== 'point') : [];

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-serif">
        Moving Averages
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Moving Average Scores</CardTitle>
          <CardDescription>For each user, the average time over the last 5 entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 40,
                right: 40,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="point"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent valueFormatter={(value) => `${formatTime(value)}`}/>} />
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={chartConfig.colors[index % chartConfig.colors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Moving averages for recent entries
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Data computed as the average time over a sliding window of 5 entries.
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}


const testUsers = users;

export default function DummyPage({ supabaseClient, supabaseSession }) {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userAverages, setUserAverages] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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

    setUsers(users);
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
          name: user.first_name,
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
      userMovingAverages.set(user.user_id, { name: user.first_name, data: lastFive });
    });

    // Merge all users’ moving averages into a single chartData array.
    // We use a common x-axis: for simplicity "Entry 1" ... "Entry 5"
    const maxPoints = 5;
    const mergedChartData = [];
    for (let i = 0; i < maxPoints; i++) {
      const pointObj = { point: `T${i-(maxPoints - 1)}` };
      userMovingAverages.forEach((value, userId) => {
        if (value.data[i]) {
          // Use the user's name as key and the computed average as value.
          pointObj[value.name] = value.data[i].avg;
        }
      });
      mergedChartData.push(pointObj);
    }
    setChartData(mergedChartData);
    console.log(mergedChartData);
    setLoading(false);
  }

  return (
    <DefaultLayout supabaseClient={supabaseClient} supabaseSession={supabaseSession}>
      <div className='w-full flex flex-col items-center gap-10'>

        <div className="flex items-start justify-center gap-20 w-full">
          <AvgTable users={userAverages} isLoading={loading} />
          <AvgLines chartData={chartData} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-serif">Current players</h1>
          <CurrentPlayers users={testUsers.users} />
        </div>
      </div>
    </DefaultLayout>
  );
}
