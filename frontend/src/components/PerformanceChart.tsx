import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const COLORS = [
  "#3366CC", "#DC3912", "#FF9900", "#109618", "#990099",
  "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395",
  "#994499", "#22AA99", "#AAAA11", "#6633CC", "#E67300",
  "#8B0707", "#651067", "#329262", "#5574A6", "#3B3EAC",
];

type Props = { data: any[] };

export default function PerformanceChart({ data }: Props) {
  const { chartData, seriesNames } = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { chartData: [], seriesNames: [] as string[] };
    }

    const points = data
      .map((item: any) => ({
        t: new Date(item.createdAt).getTime(),
        name: item.model?.name ?? item.modelId ?? "unknown",
        v: Number(item.netPortfolio),
      }))
      .filter((p) => Number.isFinite(p.v))
      .sort((a, b) => a.t - b.t);

    const names = new Set<string>();
    for (const p of points) names.add(p.name);

    const uniqueTs = Array.from(new Set(points.map((p) => p.t))).sort((a, b) => a - b);
    const gaps: number[] = [];
    for (let i = 1; i < uniqueTs.length; i++) gaps.push(uniqueTs[i] - uniqueTs[i - 1]);
    const medianGap = gaps.length ? gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)] : 60_000;
    const tolerance = Math.min(5 * 60_000, Math.max(5_000, Math.floor((medianGap || 60_000) * 1.5)));

    const rows: any[] = [];
    let bucketStart = points[0].t;
    let bucketEnd = points[0].t;
    let bucketRows: Record<string, number> = {};

    const flush = () => {
      const center = Math.round((bucketStart + bucketEnd) / 2);
      rows.push({ t: center, ...bucketRows });
      bucketRows = {};
    };

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.t - bucketEnd > tolerance) {
        flush();
        bucketStart = p.t;
        bucketEnd = p.t;
      }
      bucketEnd = Math.max(bucketEnd, p.t);
      bucketRows[p.name] = p.v;
    }
    flush();

    return { chartData: rows, seriesNames: Array.from(names.values()) };
  }, [data]);

  return (
    <div className="w-full h-[56vh] max-w-[1200px]">
      <LineChart
        data={chartData}
        width={1200}
        height={600}
        margin={{ top: 8, right: 24, bottom: 8, left: 0 }}
        className="w-full h-full"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="t"
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(v: number) => new Date(v).toLocaleTimeString()}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} domain={[600, 1500]} ticks={[600, 1000, 1500]} />
        <Tooltip labelFormatter={(label: any) => new Date(label).toLocaleString()} />
        <Legend />
        {seriesNames.map((name, idx) => (
          <Line
            key={name}
            type="basis"
            dataKey={name}
            dot={false}
            strokeWidth={2}
            stroke={COLORS[idx % COLORS.length]}
            strokeLinecap="round"
            strokeLinejoin="round"
            isAnimationActive={false}
            connectNulls
          />
        ))}
      </LineChart>
    </div>
  );
}
