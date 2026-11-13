import React, { useState } from 'react';
import {
  ArrowUpDown, Calendar, Filter, Globe, LayoutGrid, Mail, MoreHorizontal,
  Plus, Search, Send, Settings2, UserPlus, Users,
} from 'lucide-react';
import {
  Avatar, Badge, Button, Card, Checkbox, DataTable, EmptyScreen, IconButton,
  Input,
} from '../components/ui';
import { PageHeader, RoleBadge, Shell, ViewTabs } from '../components/layout/Shell';
import { INVITED, MEMBERS, TEAMS } from '../lib/data';

const fmtDate = (s) =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const MEMBER_COLUMNS = [
  { key: 'check', label: '', className: 'w-10' },
  { key: 'name', label: 'Member', icon: Users, className: 'min-w-[220px]' },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'role', label: 'Position', icon: Users, className: 'w-32' },
  { key: 'tz', label: 'Time Zone', icon: Globe, className: 'w-40' },
  { key: 'joined', label: 'Start Date', icon: Calendar, className: 'w-40' },
  { key: 'actions', label: '', className: 'w-16' },
];

export default function Members() {
  const [view, setView] = useState('Members');
  const [sel, setSel] = useState({});
  const [email, setEmail] = useState('');
  const [invited, setInvited] = useState(INVITED);

  const invite = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setInvited((arr) => [...arr, { email: email.trim(), sent: new Date().toISOString() }]);
    setEmail('');
  };

  if (view === 'Teams') {
    return (
      <Shell>
        <PageHeader
          eyebrow="Private Database"
          title="Team Management"
          description="Collect teams operate across the workspace with their own event types"
        />
        <div className="mb-4">
          <ViewTabs
            tabs={['Members', 'Teams', 'Invited']}
            active={view}
            onChange={setView}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((t) => (
            <Card
              key={t.name}
              className="p-5 hover:[--surface-tint:var(--fill-subtle)]"
            >
              <div className="flex items-center justify-between">
                <Avatar initials={t.initials} className="h-9 w-9 text-[11px]" />
                <RoleBadge role={t.role} />
              </div>
              <p className="mt-4 text-subheading font-semibold text-foreground">{t.name}</p>
              <p className="mt-1 text-body-sm text-muted-foreground">{t.members} members</p>
            </Card>
          ))}
          <button
            type="button"
            className="flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-placeholder hover:border-border-strong hover:text-foreground"
          >
            <UserPlus className="h-5 w-5" />
            <span className="text-label font-medium">New team</span>
          </button>
        </div>
      </Shell>
    );
  }

  if (view === 'Invited') {
    return (
      <Shell>
        <PageHeader
          eyebrow="Private Database"
          title="Pending Invitations"
          description="People whose invitations have been sent but not yet accepted"
        />
        <div className="mb-4">
          <ViewTabs
            tabs={['Members', 'Teams', 'Invited']}
            active={view}
            onChange={setView}
          />
        </div>
        {invited.length === 0 ? (
          <EmptyScreen
            icon={Send}
            headline="No pending invitations"
            description="Invite people from the Members view; their invitations land here."
          />
        ) : (
          <Card className="overflow-hidden">
            {invited.map((i) => (
              <div
                key={i.email}
                className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0"
              >
                <Avatar initials={i.email.slice(0, 2).toUpperCase()} />
                <span className="flex-1 text-body-sm text-foreground">{i.email}</span>
                <Badge variant="warning">Sent</Badge>
                <span className="w-32 text-body-sm text-muted-foreground">{fmtDate(i.sent)}</span>
                <Button variant="secondary" size="sm">Resend</Button>
              </div>
            ))}
          </Card>
        )}
        <form onSubmit={invite} className="mt-6 flex max-w-md items-center gap-2">
          <Input
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="primary" size="base" type="submit">
            <Send className="h-3.5 w-3.5" /> Invite
          </Button>
        </form>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Database"
        title="Employee Management System"
        description="Employee tracking across all team members, roles, responsibilities, and time zones"
        action={
          <Button variant="primary" size="pill">
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <ViewTabs
          tabs={['Members', 'Teams', 'Invited']}
          active={view}
          onChange={setView}
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
        columns={MEMBER_COLUMNS}
        rows={MEMBERS.map((m) => ({ ...m }))}
        rowKey={(r) => r.username}
        renderCell={(row, key) => {
          if (key === 'check')
            return (
              <Checkbox
                checked={!!sel[row.username]}
                onChange={(v) => setSel((s) => ({ ...s, [row.username]: v }))}
              />
            );
          if (key === 'name')
            return (
              <span className="flex items-center gap-2.5">
                <Avatar
                  initials={row.initials}
                  className={row.role === 'MEMBER' ? 'h-7 w-7 text-[10px] bg-fill text-foreground' : 'h-7 w-7 text-[10px]'}
                />
                <span className="font-medium text-foreground">{row.name}</span>
              </span>
            );
          if (key === 'email') return <span className="text-foreground">{row.email}</span>;
          if (key === 'role') return <RoleBadge role={row.role} />;
          if (key === 'tz')
            return <span className="text-foreground">{row.timeZone.split('/')[1]?.replace('_', ' ')}</span>;
          if (key === 'joined') return <span className="text-placeholder">{fmtDate(row.joined)}</span>;
          if (key === 'actions')
            return (
              <IconButton label="Row options" className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </IconButton>
            );
          return null;
        }}
      />

      <div className="mt-4 flex items-center justify-between text-body-sm text-muted-foreground">
        <span>{MEMBERS.length} members</span>
        <span>Newest first</span>
      </div>
    </Shell>
  );
}
