import React from 'react';
import { useState } from 'react';
import { AlertTriangle, Bell } from 'lucide-react';
import { Avatar, Badge, Button, Input, Panel, Switch, Textarea } from '../components/ui';
import { PageHeader, Shell } from '../components/layout/Shell';
import { USER, WORKSPACE } from '../lib/data';
import { useTheme } from '../lib/theme';

const Field = ({ label, hint, children }) => (
  <div className="grid gap-4 md:grid-cols-5">
    <div className="md:col-span-2">
      <label className="block text-label text-foreground">{label}</label>
      {hint ? <p className="mt-1 text-body-sm text-muted-foreground">{hint}</p> : null}
    </div>
    <div className="md:col-span-3">{children}</div>
  </div>
);

export default function Settings() {
  const { theme, toggle } = useTheme();
  const [notifications, setNotifications] = useState({
    emails: true,
    sms: false,
    dailyDigest: true,
    canceled: true,
  });
  const [saved, setSaved] = useState(false);

  const fakeSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <Shell>
      <PageHeader
        eyebrow="Private Workspace"
        title="Workspace Settings"
        description="How the organization appears to bookers, plus notifications and security"
      />

      <div className="max-w-3xl space-y-6">
        <Panel
          title="Workspace"
          description="Basic information shown on booking pages."
          action={
            <Button variant="primary" size="base" onClick={fakeSave}>
              {saved ? 'Saved' : 'Update'}
            </Button>
          }
        >
          <div className="space-y-6">
            <Field label="Organization name" hint="Shown in booking confirmations.">
              <Input defaultValue={WORKSPACE.org} />
            </Field>
            <Field label="Subdomain" hint="Your booking links live under it.">
              <div className="flex items-center gap-2">
                <span className="text-label text-muted-foreground">softwaredelabs.com/</span>
                <Input defaultValue={WORKSPACE.sub.toLowerCase()} className="max-w-[180px]" />
              </div>
            </Field>
            <Field label="Logo" hint="Square, PNG or SVG, min 128x128.">
              <div className="flex items-center gap-3">
                <Avatar initials="SD" className="h-9 w-9 text-[11px]" />
                <Button variant="secondary" size="base">Upload</Button>
                <Button variant="ghost" size="base">Remove</Button>
              </div>
            </Field>
            <Field label="Bio" hint="Appears on your public booking page.">
              <Textarea
                rows={3}
                defaultValue="Software DevLabs builds premium product experiences. Book a slot and see how we work."
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Appearance" description="Interface theme for this workspace.">
          <div className="grid max-w-md grid-cols-3 gap-3">
            {['Light', 'Dark'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => theme !== t.toLowerCase() && toggle()}
                className={`flex flex-col gap-2 rounded-lg border p-3 text-label transition-colors ${
                  theme === t.toLowerCase()
                    ? 'border-strong text-foreground'
                    : 'border-border text-placeholder hover:border-border-strong'
                }`}
              >
                <span className="flex h-14 w-full gap-1 rounded-lg border border-border bg-fill p-2">
                  <span className={`h-full flex-[2] rounded-sm ${t === 'Light' ? 'bg-white' : 'bg-card'}`} />
                  <span className={`h-full flex-1 rounded-sm ${t === 'Light' ? 'bg-white' : 'bg-gray-2'}`} />
                </span>
                {t}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Notifications" description="What lands in your inbox.">
          <div className="mb-2 flex items-center gap-2 text-body-sm text-muted-foreground">
            <Avatar initials={USER.initials} />
            {USER.email}
          </div>
          <div className="divide-y divide-border">
            {[
              ['emails', 'Email notifications', 'Booking confirmations and reminders.'],
              ['sms', 'SMS notifications', 'Text alerts 1 hour before every meeting.'],
              ['dailyDigest', 'Daily digest', 'One email each morning with your schedule.'],
              ['canceled', 'Cancellation alerts', 'Know the moment a booking is dropped.'],
            ].map(([key, label, hint]) => (
              <div key={key} className="flex items-center justify-between gap-6 py-4">
                <div>
                  <p className="text-label text-foreground">{label}</p>
                  <p className="mt-0.5 text-body-sm text-muted-foreground">{hint}</p>
                </div>
                <Switch
                  checked={notifications[key]}
                  onChange={(v) => setNotifications((n) => ({ ...n, [key]: v }))}
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Security" description="Two-factor authentication and sessions.">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-label text-foreground">Two-factor authentication</p>
              <p className="mt-0.5 flex items-center gap-2 text-body-sm text-muted-foreground">
                TOTP app
                <Badge variant="success">Enabled</Badge>
              </p>
            </div>
            <Button variant="secondary" size="base">Manage</Button>
          </div>
        </Panel>

        <div className="flex items-start justify-between gap-6 rounded-lg border border-destructive-edge bg-background p-6">
          <div className="max-w-md">
            <p className="flex items-center gap-2 text-subheading font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
              Delete workspace
            </p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Permanently remove {WORKSPACE.org}, all event types and booking history. This cannot
              be undone.
            </p>
          </div>
          <Button variant="primary" size="base">Delete</Button>
        </div>
      </div>
    </Shell>
  );
}
