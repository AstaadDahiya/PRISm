"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { RiskFactors } from "@/lib/data";
import {
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Cell,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export const RiskFactorsChart = ({ data }: { data: RiskFactors[] }) => (
  <ChartContainer config={{}} className="min-h-[200px] w-full aspect-square">
    <PieChart>
      <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="hsl(var(--primary))"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <RechartsLegend content={<ChartLegendContent />} />
    </PieChart>
  </ChartContainer>
);