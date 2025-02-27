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


const chartConfig = {
  // Define a color palette or configuration as needed.
  // For simplicity, we define two colors; ideally, extend this to support more users.
  colors: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"],
};

export function MovingAvgLines({ chartData = [] }) {
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
