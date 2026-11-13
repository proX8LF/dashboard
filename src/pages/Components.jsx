import React, { useState } from 'react';
import {
  BarChart2, Bookmark, CalendarCheck2, Circle, Copy, Download, Globe,
  Pencil, Plus, Rocket, Trash2, Users,
} from 'lucide-react';
import {
  AlertDialog, Badge, Button, Checkbox, CodeBlock, CopyButton, Dialog, DialogClose, DialogAction,
  DropdownMenu, DotPill, EmptyScreen, Field, InlineCode, Input, IconButton, Kbd, Label, Meter,
  MenuLabel, MenuSeparator, MenuItem, Notice, Pagination, Panel, Progress, Radio, RadioRow,
  SearchInput, SegmentedControl, Select, Shimmer, Skeleton, Slider, Spinner, StatusPill,
  Switch, Tabs, Textarea, Toaster, toast, Tooltip,
} from '../components/ui';
import { PageHeader, Shell, ViewTabs } from '../components/layout/Shell';

const Section = ({ title, description, children }) => (
  <Panel title={title} description={description}>
    {children}
  </Panel>
);

const Row = ({ children }) => <div className="flex flex-wrap items-center gap-2">{children}</div>;

export default function Components() {
  const [dialog, setDialog] = useState(false);
  const [alert, setAlert] = useState(false);
  const [pop, setPop] = useState(false);  const [seg, setSeg] = useState('day');
  const [tab, setTab] = useState('overview');
  const [sel, setSel] = useState('tokyo');
  const [radio, setRadio] = useState('invite');
  const [check, setCheck] = useState(true);
  const [sw, setSw] = useState(true);
  const [slide, setSlide] = useState(64);
  const [page, setPage] = useState(4);
  const [meter, setMeter] = useState(72);

  return (
    <Shell>
      <PageHeader
        eyebrow="Component Library"
        title="Mastra UI Kit"
        description="Every surface, overlay and control ported from the Mastra design system"
        action={
          <Button variant="primary" size="pill" onClick={() => toast({ title: 'Deploy scheduled', description: 'Production build queued', variant: 'success' })}>
            <Rocket className="h-4 w-4" /> Deploy
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <Section title="Buttons" description="Raised field pill, fill-inverse primary, ghost and destructive rungs">
          <Row>
            <Button variant="primary"><Plus className="size-4" /> Primary</Button>
            <Button variant="default">Secondary</Button>
            <Button variant="ghost"><Pencil className="size-3.5" /> Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="destructive"><Trash2 className="size-3.5" /> Delete</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </Row>
          <Row>
            <Kbd>⌘</Kbd><Kbd>K</Kbd>
            <IconButton label="Copy"><Copy className="size-4" /></IconButton>
            <IconButton label="Bookmark"><Bookmark className="size-4" /></IconButton>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg"><Download className="size-4" /> Large</Button>
          </Row>
        </Section>

        <Section title="Tabs & Segmented Control" description="Sliding indicator and measured thumb — no library">
          <ViewTabs tabs={['All', 'Active', 'Hidden']} active="All" onChange={() => {}} />
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'overview', label: 'Overview', icon: Globe },
              { value: 'activity', label: 'Activity', icon: BarChart2 },
              { value: 'members', label: 'Members', icon: Users },
            ]}
          />
          <Row>
            <SegmentedControl
              ariaLabel="Range"
              value={seg}
              onChange={setSeg}
              items={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
            <SegmentedControl
              ariaLabel="Compact"
              size="sm"
              value={seg}
              onChange={setSeg}
              items={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
          </Row>
        </Section>

        <Section title="Fields" description="Field rhythm, selection controls, pointer slider">
          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Workspace name" description="Shown in the sidebar and titles" htmlFor="demo-name">
              <Input id="demo-name" defaultValue="Software DevLabs" />
            </Field>
            <Field label="Search" required htmlFor="demo-search">
              <SearchInput id="demo-search" placeholder="Search bookings…" />
            </Field>
            <Field label="Notes" htmlFor="demo-notes">
              <Textarea id="demo-notes" placeholder="Anything important about this member…" />
            </Field>
            <Field label="Notify members">
              <ClearBoth>
                <Row>
                  <Switch checked={sw} onChange={setSw} />
                  <Checkbox checked={check} onChange={setCheck} label="Email me" />
                  <Radio checked={radio === 'invite'} onChange={() => setRadio('invite')} />
                  <span className="text-label text-muted-foreground">Radio</span>
                </Row>
                <RadioRow label="Invite link" description="Anyone with the link can join" checked={radio === 'invite'} onChange={() => setRadio('invite')} />
                <RadioRow label="Manual approval" description="Admins review every request" checked={radio === 'manual'} onChange={() => setRadio('manual')} />
              </ClearBoth>
            </Field>
            <Field label="Volume" description={`${slide}%`}>
              <Slider value={slide} onChange={setSlide} label="Volume" />
            </Field>
            <Field label="Round trip">
              <Row>
                <Select
                  value={sel}
                  onChange={setSel}
                  options={[
                    { value: 'tokyo', label: 'Tokyo' },
                    { value: 'paris', label: 'Paris' },
                    { value: 'nyc', label: 'New York' },
                  ]}
                />
                <Select size="sm" value={sel} onChange={setSel} options={[{ value: 'tokyo', label: 'Tokyo' }, { value: 'paris', label: 'Paris' }]} />
              </Row>
            </Field>
          </div>
        </Section>

        <Section title="Overlays" description="Dialog, alert, dropdown and popover on the overlay material">
          <Row>
            <Button variant="default" onClick={() => setDialog(true)}>Dialog</Button>
            <Button variant="destructive" onClick={() => setAlert(true)}>Alert</Button>
            <DropdownMenu trigger={<Button variant="default">Menu</Button>}>
              <MenuLabel>Actions</MenuLabel>
              <MenuItem icon={Pencil} onClick={() => toast({ title: 'Renamed', variant: 'info' })}>Rename</MenuItem>
              <MenuItem icon={Copy} shortcut="⌘C">Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem icon={Trash2} onClick={() => toast({ title: 'Event type deleted', variant: 'error' })}>Delete</MenuItem>
            </DropdownMenu>
            <Popover open={pop} onOpenChange={setPop} trigger={<Button variant="ghost">Popover</Button>}>
              <p className="text-body-sm text-foreground">Anchored to the trigger, dismissed on outside click or Esc.</p>
              <Field label="Quick setting"><Switch checked={sw} onChange={setSw} /></Field>
            </Popover>
            <Tooltip label="Tooltips are CSS-only">
              <Button variant="subtle">Hover me</Button>
            </Tooltip>
          </Row>
        </Section>

        <Section title="Feedback" description="Notices, statuses, progress rungs and the toast host">
          <div className="grid max-w-3xl grid-cols-1 gap-2 sm:grid-cols-2">
            <Notice variant="info" title="Usage summary">Booking volume is up 12% this week.</Notice>
            <Notice variant="success" title="Integration ready">Zoom was connected to all event types.</Notice>
            <Notice variant="warning" title="Seats running low">3 of 5 member seats remain.</Notice>
            <Notice variant="error" title="Webhook failed">Retrying in 30 seconds.</Notice>
          </div>
          <Row>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Failed</Badge>
            <StatusPill ok label="Hired" />
            <StatusPill ok={false} label="Rejected" />
            <DotPill dot="bg-chart-blue" label="Engineering" />
          </Row>
          <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <Progress value={meter} />
            <Meter variant="success" value={meter} />
            <Slider value={meter} onChange={setMeter} label="Meter value" />
            <Row>
              <Spinner />
              <Skeleton className="h-5 w-40" />
              <Shimmer className="h-5 w-40" />
            </Row>
          </div>
          <Row>
            <Button variant="default" onClick={() => toast({ title: 'Saved', description: 'Availability updated', variant: 'success' })}>Toast success</Button>
            <Button variant="default" onClick={() => toast({ title: 'Batch started', description: 'Exporting 1,204 rows…', variant: 'info', duration: 0 })}>Toast loading</Button>
          </Row>
        </Section>

        <Section title="Data" description="Pagination, code blocks, copy affordances and the empty state">
          <Row>
            <Pagination page={page} pages={12} onPage={setPage} />
            <CopyButton value="macterm-cli --deploy --region tok1" />
            <InlineCode>npm run build</InlineCode>
          </Row>
          <CodeBlock code={'zmk deploy --env production\nzmk logs --follow --tail 100'} />
          <EmptyScreen
            icon={Circle}
            headline="No event types yet"
            description="Create your first booking link to let members schedule time with your team."
          >
            <Button variant="primary" size="sm"><Plus className="size-3.5" /> New event type</Button>
          </EmptyScreen>
        </Section>
      </div>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="New event type"
        description="Booking links your team shares"
        footer={
          <>
            <DialogClose onClick={() => setDialog(false)} />
            <DialogAction onClick={() => { setDialog(false); toast({ title: 'Event type created', variant: 'success' }); }}>
              Create
            </DialogAction>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Field label="Name" required htmlFor="dlg-name"><Input id="dlg-name" placeholder="Team preview" autoFocus /></Field>
          <Field label="Location"><Select value={sel} onChange={setSel} options={[{ value: 'tokyo', label: 'Tokyo' }, { value: 'paris', label: 'Paris' }]} /></Field>
        </div>
      </Dialog>

      <AlertDialog
        open={alert}
        onClose={() => setAlert(false)}
        title="Delete event type?"
        description="Members will lose their booking link. This cannot be undone."
        onConfirm={() => { setAlert(false); toast({ title: 'Event type deleted', variant: 'error' }); }}
        confirmLabel="Delete"
        destructive
      />

      <Toaster />
    </Shell>
  );
}

const ClearBoth = ({ children }) => <div className="flex flex-col gap-2">{children}</div>;
