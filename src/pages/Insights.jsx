import React from 'react';
import { Download } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { HBars, Heatmap, StackedSplit, StatBlock } from '../components/ui/info';
import { PageHeader, Shell } from '../components/layout/Shell';
import { HEAT, INSIGHTS, LEAD_TIME, OUTCOMES } from '../lib/data';

export default function Insights() {
  const data = INSIGHTS.createdEvents;
  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((a, b) => a + b.value, 0);

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Database"
        title="Booking Insights"
        description="Booking volume, event-type mix and no-show health across the workspace"
        action={
          <Button variant="secondary" size="base">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-8 border-b border-border pb-8 lg:grid-cols-4">
        <StatBlock
          label="Bookings created"
          value={String(total)}
          spark={INSIGHTS.sparks.created}
          delta={{ dir: 'up', text: '+9%', span: 'last 6 months' }}
        />
        <StatBlock
          label="Completion rate"
          value="81%"
          spark={INSIGHTS.sparks.completion}
          sparkColor="var(--chart-green)"
          delta={{ dir: 'up', text: '+2.1 pts', span: 'vs last month' }}
        />
        <StatBlock
          label="No-show rate"
          value={`${INSIGHTS.noShowPct}%`}
          spark={INSIGHTS.sparks.noShow}
          sparkColor="var(--chart-red)"
          delta={{ dir: 'down', text: '-1.2 pts', span: 'vs last month' }}
        />
        <StatBlock
          label="Avg. lead time"
          value="4.2d"
          spark={INSIGHTS.sparks.lead}
          sparkColor="var(--chart-amber)"
          delta={{ dir: 'up', text: '+0.3d', span: 'vs last month' }}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-subheading font-semibold text-foreground">Bookings created</h2>
              <span className="text-caption text-muted-foreground">last 7 days</span>
            </div>
            <div className="mt-6 flex h-52 items-end gap-3">
              {data.map((d) => (
                <div key={d.label} className="group flex h-full w-full flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-sm bg-fill-strong transition-colors group-hover:bg-chart-blue"
                      style={{ height: `${(d.value / max) * 100}%`, minHeight: 3 }}
                      title={`${d.value} bookings`}
                    />
                  </div>
                  <span className="text-meta uppercase tracking-wide text-placeholder">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
              {total} bookings this week - Thu carries the largest share
            </p>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-subheading font-semibold text-foreground">Event type split</h2>
              <span className="text-caption text-muted-foreground">share of {total}</span>
            </div>
            <StackedSplit items={INSIGHTS.eventTypesSplit} className="mt-5" />
            <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
              Short 15-30 min sessions drive 73% of all bookings
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">How bookings resolved</h2>
            <span className="text-caption text-muted-foreground">this month</span>
          </div>
          <StackedSplit items={OUTCOMES} className="mt-5" />
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            74 of 96 sessions held - every no-show followed up automatically
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">When people book</h2>
            <span className="text-caption text-muted-foreground">advance</span>
          </div>
          <HBars items={LEAD_TIME} className="mt-5" />
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            Median lead time is 4.2 days, drifting longer month over month
          </p>
        </Card>
      </div>

      <Card className="mt-8 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-subheading font-semibold text-foreground">Booking density by hour</h2>
          <span className="text-caption text-muted-foreground">weekly average</span>
        </div>
        <Heatmap days={HEAT.days} hours={HEAT.hours} matrix={HEAT.levels} className="mt-6" />
        <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
          Thursday 10:00-14:00 is peak capacity - protect it for paid sessions
        </p>
      </Card>
    </Shell>
  );
}
