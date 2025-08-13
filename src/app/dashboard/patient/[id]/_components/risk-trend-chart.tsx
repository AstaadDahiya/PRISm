"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { RiskHistory } from "@/lib/data";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";

export const RiskTrendChart = ({ data }: { data: RiskHistory[] }) => (
  <ChartContainer config={{}} className="min-h-[200px] w-full">
    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
      <XAxis
        dataKey="date"
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
      />
      <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={12}
        domain={[0, 100]}
      />
      <RechartsTooltip content={<ChartTooltipContent />} />
      <Line
        type="monotone"
        dataKey="riskScore"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        dot={{ r: 4, fill: "hsl(var(--primary))" }}
      />
    </LineChart>
  </ChartContainer>
);