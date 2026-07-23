"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"

import { coverageSeries } from "@/content/metrics"
import { formatNumber } from "@/lib/utils"

const SERIES = [
  { key: "automated", label: "Handled by Aurelius", color: "var(--chart-1)" },
  { key: "manual", label: "Handled by your team", color: "var(--chart-3)" },
] as const

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-md">
      <p className="mb-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      <ul className="flex flex-col gap-1.5">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center gap-2 text-xs">
            {/* Shape + label, never colour alone — see chart accessibility. */}
            <span
              aria-hidden
              className="size-2 rounded-[2px]"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-medium tabular-nums">
              {formatNumber(entry.value ?? 0)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CoverageChart() {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="sr-only">
        Enquiries and bookings handled by Aurelius rising from 180 in January to
        2,420 in August, while those handled by the studio team fall from 1,240
        to 160 over the same period.
      </figcaption>

      {/* Fixed height reserves space before Recharts measures — keeps CLS ~0. */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={coverageSeries}
            margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
          >
            <defs>
              {SERIES.map((s) => (
                <linearGradient
                  key={s.key}
                  id={`fill-${s.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs"
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={56}
              className="text-xs"
              stroke="var(--muted-foreground)"
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            />
            <Legend
              verticalAlign="top"
              align="left"
              height={36}
              iconType="square"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />

            {SERIES.map((s) => (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#fill-${s.key})`}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </figure>
  )
}
