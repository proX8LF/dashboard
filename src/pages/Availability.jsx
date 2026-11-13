import React, { useState } from 'react';
import {
  ArrowUpDown, CalendarRange, Clock, Copy, Filter, LayoutGrid, MoreHorizontal,
  Plus, Search, Settings2, Users,
} from 'lucide-react';
import { Avatar, Button, Card, DataTable, IconButton, Switch } from '../components/ui';
import { HBars, Heatmap } from '../components/ui/info';
import { PageHeader, Shell, ViewTabs } from '../components/layout/Shell';
import { AVAILABILITY, HEAT, WEEK } from '../lib/data';

const openDays = (days) => WEEK.filter((d) => (days[d] || null) !== null);

const COLUMNS = [
  { key: 'owner', label: 'Team Member', icon: Users, className: 'min-w-[200px]' },
  { key: 'name', label: 'Schedule', icon: CalendarRange, className: 'min-w-[200px]' },
  { key: 'windows', label: 'Working Windows', icon: Clock, className: 'min-w-[280px]' },
  { key: 'days', label: 'Days Open', icon: CalendarRange, className: 'w-28' },
  { key: 'edit', label: '', className: 'w-24' },
];

export default function Availability() {
  const [copied, setCopied] = useState(null);
  const [map, setMap] = useState(Object.fromEntries(AVAILABILITY.map((a, i) => [a.title, i < 2])));
  const rows = AVAILABILITY.map((a, i) => ({ ...a, _on: map[a.title] !== false }));

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Database"
        title="Schedules & Availability"
        description="When each team member can be booked, per schedule and time zone"
        action={
          <Button variant="primary" size="pill">
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <ViewTabs tabs={['Schedules', 'Time Zones']} active="Schedules" />
        <div className="hidden items-center gap-1 md:flex">
          <IconButton label="Sort"><ArrowUpDown className="h-4 w-4" /></IconButton>
          <IconButton label="Filter"><Filter className="h-4 w-4" /></IconButton>
          <IconButton label="Cards view"><LayoutGrid className="h-4 w-4" /></IconButton>
          <IconButton label="Search"><Search className="h-4 w-4" /></IconButton>
          <IconButton label="Options"><Settings2 className="h-4 w-4" /></IconButton>
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => r.title}
        renderCell={(row, key) => {
          if (key === 'owner')
            return (
              <span className="flex items-center gap-2.5">
                <Avatar initials={row.avatar} />
                <span className="text-foreground">{row.title.split(' ')[0]}</span>
              </span>
            );
          if (key === 'name') return <span className="font-medium text-foreground">{row.title}</span>;
          if (key === 'windows') {
            const open = openDays(row.days);
            return (
              <span className="flex flex-wrap items-center gap-1.5 py-0.5">
                {open.slice(0, 4).map((d) => (
                  <span
                    key={d}
                    className="rounded-md bg-fill px-2 py-0.5 text-caption text-muted-foreground"
                  >
                    {d} {row.days[d][0].replace(' - ', '-')}
                  </span>
                ))}
                {open.length > 4 ? <span className="text-caption text-placeholder">+{open.length - 4}</span> : null}
              </span>
            );
          }
          if (key === 'days')
            return (
              <span className="font-medium text-foreground">{openDays(row.days).length} days</span>
            );
          if (key === 'edit')
            return (
              <span className="flex items-center gap-2">
                <Switch
                  checked={row._on}
                  onChange={(v) => setMap((m) => ({ ...m, [row.title]: v }))}
                />
                <IconButton
                  label="Duplicate schedule"
                  onClick={() => {
                    navigator.clipboard?.writeText(row.title);
                    setCopied(row.title);
                    setTimeout(() => setCopied(null), 1200);
                  }}
                >
                  <Copy className={`h-4 w-4 ${copied === row.title ? 'text-success-foreground' : ''}`} />
                </IconButton>
                <IconButton label="Row options" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              </span>
            );
          return null;
        }}
      />

      <div className="mt-4 flex items-center justify-between text-label text-muted-foreground">
        <span>{rows.length} schedules</span>
        <span>Time zones respected automatically</span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">Booking density</h2>
            <span className="text-caption text-muted-foreground">hour x weekday</span>
          </div>
          <Heatmap days={HEAT.days} hours={HEAT.hours} matrix={HEAT.levels} className="mt-6" />
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            Tue-Thu 10:00-14:00 fills first - keep buffer slots for VIPs
          </p>
        </Card>
        <Card className="p-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-subheading font-semibold text-foreground">Coverage by schedule</h2>
            <span className="text-caption text-muted-foreground">days open of 7</span>
          </div>
          <HBars
            className="mt-6"
            items={AVAILABILITY.map((a, i) => {
              const open = openDays(a.days).length;
              const colors = [
                'var(--chart-blue)',
                'var(--chart-green)',
                'var(--chart-amber)',
              ];
              return {
                label: `${a.avatar} - ${a.title}`,
                value: `${open}/7 days`,
                pct: (open / 7) * 100,
                color: colors[i % colors.length],
              };
            })}
          />
          <p className="mt-4 border-t border-border pt-3 text-caption text-muted-foreground">
            Average coverage is 5.3 days open per week across all schedules
          </p>
        </Card>
      </div>
    </Shell>
  );
}
