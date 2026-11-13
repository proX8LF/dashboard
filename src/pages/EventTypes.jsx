import React, { useState } from 'react';
import {
  ArrowUpDown, CalendarClock, Circle, Copy, DollarSign, Filter, Globe,
  LayoutGrid, MoreHorizontal, Plus, Search, Settings2, Users,
} from 'lucide-react';
import {
  AvatarStack, Badge, Button, DataTable, DotPill, IconButton, StatusPill,
  Switch,
} from '../components/ui';
import { PageHeader, Shell, ViewTabs } from '../components/layout/Shell';
import { EVENT_TYPES } from '../lib/data';

const COLUMNS = [
  { key: 'name', label: 'Event Type', icon: CalendarClock, className: 'min-w-[220px]' },
  { key: 'slug', label: 'Booking Link', icon: Globe },
  { key: 'hosts', label: 'Team', icon: Users, className: 'w-36' },
  { key: 'apps', label: 'Apps', icon: Circle, className: 'w-52' },
  { key: 'duration', label: 'Duration', icon: CalendarClock, className: 'w-24' },
  { key: 'price', label: 'Price', icon: DollarSign, className: 'w-20' },
  { key: 'active', label: 'Employment', icon: Circle, className: 'w-32' },
  { key: 'actions', label: '', className: 'w-16' },
];

export default function EventTypes() {
  const [type, setType] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [hiddenMap, setHiddenMap] = useState(
    Object.fromEntries(EVENT_TYPES.map((e) => [e.id, e.hidden]))
  );

  const rows =
    type === 'Hidden'
      ? EVENT_TYPES.filter((e) => hiddenMap[e.id])
      : type === 'Active'
        ? EVENT_TYPES.filter((e) => !hiddenMap[e.id])
        : EVENT_TYPES;

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Database"
        title="Event Type Management"
        description="Booking links your team shares, durations, pricing and visibility"
        action={
          <Button variant="primary" size="pill">
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <ViewTabs
          tabs={['All', 'Active', 'Hidden']}
          active={type}
          onChange={setType}
        />
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
        rows={rows.map((e) => ({ ...e, _active: !hiddenMap[e.id] }))}
        rowKey={(r) => r.id}
        renderCell={(row, key) => {
          if (key === 'name')
            return (
              <span className="flex flex-col">
                <span className="font-medium text-foreground">{row.title}</span>
                <span className="mt-0.5 text-caption text-placeholder">{row.location}</span>
              </span>
            );
          if (key === 'slug')
            return (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`softwaredelabs.com/book/${row.slug}`);
                  setCopiedId(row.id);
                  setTimeout(() => setCopiedId(null), 1200);
                }}
                className="font-mono text-caption text-placeholder hover:text-foreground"
              >
                /{row.slug}
              </button>
            );
          if (key === 'hosts') return <AvatarStack people={row.hosts} />;
          if (key === 'apps')
            return (
              <span className="flex flex-wrap gap-1.5 py-0.5">
                {row.apps.map((a) => (
                  <Badge
                    key={a}
                    variant={a === 'stripe' ? 'success' : a === 'cal-video' ? 'info' : 'gray'}
                  >
                    {a === 'cal-video' ? 'Cal Video' : a === 'google-calendar' ? 'Calendar' : a === 'stripe' ? 'Stripe' : 'Zoom'}
                  </Badge>
                ))}
              </span>
            );
          if (key === 'duration') return <span className="text-foreground">{row.duration} min</span>;
          if (key === 'price')
            return row.price ? (
              <span className="font-medium text-foreground">{row.price}</span>
            ) : (
              <span className="text-placeholder">Free</span>
            );
          if (key === 'active')
            return (
              <span className="flex items-center gap-3">
                <StatusPill ok={row._active} label={row._active ? 'Active' : 'Hidden'} />
                <Switch
                  checked={row._active}
                  onChange={(v) => setHiddenMap((m) => ({ ...m, [row.id]: !v }))}
                />
              </span>
            );
          if (key === 'actions')
            return (
              <span className="flex items-center gap-0.5">
                <IconButton label="Copy link">
                  <Copy className={`h-4 w-4 ${copiedId === row.id ? 'text-success-foreground' : ''}`} />
                </IconButton>
                <IconButton label="Row options" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </IconButton>
              </span>
            );
          return null;
        }}
        empty="No event types in this view"
      />

      <div className="mt-4 flex items-center justify-between text-body-sm text-muted-foreground">
        <span>{rows.length} results</span>
        <span>Links copy on click</span>
      </div>
    </Shell>
  );
}
