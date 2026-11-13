import React from 'react';
import { ArrowRight, Briefcase, Calendar, CheckCircle2, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AvatarStack, Button, Card, DataTable, DotPill, StatusPill } from '../components/ui';
import { ActivityFeed, Donut, HBars, StatBlock } from '../components/ui/info';
import { PageHeader, Shell } from '../components/layout/Shell';
import { useCopilot } from '../components/layout/Copilot';
import {
  ACTIVITY, BOOKINGS, INSIGHTS, TEAM_LOAD, USER, WORKSPACE, EVENT_TYPES,
} from '../lib/data';

const fmtDay = (s) =>
  new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (s) =>
  new Date(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const COLUMNS = [
  { key: 'meeting', label: 'Meeting', icon: Briefcase, className: 'min-w-[200px]' },
  { key: 'status', label: 'Status', icon: CheckCircle2, className: 'w-32' },
  { key: 'who', label: 'Attendees', icon: Users, className: 'min-w-[180px]' },
  { key: 'when', label: 'Scheduled', icon: Calendar, className: 'min-w-[180px]' },
];

export default function Overview() {
  const { open: chatOpen, setOpen: setChatOpen } = useCopilot();
  const upcoming = BOOKINGS.filter(
    (b) => new Date(b.start) >= new Date() && b.status !== 'canceled'
  ).slice(0, 6);

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Workspace"
        title="Operations Overview"
        description={`Pulse of ${WORKSPACE.org} this week, ${USER.name.split(' ')[0]}`}
        action={
          <Button
            variant={chatOpen ? 'default' : 'primary'}
            onClick={() => setChatOpen(true)}
          >
            <Sparkles className="h-4 w-4" /> Ask Copilot
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-8 border-b border-border pb-8 lg:grid-cols-4">
        <StatBlock
          label="Bookings this week"
          value="119"
          spark={INSIGHTS.sparks.created}
          delta={{ dir: 'up', text: '+8', span: 'vs last week' }}
        />
        <StatBlock
          label="Completed"
          value="96"
          delta={{ dir: 'up', text: '+12%', span: 'vs last week' }}
        />
        <StatBlock
          label="Canceled"
          value="1"
          delta={{ dir: 'down', text: '-3', span: 'vs last week' }}
        />
        <StatBlock
          label="Event types live"
          value={String(EVENT_TYPES.filter((e) => !e.hidden).length)}
          delta={{ dir: 'up', text: '+1', span: 'this month' }}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-subheading font-semibold text-foreground">Upcoming bookings</h2>
        <Button as={Link} to="/bookings" variant="ghost" size="sm">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={upcoming}
        rowKey={(r) => r.ref}
        renderCell={(row, key) => {
          if (key === 'meeting')
            return (
              <span className="flex flex-col">
                <span className="font-medium text-foreground">{row.title}</span>
                <span className="mt-0.5 text-caption text-placeholder">{row.ref}</span>
              </span>
            );
          if (key === 'status')
            return row.status === 'pending' ? (
              <DotPill dot="bg-chart-blue" label="Pending" />
            ) : (
              <StatusPill ok label="Active" />
            );
          if (key === 'who')
            return (
              <span className="flex items-center gap-2.5 pr-2">
                <AvatarStack people={row.attendees} />
                <span className="max-w-[180px] truncate text-foreground">
                  {row.attendees.map((a) => a.name).join(', ')}
                </span>
              </span>
            );
          if (key === 'when')
            return (
              <span className="text-foreground">
                {fmtDay(row.start)} - {fmtTime(row.start)}
              </span>
            );
          return null;
        }}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">This week</h2>
            <span className="text-caption text-muted-foreground">119 bookings</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-2">
            {INSIGHTS.createdEvents.map((d) => {
              const max = Math.max(...INSIGHTS.createdEvents.map((x) => x.value));
              return (
                <div key={d.label} className="flex h-full w-full flex-col items-center justify-end gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-sm bg-fill-strong transition-all hover:bg-chart-blue"
                      style={{ height: `${(d.value / max) * 100}%`, minHeight: 3 }}
                      title={`${d.value} bookings`}
                    />
                  </div>
                  <span className="text-meta uppercase tracking-wide text-placeholder">{d.label}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            Thursday is your peak day - 30 bookings this week
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">Event type mix</h2>
            <span className="text-caption text-muted-foreground">share of 119</span>
          </div>
          <div className="mt-6 flex items-center gap-8">
            <Donut items={INSIGHTS.eventTypesSplit} size={148} center={{ value: '119', label: 'booked' }} />
            <div className="min-w-0 flex-1 space-y-2.5">
              {INSIGHTS.eventTypesSplit.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5 text-label">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="flex-1 truncate text-foreground">{s.label}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">Team load</h2>
            <span className="text-caption text-muted-foreground">bookings per member</span>
          </div>
          <HBars items={TEAM_LOAD} className="mt-6" />
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            Amelia carries 32% of all sessions this month
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">Recent activity</h2>
            <span className="text-caption text-muted-foreground">workspace</span>
          </div>
          <ActivityFeed items={ACTIVITY} className="mt-5" />
        </Card>
      </div>
    </Shell>
  );
}
