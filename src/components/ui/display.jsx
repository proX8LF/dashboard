import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { IconButton } from './index.jsx';

/*
  Mastra display port: loading surfaces, progress rungs, status notices,
  copy affordances, mono code blocks, pagination on the raised pill.
*/

/* ---------- loading ---------- */

export const Skeleton = ({ className = 'h-5 w-full' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded-md bg-fill ${className}`} />
);

export const Shimmer = ({ className = 'h-5 w-full' }) => (
  <div aria-hidden="true" className={`relative overflow-hidden rounded-md bg-fill ${className}`}>
    <span className="absolute inset-0 -translate-x-full animate-shimmer bg-[linear-gradient(90deg,transparent,var(--fill-strong),transparent)]" />
  </div>
);

export const Spinner = ({ className = 'size-4', 'aria-label': ariaLabel }) => (
  <span
    role="status"
    aria-label={ariaLabel}
    className={`inline-block shrink-0 animate-spin rounded-full border-2 border-border border-t-foreground ${className}`}
  />
);

/* ---------- progress ---------- */

const METER_COLOR = {
  success: 'bg-success-indicator',
  info: 'bg-info-indicator',
  warning: 'bg-warning-indicator',
  error: 'bg-destructive-indicator',
};

export const Progress = ({ value = 0, max = 100, className = '' }) => (
  <div
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={max}
    className={`h-1 w-full overflow-hidden rounded-full bg-fill ${className}`}
  >
    <div
      className="h-full rounded-full bg-foreground transition-[width] duration-normal ease-out"
      style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
    />
  </div>
);

export const Meter = ({ value = 0, max = 100, variant = 'info', className = '' }) => (
  <div
    role="meter"
    aria-valuenow={value}
    aria-valuemin={0}
    aria-valuemax={max}
    className={`h-1.5 w-full overflow-hidden rounded-full bg-fill ${className}`}
  >
    <div
      className={`h-full rounded-full transition-[width] duration-normal ease-out ${METER_COLOR[variant] || METER_COLOR.info}`}
      style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
    />
  </div>
);

/* ---------- notice ---------- */

const NOTICE = {
  success: 'bg-success-subtle text-success-foreground after:bg-success-indicator',
  info: 'bg-info-subtle text-info-foreground after:bg-info-indicator',
  warning: 'bg-warning-subtle text-warning-foreground after:bg-warning-indicator',
  error: 'bg-destructive-subtle text-destructive-foreground after:bg-destructive-indicator',
};

export const Notice = ({ variant = 'info', title, children, className = '' }) => (
  <div
    role="status"
    className={`relative flex gap-2.5 rounded-xl p-3 text-caption ${NOTICE[variant] || NOTICE.info} ${className}`}
  >
    <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-current" />
    <div className="min-w-0">
      {title ? <p className="text-subheading">{title}</p> : null}
      {children ? <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div> : null}
    </div>
  </div>
);

/* ---------- copy ---------- */

export const useCopied = (timeout = 1500) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const copy = (value) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(String(value));
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), timeout);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return [copied, copy];
};

export const CopyButton = ({ value, className = '' }) => {
  const [copied, copy] = useCopied();
  return (
    <IconButton label={copied ? 'Copied' : 'Copy'} className={className} onClick={() => copy(value)}>
      {copied ? <Check className="size-3.5 text-success-foreground" /> : <Copy className="size-3.5" />}
    </IconButton>
  );
};

/* ---------- code ---------- */

export const InlineCode = ({ children, className = '' }) => (
  <code className={`shadow-inset rounded-md bg-fill px-1.5 py-0.5 font-mono text-caption text-foreground ${className}`}>
    {children}
  </code>
);

export const CodeBlock = ({ code = '', className = '', copyable = true }) => (
  <div className={`shadow-raised group relative rounded-xl bg-card p-1 ${className}`}>
    <div className="flex items-center justify-between rounded-lg bg-background px-3 pb-2 pt-1.5">
      <span className="font-mono text-meta text-muted-foreground">code</span>
      {copyable ? <CopyButton value={code} className="-mr-1.5 opacity-0 group-hover:opacity-100" /> : null}
    </div>
    <pre className="wrap-anywhere overflow-x-auto px-3 pb-3 pt-1 font-mono text-caption text-foreground">
      <code>{typeof code === 'string' ? code : JSON.stringify(code, null, 2)}</code>
    </pre>
  </div>
);

/* ---------- pagination ---------- */

const pageWindow = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of list) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
};

export const Pagination = ({ page = 1, pages = 1, onPage, className = '' }) => (
  <nav
    aria-label="Pagination"
    className={`shadow-raised inline-flex h-control-md shrink-0 items-center gap-0.5 rounded-full bg-card px-1 ${className}`}
  >
    <IconButton label="Previous page" disabled={page <= 1} onClick={() => onPage && onPage(page - 1)} className="h-control-sm w-control-sm">
      <ChevronLeft className="size-3.5" />
    </IconButton>
    {pageWindow(page, pages).map((p, i) =>
      p === '…' ? (
        <span key={`gap-${i}`} className="px-0.5 text-meta text-muted-foreground">
          …
        </span>
      ) : (
        <button
          key={p}
          type="button"
          aria-current={p === page ? 'page' : undefined}
          onClick={() => onPage && onPage(p)}
          className={`inline-flex h-control-sm min-w-6 cursor-pointer items-center justify-center rounded-md px-0.5 font-mono text-caption tabular-nums transition-colors duration-normal ${
            p === page ? 'bg-fill text-foreground' : 'text-muted-foreground hover:bg-fill-subtle hover:text-foreground'
          }`}
        >
          {p}
        </button>
      ),
    )}
    <IconButton label="Next page" disabled={page >= pages} onClick={() => onPage && onPage(page + 1)} className="h-control-sm w-control-sm">
      <ChevronRight className="size-3.5" />
    </IconButton>
  </nav>
);

/* ---------- field/label ---------- */

export const Label = ({ children, required, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-caption text-muted-foreground ${className}`}>
    {children}
    {required ? <span aria-hidden="true" className="ml-0.5 text-destructive-foreground">*</span> : null}
  </label>
);

export const Field = ({ label, required, description, htmlFor, children, className = '' }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label ? (
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
    ) : null}
    {children}
    {description ? <p className="text-meta text-muted-foreground">{description}</p> : null}
  </div>
);

/* ---------- scroll area (thin, global scrollbar styling applies) ---------- */

export const ScrollArea = ({ className = '', children, ...props }) => (
  <div className={`overflow-auto ${className}`} {...props}>
    {children}
  </div>
);
