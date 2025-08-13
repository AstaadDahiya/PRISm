"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { HealthData } from "@/lib/data";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
} from "recharts";

export const HealthDataChart = ({ data }: { data: HealthData[] }) => (
  <ChartContainer config={{}} className="min-h-[200px] w-full">
    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
      <XAxis
        dataKey="date"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
      />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
      <RechartsTooltip content={<ChartTooltipContent />} />
      <RechartsLegend content={<ChartLegendContent />} />
      <Bar
        dataKey="steps"
        fill="hsl(var(--chart-1))"
        name="Steps"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ChartContainer>
);