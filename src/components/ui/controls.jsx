import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Input } from './index.jsx';

/*
  Mastra controls port — sliding-thumb SegmentedControl, sliding-tabs,
  Select popup on the menu grammar, selection-control radio, pointer Slider.
  Control rhythm owns height: sm 28 / md 30 / lg 32, labels never change size.
*/

const SIZES = { sm: 'h-control-sm', md: 'h-control-md', lg: 'h-control-lg' };

/* ---------- select ---------- */

const MENU_ITEM =
  'flex min-h-control-md w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 text-left text-menu text-muted-foreground transition-none hover:bg-fill hover:text-foreground';

export const Select = ({ value, onChange, options = [], placeholder = 'Select…', size = 'md', className = '', disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`shadow-input inline-flex ${SIZES[size]} w-full min-w-0 shrink-0 cursor-pointer select-none items-center justify-between gap-2 rounded-full bg-field pl-3.5 pr-2 text-label text-foreground transition-colors duration-normal hover:bg-field focus-visible:outline-none focus-visible:shadow-input disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-muted-foreground ${
          open ? 'bg-fill-subtle' : ''
        }`}
      >
        <span className="min-w-0 truncate">{current ? current.label : <span className="text-placeholder">{placeholder}</span>}</span>
        <ChevronDown className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-normal ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? (
        <div
          role="listbox"
          className="bg-card shadow-overlay absolute top-[calc(100%+4px)] z-50 max-h-60 min-w-full overflow-y-auto rounded-xl p-1"
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange && onChange(o.value);
                setOpen(false);
              }}
              className={`${MENU_ITEM} ${o.value === value ? 'bg-fill text-foreground' : ''}`}
            >
              <span className="min-w-0 truncate">{o.label}</span>
              {o.value === value ? <Check className="ml-auto size-3.5 shrink-0 text-muted-foreground" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/* ---------- segmented control (sliding thumb) ---------- */

const SegCtx = React.createContext(null);

export const SegmentedControl = ({ value, onChange, items = [], size = 'md', ariaLabel, className = '' }) => {
  const refs = useRef(new Map());
  const thumbRef = useRef(null);
  useLayoutEffect(() => {
    const thumb = thumbRef.current;
    const item = refs.current.get(value);
    if (!thumb) return;
    if (!item) {
      thumb.hidden = true;
      return;
    }
    const measure = () => {
      thumb.style.width = `${item.offsetWidth}px`;
      thumb.style.transform = `translateX(${item.offsetLeft}px)`;
    };
    measure();
    if (thumb.hidden) {
      thumb.hidden = false;
      requestAnimationFrame(() => thumb.setAttribute('data-ready', ''));
    }
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    refs.current.forEach((el) => observer && observer.observe(el));
    return () => observer && observer.disconnect();
  }, [value, items]);
  return (
    <SegCtx.Provider value={{ refs, value, onChange }}>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        data-slot="segmented-control"
        className={`shadow-raised relative inline-flex ${SIZES[size]} shrink-0 items-stretch rounded-full bg-card p-0.5 ${className}`}
      >
        <span
          ref={thumbRef}
          hidden
          aria-hidden="true"
          data-slot="segmented-control-thumb"
          className="shadow-inset pointer-events-none absolute bottom-0.5 left-0 top-0.5 rounded-full bg-fill-hover ring-1 ring-inset ring-border data-[ready]:transition-[width,transform] data-[ready]:duration-normal data-[ready]:ease-out"
        />
        {items.map((it) => (
          <SegmentedItem key={it.value} value={it.value} disabled={it.disabled}>
            {it.icon ? <it.icon className="size-3.5 shrink-0" /> : null}
            {it.label}
          </SegmentedItem>
        ))}
      </div>
    </SegCtx.Provider>
  );
};

const SegmentedItem = ({ value, disabled, children, ...props }) => {
  const ctx = React.useContext(SegCtx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      ref={(el) => {
        if (el) ctx.refs.current.set(value, el);
        else ctx.refs.current.delete(value);
      }}
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled}
      onClick={() => ctx.onChange && ctx.onChange(value)}
      className={`relative z-10 inline-flex cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-label transition-colors duration-normal [&_svg]:shrink-0 ${
        disabled ? 'cursor-not-allowed opacity-50 hover:text-muted-foreground' : 'text-muted-foreground hover:text-foreground'
      } ${active ? 'text-foreground' : ''} ${props.className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

/* ---------- tabs (sliding indicator) ---------- */

export const Tabs = ({ value, onChange, items = [], size = 'md', className = '' }) => {
  const refs = useRef(new Map());
  const trackRef = useRef(null);
  const [geo, setGeo] = useState(null);
  useLayoutEffect(() => {
    const item = refs.current.get(value);
    const track = trackRef.current;
    if (!item || !track) {
      setGeo(null);
      return;
    }
    setGeo({ left: item.offsetLeft, width: item.offsetWidth });
  }, [value, items]);
  useLayoutEffect(() => {
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => {
      const item = refs.current.get(value);
      if (item) setGeo({ left: item.offsetLeft, width: item.offsetWidth });
    });
    refs.current.forEach((el) => observer && observer.observe(el));
    return () => observer && observer.disconnect();
  }, [value, items]);
  return (
    <div
      role="tablist"
      ref={trackRef}
      data-slot="tabs-list"
      className={`relative flex ${SIZES[size]} w-fit shrink-0 items-stretch gap-0.5 rounded-full bg-fill-subtle p-0.5 ${className}`}
    >
      {geo ? (
        <span
          aria-hidden="true"
          data-slot="tabs-indicator"
          className="pointer-events-none absolute top-1/2 left-0 h-[calc(100%-0.25rem)] rounded-full bg-card shadow-raised transition-[width,transform] duration-200 ease-out"
          style={{ width: `${geo.width}px`, transform: `translate(${geo.left}px, -50%)` }}
        />
      ) : null}
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value}
            ref={(el) => {
              if (el) refs.current.set(it.value, el);
              else refs.current.delete(it.value);
            }}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={it.disabled}
            onClick={() => onChange && onChange(it.value)}
            className={`relative z-10 inline-flex cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-label transition-none [&_svg]:shrink-0 [&_svg]:size-3.5 ${
              it.disabled
                ? 'cursor-not-allowed opacity-50'
                : `${active ? 'text-foreground' : 'text-muted-foreground hover:bg-fill-hover hover:text-foreground'}`
            } ${it.className || ''}`}
          >
            {it.icon ? <it.icon /> : null}
            {it.label}
          </button>
        );
      })}
    </div>
  );
};

/* ---------- radio (selection control) ---------- */

export const Radio = ({ checked, onChange, disabled, className = '', ...props }) => (
  <button
    type="button"
    role="radio"
    aria-checked={!!checked}
    disabled={disabled}
    onClick={() => onChange && onChange(!checked)}
    className={`inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-fill-hover transition-all duration-normal hover:border-border-strong hover:bg-fill-active active:scale-95 active:bg-fill-strong focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-border-focus ${
      checked ? 'border-foreground' : 'border-border'
    } ${disabled ? 'cursor-not-allowed border-border bg-fill-subtle active:scale-100' : ''} ${className}`}
    {...props}
  >
    <span className={`size-1.5 rounded-full bg-foreground transition-transform duration-normal ${checked ? 'scale-100' : 'scale-0'}`} />
  </button>
);

export const RadioRow = ({ checked, onChange, disabled, label, description, className = '' }) => (
  <button
    type="button"
    role="radio"
    aria-checked={!!checked}
    disabled={disabled}
    onClick={() => onChange && onChange(!checked)}
    className={`flex cursor-pointer items-start gap-2.5 rounded-lg p-2 text-left transition-colors duration-normal hover:bg-fill-subtle ${
      disabled ? 'cursor-not-allowed opacity-50' : ''
    } ${className}`}
  >
    <span
      aria-hidden="true"
      className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-normal ${
        checked ? 'border-foreground' : 'border-border'
      }`}
    >
      <span className={`size-1.5 rounded-full bg-foreground transition-transform duration-normal ${checked ? 'scale-100' : 'scale-0'}`} />
    </span>
    <span className="min-w-0">
      <span className="block text-label text-foreground">{label}</span>
      {description ? <span className="mt-0.5 block text-caption text-muted-foreground">{description}</span> : null}
    </span>
  </button>
);

/* ---------- slider ---------- */

export const Slider = ({ value = 0, onChange, min = 0, max = 100, step = 1, disabled, className = '', label }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={`relative flex h-4 items-center ${className}`}>
      <div className="h-1 w-full rounded-full bg-fill">
        <div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} />
      </div>
      <span
        aria-hidden="true"
        className="shadow-raised pointer-events-none absolute size-3.5 -translate-x-1/2 rounded-full bg-foreground"
        style={{ left: `${pct}%` }}
      />
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className="absolute inset-0 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
    </div>
  );
};

/* ---------- search input ---------- */

export const SearchInput = ({ className = '', ...props }) => (
  <div className={`relative ${className}`}>
    <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
    <Input type="search" className="pl-8 [&::-webkit-search-cancel-button]:hidden" {...props} />
  </div>
);
