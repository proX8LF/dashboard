import React, { useContext, useEffect, useRef, useState } from 'react';
import { Sparkles, SendHorizontal, X } from 'lucide-react';
import { Badge, Input, Switch } from '../ui';

/*
  Mastra playground-style chat rail.
  Desktop: docked column beside the page content, inside the app frame.
  Mobile: full-screen overlay. State persists in localStorage.
*/

export const CopilotContext = React.createContext(null);

/* Context can read null under HMR module duplication (vite dev) — never crash on it. */
const NO_COPILOT = { open: false, setOpen: () => {} };
export const useCopilot = () => useContext(CopilotContext) || NO_COPILOT;

export function CopilotProvider({ children }) {
  const [open, setOpen] = useState(() => {
    try { return localStorage.getItem('dashboard-copilot') === 'open'; } catch { return false; }
  });
  return (
    <CopilotContext.Provider
      value={{
        open,
        setOpen: (v) => {
          setOpen(v);
          try { localStorage.setItem('dashboard-copilot', v ? 'open' : 'closed'); } catch { /* ignore */ }
        },
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
}

const GREETING = {
  role: 'assistant',
  text: "I'm loaded with your workspace context. Ask me about bookings, member load or event types - or pick one of the flavors below.",
};

const SUGGESTIONS = ['Summarize this week', 'Team load', 'Top event types'];

const mockReply = (q) => {
  const s = q.toLowerCase();
  if (/(book|schedule|week|summary|summarize)/.test(s))
    return '119 bookings this week, up 8 on last week. Completion sits at 80.6% with a single cancellation - Tuesday 9am with a new client. Thursday is your peak at 30 sessions.';
  if (/(member|team|load)/.test(s))
    return 'Amelia carries 32% of all sessions this month, 12 points above the team average. Jonas and Priya are underbooked - I can shift two Thursday previews to them if you want to balance.';
  if (/(event type|service|type)/.test(s))
    return 'Four event types are live. "Team preview" wins conversions with 34% of all bookings but runs the longest sessions. "Consult" has the best completion rate.';
  if (/(insight|report|stat)/.test(s))
    return 'Highlights: bookings +8%, retention steady at 96% of seats filled, and only one cancellation. No action needed on capacity before Friday.';
  return '';
};

const Bubble = ({ msg }) =>
  msg.role === 'user' ? (
    <div className="flex justify-end">
      <div className="max-w-[85%] rounded-xl bg-fill px-3 py-2 text-body-sm text-foreground">{msg.text}</div>
    </div>
  ) : (
    <div className="flex items-start gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-black">
        <Sparkles className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1 pt-0.5 text-body-sm text-foreground">{msg.text}</div>
    </div>
  );

export const CopilotPane = ({ onClose }) => {
  const [messages, setMessages] = useState([GREETING]);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState('');
  const [memory, setMemory] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const send = (value) => {
    const text = (value ?? draft).trim();
    if (!text || busy) return;
    setDraft('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setBusy(true);
    const reply = mockReply(text);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: reply || "Noted. I can summarize bookings, audit member load or review event types - one of those usually helps." },
      ]);
      setBusy(false);
    }, 500);
  };

  return (
    <div className="flex h-full min-w-[20rem] flex-col bg-background">
      {/* rail header */}
      <div className="flex h-header-default shrink-0 items-center gap-2 border-b border-border px-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-black">
          <Sparkles className="size-3.5" />
        </span>
        <span className="flex-1 truncate text-heading text-foreground">Copilot</span>
        <Badge variant="gray" className="font-mono text-meta">gpt-4.1-mini</Badge>
        <span className="ml-1 hidden items-center gap-1.5 sm:flex" title="Memory">
          <span className="text-meta uppercase text-placeholder">Mem</span>
          <Switch checked={memory} onChange={setMemory} />
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-fill-subtle hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {busy ? (
          <div className="flex items-center gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green text-black">
              <Sparkles className="size-3.5" />
            </span>
            <span className="flex gap-1 pt-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:150ms]" />
              <span className="size-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:300ms]" />
            </span>
          </div>
        ) : null}
      </div>

      {/* suggestions */}
      <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto px-3 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="shadow-inset shrink-0 whitespace-nowrap rounded-full bg-fill px-2.5 py-1 text-caption text-muted-foreground transition-colors hover:bg-fill-hover hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {/* composer */}
      <div className="shrink-0 p-3">
        <form
          className="relative"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask your workspace…"
            aria-label="Message Copilot"
            className="pr-10"
          />
          <button
            type="submit"
            aria-label="Send message"
            className="absolute right-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-fill-inverse text-sidebar transition-colors hover:bg-fill-inverse-hover disabled:opacity-50"
            disabled={!draft.trim() || busy}
          >
            <SendHorizontal className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
