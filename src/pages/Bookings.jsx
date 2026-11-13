import React, { useState } from 'react';
import {
  ArrowUpDown, Briefcase, Calendar, CheckCircle2, Filter, LayoutGrid,
  MoreHorizontal, Plus, Search, Settings2, Users,
} from 'lucide-react';
import {
  AvatarStack, Button, Checkbox, DataTable, DotPill, EmptyScreen, IconButton,
  StatusPill,
} from '../components/ui';
import { PageHeader, Shell, ViewTabs } from '../components/layout/Shell';
import { BOOKINGS } from '../lib/data';

const fmtDay = (s) =>
  new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtTime = (s) =>
  new Date(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const TABS = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'past', label: 'Past' },
  { value: 'canceled', label: 'Canceled' },
];

const COLUMNS = [
  { key: 'sel', label: '', className: 'w-10' },
  { key: 'meeting', label: 'Meeting', icon: Briefcase, className: 'min-w-[200px]' },
  { key: 'status', label: 'Employment', icon: CheckCircle2, className: 'w-36' },
  { key: 'who', label: 'Attendees', icon: Users, className: 'min-w-[200px]' },
  { key: 'when', label: 'Scheduled', icon: Calendar, className: 'min-w-[180px]' },
  { key: 'ref', label: 'Reference', icon: CheckCircle2, className: 'w-28' },
  { key: 'actions', label: '', className: 'w-12' },
];

export default function Bookings() {
  const [tab, setTab] = useState('upcoming');
  const [sel, setSel] = useState({});

  const now = new Date();
  const rows = BOOKINGS.filter((b) => {
    const past = new Date(b.start) < now;
    if (tab === 'upcoming') return !past && b.status !== 'canceled';
    if (tab === 'past') return past && b.status !== 'canceled';
    if (tab === 'canceled') return b.status === 'canceled';
    return false;
  });

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Database"
        title="Meeting Management System"
        description="Meeting tracking across participants, event types, schedules, and cancellations"
        action={
          <Button variant="primary" size="pill">
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <ViewTabs
          tabs={TABS.map((t) => t.label)}
          active={TABS.find((t) => t.value === tab)?.label}
          onChange={(label) => setTab(TABS.find((t) => t.label === label)?.value)}
        />
        <div className="hidden items-center gap-1 md:flex">
          <IconButton label="Sort"><ArrowUpDown className="h-4 w-4" /></IconButton>
          <IconButton label="Filter"><Filter className="h-4 w-4" /></IconButton>
          <IconButton label="Cards view"><LayoutGrid className="h-4 w-4" /></IconButton>
          <IconButton label="Search"><Search className="h-4 w-4" /></IconButton>
          <IconButton label="Options"><Settings2 className="h-4 w-4" /></IconButton>
        </div>
      </div>

      {tab === 'recurring' ? (
        <EmptyScreen
          icon={Calendar}
          headline="No recurring bookings yet"
          description="Recurring meeting templates will live in this view."
        />
      ) : rows.length === 0 ? (
        <EmptyScreen
          icon={Calendar}
          headline={`No ${tab} bookings`}
          description="Bookings that match this view appear here the moment they are placed."
        />
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={rows.map((b) => ({ ...b }))}
          rowKey={(r) => r.ref}
          renderCell={(row, key) => {
            if (key === 'sel')
              return (
                <Checkbox
                  checked={!!sel[row.ref]}
                  onChange={(v) => setSel((s) => ({ ...s, [row.ref]: v }))}
                />
              );
            if (key === 'meeting')
              return (
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{row.title}</span>
                  <span className="mt-0.5 text-caption text-placeholder">{row.ref}</span>
                </span>
              );
            if (key === 'status')
              return row.status === 'canceled' ? (
                <StatusPill ok={false} label="Canceled" />
              ) : row.status === 'pending' ? (
                <DotPill dot="bg-chart-blue" label="Pending" />
              ) : (
                <StatusPill ok label="Active" />
              );
            if (key === 'who')
              return (
                <span className="flex items-center gap-2.5 pr-2">
                  <AvatarStack people={row.attendees} />
                  <span className="max-w-[160px] truncate text-foreground">
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
            if (key === 'ref')
              return <span className="font-mono text-caption text-placeholder">{row.ref}</span>;
            if (key === 'actions')
              return (
                <IconButton label="Row options" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              );
            return null;
          }}
        />
      )}

      {tab === 'recurring' || rows.length === 0 ? null : (
        <div className="mt-4 flex items-center justify-between text-body-sm text-muted-foreground">
          <span>{rows.length} results</span>
          <span>Sorted by date</span>
        </div>
      )}
    </Shell>
  );
}
