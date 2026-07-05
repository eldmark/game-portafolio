import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { AnalyticsSummary, AnalyticsTimeseries } from '@portfolio/shared';

const RANGE_OPTIONS = [7, 30, 90] as const;

const CHART_COLORS = {
  primary: 'var(--color-accent-primary)',
  warm: 'var(--color-horizon-warm)',
  soft: 'var(--color-accent-soft)',
  glow: 'var(--color-accent-glow)',
  grid: 'var(--color-border-default)',
  tick: 'var(--color-text-muted)',
};

function ChartEmptyState({ message = 'Not enough data yet.' }: { message?: string }) {
  return <div className="admin-chart-empty">{message}</div>;
}

export default function OverviewCharts({
  analytics,
  timeseries,
  timeseriesLoading,
  days,
  onDaysChange,
}: {
  analytics: AnalyticsSummary | null;
  timeseries: AnalyticsTimeseries | null;
  timeseriesLoading: boolean;
  days: number;
  onDaysChange: (days: number) => void;
}) {
  const visitsOverTime = timeseries?.visitsOverTime ?? [];
  const deviceBreakdown = timeseries?.deviceBreakdown ?? [];
  const countryBreakdown = timeseries?.countryBreakdown ?? [];
  const popularDialogues = analytics?.popularDialogues ?? [];

  const totalVisits = analytics?.totalVisits ?? 0;
  const recruiterVisits = analytics?.recruiterVisits ?? 0;
  const pieData = [
    { name: 'Recruiter mode', value: recruiterVisits },
    { name: 'Normal mode', value: Math.max(0, totalVisits - recruiterVisits) },
  ];

  return (
    <>
      <section className="admin-analytics-panel">
        <header className="admin-analytics-panel-header admin-analytics-panel-toolbar">
          <div>
            <h2>Visits over time</h2>
            <p>Daily visit counts for the last {days} days.</p>
          </div>
          <div className="admin-range-selector" role="group" aria-label="Date range">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={days === option ? 'active' : ''}
                onClick={() => onDaysChange(option)}
              >
                {option}d
              </button>
            ))}
          </div>
        </header>
        {timeseriesLoading ? (
          <ChartEmptyState message="Loading visit trends…" />
        ) : visitsOverTime.length === 0 ? (
          <ChartEmptyState />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={visitsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: CHART_COLORS.tick }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.tick }} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="total"
                name="Total visits"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="recruiter"
                name="Recruiter mode"
                stroke={CHART_COLORS.warm}
                fill={CHART_COLORS.warm}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </section>

      <div className="admin-charts-grid">
        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Recruiter vs normal</h2>
            <p>Share of visits started in recruiter mode.</p>
          </header>
          {totalVisits === 0 ? (
            <ChartEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  <Cell fill={CHART_COLORS.primary} />
                  <Cell fill={CHART_COLORS.glow} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Top interactions</h2>
            <p>Most used dialogue keys from portfolio visits.</p>
          </header>
          {popularDialogues.length === 0 ? (
            <ChartEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={popularDialogues} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.tick }} />
                <YAxis
                  dataKey="dialogueKey"
                  type="category"
                  width={110}
                  tick={{ fontSize: 12, fill: CHART_COLORS.tick }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Interactions" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Devices</h2>
            <p>Visits grouped by device type.</p>
          </header>
          {timeseriesLoading ? (
            <ChartEmptyState message="Loading device breakdown…" />
          ) : deviceBreakdown.length === 0 ? (
            <ChartEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deviceBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.tick }} />
                <YAxis
                  dataKey="device"
                  type="category"
                  width={110}
                  tick={{ fontSize: 12, fill: CHART_COLORS.tick }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Visits" fill={CHART_COLORS.soft} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="admin-analytics-panel">
          <header className="admin-analytics-panel-header">
            <h2>Countries</h2>
            <p>Visits grouped by visitor country.</p>
          </header>
          {timeseriesLoading ? (
            <ChartEmptyState message="Loading country breakdown…" />
          ) : countryBreakdown.length === 0 ? (
            <ChartEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={countryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: CHART_COLORS.tick }} />
                <YAxis
                  dataKey="country"
                  type="category"
                  width={110}
                  tick={{ fontSize: 12, fill: CHART_COLORS.tick }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Visits" fill={CHART_COLORS.warm} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </>
  );
}
