import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart2, CalendarCheck2, Clock, Component, LayoutDashboard, Lock, Menu, MessageSquare, Moon,
  PanelLeftClose, PanelLeftOpen,
  Search, Settings as SettingsIcon, Sun, Users, X, Plus,
} from 'lucide-react';
import { Avatar, Button, IconButton, Kbd } from '../ui';
import { USER, WORKSPACE } from '../../lib/data';
import { useTheme } from '../../lib/theme';
import { CopilotPane, CopilotProvider, useCopilot } from './Copilot';

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { to: '/event-types', label: 'Event Types', icon: Clock },
  { to:'/availability', label: 'Availability', icon: CalendarCheck2 },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/insights', label: 'Insights', icon: BarChart2 },
  { to: '/components', label: 'Components', icon: Component },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

const TITLES = {
  '/': 'Overview',
  '/bookings': 'Bookings',
  '/event-types': 'Event Types',
  '/availability': 'Availability',
  '/members': 'Members',
  '/insights': 'Insights',
  '/components': 'Components',
  '/settings': 'Settings',
};

/* sidebar nav row: rounded-lg label rung, active = fill (Mastra) */
const SidebarLink = ({ to, icon: Icon, label, end, onNavigate }) => (
  <NavLink
    to={to}
    end={!!end}
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex h-control-md min-w-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-2.5 text-label transition-colors ${
        isActive ? 'bg-fill text-foreground' : 'text-muted-foreground hover:bg-fill-subtle hover:text-foreground'
      }`
    }
  >
    <Icon className="size-4 shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

const Sidebar = ({ open, collapsed, onClose }) => (
  <>
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-sidebar p-2 duration-300 transition-transform ${
        open ? 'translate-x-0' : '-translate-x-full'
      } ${collapsed ? 'lg:-translate-x-full' : 'lg:translate-x-0'}`}
    >
      {/* brand + search trigger */}
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <NavLink to="/" className="flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-fill-subtle">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-[11px] font-bold text-black">
            SD
          </span>
          <span className="min-w-0">
            <span className="block truncate text-label leading-none text-foreground">Software DevLabs</span>
            <span className="mt-1 block text-meta uppercase leading-none text-placeholder">{WORKSPACE.sub}</span>
          </span>
        </NavLink>
        <IconButton label="Close navigation" className="lg:hidden" onClick={onClose}>
          <X className="size-4" />
        </IconButton>
      </div>

      <button
        type="button"
        className="mb-2 hidden h-control-md w-full items-center gap-2 rounded-lg bg-fill px-2.5 text-label text-muted-foreground transition-colors hover:text-foreground lg:flex"
        aria-label="Search workspace"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search</span>
        <Kbd className="h-5 min-w-5 px-1 text-meta">/</Kbd>
      </button>

      <div className="px-1 pb-2">
        <Button variant="primary" size="base" className="w-full">
          <Plus className="size-4" /> Create booking
        </Button>
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto px-1 pb-2">
        <p className="px-2.5 pb-1 pt-2 text-eyebrow uppercase text-placeholder">Workspace</p>
        {NAV.slice(0, 7).map((item) => (
          <SidebarLink key={item.to} {...item} onNavigate={onClose} />
        ))}
        <div className="my-2 h-px bg-border" />
        <SidebarLink to="/settings" icon={SettingsIcon} label="Settings" onNavigate={onClose} />
      </nav>

      {/* footer user */}
      <div className="px-1 pt-2">
        <NavLink
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-lg p-2 transition-colors hover:bg-fill-subtle"
        >
          <Avatar initials={USER.initials} />
          <span className="min-w-0 leading-none">
            <span className="block truncate text-label text-foreground">{USER.name}</span>
            <span className="mt-1 block text-caption text-muted-foreground">{USER.role}</span>
          </span>
        </NavLink>
      </div>
    </aside>

    {open ? (
      <div className="fixed inset-0 z-30 bg-scrim lg:hidden" onClick={onClose} aria-hidden="true" />
    ) : null}
  </>
);

export const Shell = ({ children }) => (
  <CopilotProvider>
    <AppShellInner>{children}</AppShellInner>
  </CopilotProvider>
);

const AppShellInner = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, toggle } = useTheme();
  const { pathname } = useLocation();
  const { open: chatOpen, setOpen: setChatOpen } = useCopilot();
  const [collapsed, setCollapsed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('dashboard-sidebar') === 'collapsed'
  );

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('dashboard-sidebar', next ? 'collapsed' : 'open'); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-sidebar">
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} />

      <div
        className={`flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ${
          collapsed ? 'lg:pl-0' : 'lg:pl-60'
        } ${chatOpen ? 'lg:pr-80' : ''}`}
      >
        {/* mobile header */}
        <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border bg-sidebar px-3 lg:hidden">
          <button
            type="button"
            className="-ml-1 rounded-lg p-2 text-muted-foreground hover:bg-fill-subtle hover:text-foreground"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </button>
          <span className="text-subheading text-foreground">{TITLES[pathname] || 'Overview'}</span>
          <Avatar initials={USER.initials} />
        </header>

        {/* app frame (MainCard) */}
        <div className="flex min-h-0 flex-1 flex-col p-0 lg:p-2 lg:pl-0">
          <div className="bg-background shadow-raised min-h-0 flex-1 overflow-hidden lg:rounded-2xl lg:p-px">
            {/* in-card header — doc bar with sidebar dock toggle */}
            <div className="flex h-header-default w-full items-center gap-2 px-3">
              <button
                type="button"
                className="-ml-1 rounded-lg p-1.5 text-muted-foreground hover:bg-fill-subtle hover:text-foreground lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="size-4" />
              </button>
              <IconButton
                label={collapsed ? 'Open sidebar' : 'Close sidebar'}
                onClick={toggleSidebar}
                className="hidden lg:ml-1 lg:inline-flex"
              >
                {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
              </IconButton>
              <span className="text-caption text-muted-foreground">{TITLES[pathname] || 'Overview'}</span>

              <div className="ml-auto flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="hidden h-control-sm items-center gap-2 rounded-full bg-field px-3 text-label text-muted-foreground shadow-input transition-colors hover:text-foreground md:flex"
                  aria-label="Search"
                >
                  <Search className="size-3.5" />
                  <span>Search</span>
                  <Kbd className="h-5 min-w-5 px-1 text-meta">/</Kbd>
                </button>
                <IconButton
                  label={chatOpen ? 'Close chat' : 'Open chat'}
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`hidden md:inline-flex ${chatOpen ? 'bg-fill text-foreground' : ''}`}
                >
                  <MessageSquare className="size-4" />
                </IconButton>
                <IconButton label="Toggle theme" onClick={toggle}>
                  {resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </IconButton>
                <IconButton label="Notifications" className="relative">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="size-4">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-red" />
                </IconButton>
                <div className="mx-1 hidden h-6 w-px bg-border md:block" />
                <Avatar initials={USER.initials} className="hidden md:inline-flex" />
              </div>
            </div>

            <main className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-2 md:px-6">{children}</main>
          </div>
        </div>
      </div>

      {/* Mastra-style chat rail — docked, full height, right of the canvas */}
      <aside
        aria-hidden={!chatOpen}
        className={`fixed inset-y-0 right-0 z-30 hidden transition-[width,border-color] duration-300 lg:flex ${
          chatOpen ? 'w-80 border-l border-border bg-background' : 'w-0 overflow-hidden'
        }`}
      >
        {chatOpen ? <CopilotPane onClose={() => setChatOpen(false)} /> : null}
      </aside>

      {/* mobile overlay chat */}
      {chatOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          <CopilotPane onClose={() => setChatOpen(false)} />
        </div>
      ) : null}
    </div>
  );
};

/* page header — Mastra page-header grammar */
export const PageHeader = ({ eyebrow = 'Private Workspace', title, description, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 pt-2">
    <div className="min-w-0 flex-1">
      <p className="mb-1.5 flex items-center gap-1.5 text-eyebrow uppercase text-muted-foreground">
        <Lock className="size-3" />
        {eyebrow}
      </p>
      <h1 className="text-display text-foreground">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-body text-muted-foreground">{description}</p> : null}
    </div>
    {action}
  </div>
);

/* tabs — Mastra pill track */
export const ViewTabs = ({ tabs, active, onChange }) => (
  <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
    <div className="flex w-fit items-center gap-1 rounded-full bg-fill-subtle p-1">
      {tabs.map((t) => (
        <button
          key={t.label ?? t}
          type="button"
          onClick={() => onChange?.(t.value ?? t)}
          className={`flex h-control-sm items-center whitespace-nowrap rounded-full px-3 text-label transition-colors ${
            (t.value ?? t) === active
              ? 'bg-fill-hover text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {t.label ?? t}
        </button>
      ))}
    </div>
  </div>
);

/* role pills (Members page) */
export const RoleBadge = ({ role }) => {
  const label = role === 'OWNER' ? 'Owner' : role === 'ADMIN' ? 'Admin' : 'Member';
  const dot =
    role === 'OWNER' ? 'bg-chart-orange' : role === 'ADMIN' ? 'bg-chart-blue' : 'bg-placeholder';
  return (
    <span className="shadow-inset inline-flex items-center gap-1.5 rounded-[7px] bg-fill px-1.5 py-0.5 text-caption text-muted-foreground">
      <span className={`size-1.5 rounded-full ${dot}`} />
      <span>{label}</span>
    </span>
  );
};
