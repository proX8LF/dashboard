import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

/*
  info-presenting components.
  every color flows through the token vars (--chart-* / --fill, passed as inline styles),
  so these read correctly in both light and dark without variant classes.
*/

/* ---------- sparkline ---------- */

export const Sparkline = ({ values = [], w = 104, h = 34, color = 'var(--chart-blue)', className = '' }) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * (w - 4) + 2,
    h - 4 - ((v - min) / span) * (h - 9),
  ]);
  const line = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const [ex, ey] = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden className={className}>
      <polyline
        points={line}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={ex} cy={ey} r="2.25" fill={color} />
    </svg>
  );
};

/* ---------- stat block (label / value / delta / optional spark) ---------- */

export const StatBlock = ({ label, value, delta, spark, sparkColor = 'var(--chart-blue)' }) => {
  const up = !delta || delta.dir !== 'down';
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <div className="min-w-0">
      <p className="text-label text-placeholder">{label}</p>
      <p className="mt-1 text-[26px] font-semibold leading-none tracking-tight text-foreground">{value}</p>
      {spark ? <Sparkline values={spark} color={sparkColor} className="mt-3" /> : null}
      {delta ? (
        <p className="mt-2 flex items-center gap-1 text-label">
          <Icon className={`h-3.5 w-3.5 ${up ? 'text-success-foreground' : 'text-destructive-foreground'}`} />
          <span className={up ? 'text-success-foreground' : 'text-destructive-foreground'}>{delta.text}</span>
          <span className="text-muted-foreground">{delta.span}</span>
        </p>
      ) : null}
    </div>
  );
};

/* ---------- horizontal bars (pct passed precomputed, 0..100) ---------- */

export const HBars = ({ items = [], className = '' }) => (
  <div className={className}>
    {items.map((it) => (
      <div key={it.label} className="mb-3.5 last:mb-0">
        <div className="mb-1.5 flex items-baseline justify-between gap-3 text-label">
          <span className="truncate text-foreground">{it.label}</span>
          <span className="shrink-0 text-muted-foreground">{it.value}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-fill">
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.max(it.pct ?? 100, 2)}%`, background: it.color }}
          />
        </div>
      </div>
    ))}
  </div>
);

/* ---------- stacked split bar + legend ---------- */

export const StackedSplit = ({ items = [], className = '' }) => (
  <div className={className}>
    <div className="flex h-2 gap-px overflow-hidden rounded-full">
      {items.map((it) => (
        <span key={it.label} title={`${it.label} — ${it.value}`} style={{ width: `${it.value}%`, background: it.color }} />
      ))}
    </div>
    <div className="mt-4 space-y-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2.5 text-label">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: it.color }} />
          <span className="flex-1 truncate text-foreground">{it.label}</span>
          <span className="text-muted-foreground">{it.value}%</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- donut ---------- */

export const Donut = ({ items = [], size = 168, thickness = 4.2, center = null }) => {
  const total = items.reduce((a, it) => a + it.value, 0) || 1;
  let acc = 0;
  return (
    <span className="relative inline-flex" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42" width={size} height={size}>
        <circle cx="21" cy="21" r="15.9155" fill="none" stroke="var(--fill)" strokeWidth={thickness} />
        {items.map((it) => {
          const pct = (it.value / total) * 100;
          const seg = Math.max(pct - 0.8, 0.4);
          const el = (
            <circle
              key={it.label}
              cx="21"
              cy="21"
              r="15.9155"
              fill="none"
              stroke={it.color}
              strokeWidth={thickness}
              strokeDasharray={`${seg} ${100 - seg}`}
              strokeDashoffset={25 - acc}
              transform="rotate(0 21 21)"
            />
          );
          acc += pct;
          return el;
        })}
      </svg>
      {center ? (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-medium leading-none tracking-tight text-foreground">{center.value}</span>
          {center.label ? <span className="mt-1 text-caption text-placeholder">{center.label}</span> : null}
        </span>
      ) : null}
    </span>
  );
};

/* ---------- activity feed ---------- */

export const ActivityFeed = ({ items = [] }) => (
  <ol>
    {items.map((it, i) => (
      <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
        {i < items.length - 1 ? (
          <span className="absolute left-[3.5px] top-4 h-full w-px bg-fill-subtle" />
        ) : null}
        <span className="relative mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full" style={{ background: it.color }} />
        <div className="min-w-0 flex-1">
          <p className="text-label leading-snug text-muted-foreground">
            <span className="font-medium text-foreground">{it.actor}</span> {it.text}
          </p>
          <p className="mt-0.5 text-caption text-placeholder">{it.time}</p>
        </div>
      </li>
    ))}
  </ol>
);

/* ---------- heatmap (levels 0..4) ---------- */

export const Heatmap = ({ days = [], hours = [], matrix = [], className = '' }) => (
  <div className={className}>
    <div
      className="grid items-center"
      style={{ gridTemplateColumns: `3.5rem repeat(${days.length}, minmax(0, 1fr))` }}
    >
      <span />
      {days.map((d) => (
        <span key={d} className="pb-2 text-center text-meta uppercase tracking-wide text-placeholder">
          {d}
        </span>
      ))}
      {hours.map((h, hi) => (
        <React.Fragment key={h}>
          <span className="h-6 pr-2.5 text-right text-meta leading-6 text-placeholder">{h}</span>
          {matrix.map((row, di) => {
            const lvl = row[hi] ?? 0;
            return (
              <span key={di} className="flex justify-center px-[2px] py-[3px]">
                <span
                  className="h-5 w-full rounded-[3px] transition-colors"
                  style={{
                    background: lvl
                      ? `color-mix(in oklab, var(--chart-blue) ${lvl * 25}%, var(--fill))`
                      : 'var(--fill)',
                  }}
                  title={`${days[di]} ${h}:00 — level ${lvl}/4`}
                />
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </div>
    <div className="mt-3 flex items-center justify-end gap-1.5 text-meta text-placeholder">
      Low
      {[1, 2, 3, 4].map((l) => (
        <span
          key={l}
          className="h-2.5 w-2.5 rounded-[2px]"
          style={{ background: `color-mix(in oklab, var(--chart-blue) ${l * 25}%, var(--fill))` }}
        />
      ))}
      High
    </div>
  </div>
);
