import DefaultLayout from "@/layouts/default";
import AvgTable from '../components/AvgTable';
import { useState, useEffect } from "react";
import users from '@/../users.json';
import CurrentPlayers from "../components/CurrentPlayers";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export function AvgLines() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-serif">
        Development
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Scores by Date</CardTitle>
          <CardDescription>January - June 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="desktop"
                type="monotone"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="mobile"
                type="monotone"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


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
    console.log(userData);

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

        <div className="flex items-start justify-center gap-20 w-full">
          <AvgTable users={userAverages} isLoading={loading} />
          <AvgLines />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-serif">Current players</h1>
          <CurrentPlayers users={testUsers.users} />
        </div>
      </div>
    </DefaultLayout>
  );
}
