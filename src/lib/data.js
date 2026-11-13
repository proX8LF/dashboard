/* mock data for the management dashboard — titles/emails/domains are synthetic */

export const USER = {
  name: 'Amelia Joyce',
  email: 'amelia@softwaredelabs.com',
  initials: 'AJ',
  role: 'Owner',
};

export const WORKSPACE = {
  org: 'Software DevLabs',
  sub: 'Production',
  initials: 'SD',
};

const TODAY = (() => {
  const d = new Date();
  d.setHours(13, 0, 0, 0);
  return d;
})();
const iso = (dayOffset, hour, min) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, min ?? 0, 0, 0);
  return d.toISOString();
};

export const BOOKINGS = [
  {
    ref: '#PWA7NK',
    title: 'Design sync',
    attendees: [
      { name: 'May Girone', initials: 'MG', email: 'may@girone.dev' },
      { name: 'Jose Louis', initials: 'JL', email: 'joselouis@allsons.io' },
    ],
    start: iso(0, 13, 30),
    end: iso(0, 14, 15),
    eventType: 'Design sync',
    duration: 45,
    location: 'Google Meet',
    status: 'confirmed',
  },
  {
    ref: '#PW96H5',
    title: 'Product demo - Enterprise',
    attendees: [
      { name: 'Anna Lisa', initials: 'AL', email: 'anna.lisa@foxinternet.co' },
      { name: 'Marcus Kane', initials: 'MK', email: 'marcus.kane@bluemail.com' },
    ],
    start: iso(0, 16, 0),
    end: iso(0, 16, 30),
    eventType: 'Product demo',
    duration: 30,
    location: 'Zoom',
    status: 'confirmed',
  },
  {
    ref: '#PWB2TQ',
    title: 'Quarterly review',
    attendees: [
      { name: 'Suc Leslie', initials: 'SL', email: 'suc.leslie@netcom.io' },
      { name: 'Aggie Aison', initials: 'AA', email: 'aggie@allsons.io' },
      { name: 'Yang Darwin', initials: 'YD', email: 'yang.darwin@bluemail.com' },
    ],
    start: iso(1, 10, 0),
    end: iso(1, 11, 0),
    eventType: 'Quarterly review',
    duration: 60,
    location: 'Cal Video',
    status: 'confirmed',
  },
  {
    ref: '#PW8D4M',
    title: 'Onboarding kickoff',
    attendees: [{ name: 'Floyd Miles', initials: 'FM', email: 'floyd.miles@vercel.com' }],
    start: iso(2, 9, 30),
    end: iso(2, 10, 15),
    eventType: 'Onboarding',
    duration: 45,
    location: 'Phone call',
    status: 'confirmed',
  },
  {
    ref: '#PW6K2R',
    title: 'Weekly standup',
    attendees: [{ name: 'Jackson White', initials: 'JW', email: 'jackson.white@bluemail.com' }],
    start: iso(3, 15, 0),
    end: iso(3, 15, 30),
    eventType: 'Weekly standup',
    duration: 30,
    location: 'Google Meet',
    status: 'pending',
  },
  {
    ref: '#PW5FA9',
    title: 'Technical roundtable',
    attendees: [
      { name: 'Astatine Don', initials: 'AD', email: 'astatine@netcom.io' },
      { name: 'Maya Kelly', initials: 'MK', email: 'maya.kelly@stripemail.com' },
    ],
    start: iso(4, 11, 0),
    end: iso(4, 12, 0),
    eventType: 'Roundtable',
    duration: 60,
    location: 'Cal Video',
    status: 'confirmed',
  },
  {
    ref: '#PW4XB7',
    title: 'Onboarding kickoff',
    attendees: [{ name: 'Landon Smith', initials: 'LS', email: 'landon.smith@vulture.com' }],
    start: iso(-6, 9, 30),
    end: iso(-6, 10, 15),
    eventType: 'Onboarding',
    duration: 45,
    location: 'Phone call',
    status: 'confirmed',
  },
  {
    ref: '#PW3NB2',
    title: 'Product demo - SMB',
    attendees: [{ name: 'Kaitlyn Ward', initials: 'KW', email: 'kaitlyn.ward@allsons.io' }],
    start: iso(-9, 14, 0),
    end: iso(-9, 14, 30),
    eventType: 'Product demo',
    duration: 30,
    location: 'Zoom',
    status: 'canceled',
  },
  {
    ref: '#PW2MK5',
    title: "Doctor's visit",
    attendees: [{ name: 'Timmy Parker', initials: 'TP', email: 'timmy.parker@vulture.com' }],
    start: iso(-2, 11, 0),
    end: iso(-2, 11, 30),
    eventType: "Doctor's visit",
    duration: 30,
    location: 'Google Meet',
    status: 'confirmed',
  },
  {
    ref: '#PW1TC8',
    title: 'Sample rescheduling',
    attendees: [{ name: 'Jane Doe', initials: 'JD', email: 'jane.doe@allsons.io' }],
    start: iso(-14, 10, 0),
    end: iso(-14, 10, 30),
    eventType: 'Sample',
    duration: 30,
    location: 'Phone call',
    status: 'pending',
  },
];

export const EVENT_TYPES = [
  {
    id: 1,
    title: '15min meeting',
    slug: '15min',
    duration: 15,
    price: null,
    location: 'Google Meet',
    hosts: [{ initials: 'AJ' }],
    hidden: false,
    apps: ['cal-video', 'google-calendar'],
  },
  {
    id: 2,
    title: '30min meeting',
    slug: '30min',
    duration: 30,
    price: null,
    location: 'Google Meet',
    hosts: [{ initials: 'AJ' }, { initials: 'MG' }],
    hidden: false,
    apps: ['cal-video', 'google-calendar'],
  },
  {
    id: 3,
    title: 'paid consulting',
    slug: 'consulting',
    duration: 60,
    price: '$45.00',
    location: 'Zoom',
    hosts: [{ initials: 'AJ' }],
    hidden: false,
    apps: ['stripe', 'zoom'],
  },
  {
    id: 4,
    title: 'New product launch call',
    slug: 'launch-call',
    duration: 30,
    price: null,
    location: 'Cal Video',
    hosts: [{ initials: 'TK' }],
    hidden: false,
    apps: ['cal-video', 'google-calendar'],
  },
  {
    id: 5,
    title: 'yearly planning call',
    slug: 'planning',
    duration: 90,
    price: null,
    location: 'Phone call',
    hosts: [{ initials: 'MG' }, { initials: 'SB' }],
    hidden: true,
    apps: ['google-calendar'],
  },
];

export const MEMBERS = [
  { name: 'Amelia Joyce', username: 'amelia', email: 'amelia@softwaredelabs.com', initials: 'AJ', role: 'OWNER', joined: iso(-220, 9), timeZone: 'Europe/Amsterdam' },
  { name: 'Tanisha Kollock', username: 'tanisha', email: 'tanisha@kollock.io', initials: 'TK', role: 'ADMIN', joined: iso(-98, 9), timeZone: 'America/Chicago' },
  { name: 'Marcus Mayrante', username: 'marcus', email: 'marcus@bluemail.com', initials: 'MM', role: 'ADMIN', joined: iso(-52, 9), timeZone: 'America/Sao_Paulo' },
  { name: 'Janet Garton', username: 'janet', email: 'janet@politik.io', initials: 'JG', role: 'MEMBER', joined: iso(-21, 9), timeZone: 'Europe/London' },
  { name: 'Brooklyn Simmons', username: 'b.simmons', email: 'brooklyn@example.com', initials: 'BS', role: 'MEMBER', joined: iso(-9, 9), timeZone: 'Asia/Dubai' },
];

export const INVITED = [{ email: 'jordan@bluemail.com', sent: iso(-2, 9) }, { email: 'sam.k@netcom.io', sent: iso(-1, 9) }];

export const TEAMS = [
  { name: 'Design Ops', initials: 'DO', members: 5, role: 'OWNER' },
  { name: 'Sales - UAE', initials: 'SU', members: 12, role: 'ADMIN' },
  { name: 'Engineering', initials: 'EN', members: 9, role: 'MEMBER' },
];

export const AVAILABILITY = [
  { title: 'Working Hours', avatar: 'AJ', days: { Sun: null, Mon: ['9:00 AM - 5:00 PM'], Tue: ['9:00 AM - 5:00 PM'], Wed: ['9:00 AM - 5:00 PM'], Thu: ['9:00 AM - 5:00 PM'], Fri: ['9:00 AM - 3:00 PM'], Sat: null } },
  { title: 'EU Working Hours', avatar: 'TK', days: { Sun: null, Mon: ['9:00 AM - 5:00 PM'], Tue: ['9:00 AM - 5:00 PM'], Wed: ['9:00 AM - 5:00 PM'], Thu: ['9:00 AM - 5:00 PM'], Fri: null, Sat: null } },
  { title: 'us.com 24/7 for auditions', avatar: 'MM', days: { Sun: ['8:00 AM - 8:00 PM'], Mon: ['8:00 AM - 8:00 PM'], Tue: ['8:00 AM - 8:00 PM'], Wed: ['8:00 AM - 8:00 PM'], Thu: ['8:00 AM - 8:00 PM'], Fri: ['8:00 AM - 8:00 PM'], Sat: ['8:00 AM - 2:00 PM'] } },
];

export const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const INSIGHTS = {
  createdEvents: [
    { label: 'Sun', value: 12 }, { label: 'Mon', value: 18 }, { label: 'Tue', value: 25 },
    { label: 'Wed', value: 21 }, { label: 'Thu', value: 30 }, { label: 'Fri', value: 9 },
    { label: 'Sat', value: 4 },
  ],
  eventTypesSplit: [
    { label: '30min meeting', value: 45, color: 'var(--chart-blue)' },
    { label: '15min meeting', value: 28, color: 'var(--chart-green)' },
    { label: 'paid consulting', value: 14, color: 'var(--chart-amber)' },
    { label: 'New product launch call', value: 8, color: 'var(--chart-purple)' },
    { label: 'yearly planning call', value: 5, color: 'var(--chart-red)' },
  ],
  noShowPct: 4,
  /* trailing series behind each headline stat */
  sparks: {
    created: [14, 17, 15, 22, 18, 26, 21, 27],
    completion: [74, 76, 75, 78, 77, 79, 81],
    noShow: [9, 8, 7, 6, 6, 5, 4],
    lead: [3.4, 3.6, 3.5, 3.9, 4.0, 4.1, 4.2],
  },
};

/* how completed sessions actually resolved, this month */
export const OUTCOMES = [
  { label: 'Completed', value: 74, color: 'var(--chart-green)' },
  { label: 'Rescheduled', value: 14, color: 'var(--chart-amber)' },
  { label: 'Canceled', value: 8, color: 'var(--chart-purple)' },
  { label: 'No-show', value: 4, color: 'var(--chart-red)' },
];

/* how far ahead people book */
export const LEAD_TIME = [
  { label: 'Same day', value: '8%', pct: 8, color: 'var(--chart-cyan)' },
  { label: '1-3 days', value: '21%', pct: 21, color: 'var(--chart-green)' },
  { label: '4-7 days', value: '38%', pct: 38, color: 'var(--chart-blue)' },
  { label: '1-2 weeks', value: '24%', pct: 24, color: 'var(--chart-amber)' },
  { label: '2+ weeks', value: '9%', pct: 9, color: 'var(--chart-purple)' },
];

/* per-member booking load this month */
export const TEAM_LOAD = [
  { label: 'Amelia Joyce - Owner', value: '38 bookings', pct: 92, color: 'var(--chart-blue)' },
  { label: 'Tanisha Kollock - Admin', value: '24 bookings', pct: 58, color: 'var(--chart-green)' },
  { label: 'Marcus Mayrante - Admin', value: '17 bookings', pct: 41, color: 'var(--chart-amber)' },
  { label: 'Janet Garton - Member', value: '11 bookings', pct: 27, color: 'var(--chart-cyan)' },
  { label: 'Brooklyn Simmons - Member', value: '6 bookings', pct: 14, color: 'var(--chart-purple)' },
];

/* workspace activity feed (latest first) */
export const ACTIVITY = [
  { actor: 'Amelia Joyce', color: 'var(--chart-blue)', text: 'sent the booking confirmation for #PWA7NK - Design sync', time: '18 min ago' },
  { actor: 'May Girone', color: 'var(--chart-green)', text: 'completed the paid consulting session #PW9B41 - $45.00 collected', time: '1 hr ago' },
  { actor: 'Tanisha Kollock', color: 'var(--chart-amber)', text: 'opened Friday for the EU Working Hours schedule', time: '3 hrs ago' },
  { actor: 'System', color: 'var(--chart-purple)', text: 'synced 12 events to google-calendar without conflicts', time: '5 hrs ago' },
  { actor: 'Marcus Mayrante', color: 'var(--chart-red)', text: 'canceled #PW3NB2 - Product demo, reason: no-show', time: 'Yesterday' },
  { actor: 'Janet Garton', color: 'var(--chart-cyan)', text: 'invited sam.k@netcom.io to the workspace', time: '2 days ago' },
];

/* booking density — days x hour buckets, intensity 0..4 */
export const HEAT = {
  days: WEEK,
  hours: ['8', '10', '12', '14', '16', '18', '20'],
  levels: [
    [0, 1, 1, 2, 2, 1, 0],
    [1, 3, 4, 4, 3, 2, 0],
    [0, 3, 4, 4, 3, 1, 0],
    [1, 2, 4, 4, 3, 2, 1],
    [2, 3, 4, 4, 4, 2, 0],
    [1, 2, 3, 2, 2, 1, 0],
    [0, 0, 1, 1, 0, 0, 0],
  ],
};
