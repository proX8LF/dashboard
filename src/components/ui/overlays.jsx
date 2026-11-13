import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { Button, IconButton } from './index.jsx';

/*
  Mastra overlay port - no Radix/BaseUI, no framer-motion.
  Surfaces: overlay = bg-card shadow-overlay, dialog = bg-dialog shadow-overlay.
  Menu rows share the ghost recipe: rounded-lg px-2 text-menu inside a rounded-xl p-1 popup.
*/

const MENU_ITEM =
  'flex h-auto min-h-control-md w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2 py-1 text-left text-menu text-muted-foreground transition-none hover:bg-fill hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50';
const MENU_LABEL = 'px-3 pb-1 pt-1.5 text-caption tracking-normal text-muted-foreground';
const MENU_SEPARATOR = '-mx-1 my-1 h-px shrink-0 bg-border';
const MENU_SHORTCUT = 'ml-auto pl-4 text-caption tracking-normal text-muted-foreground tabular-nums';

export const MenuItem = ({ children, shortcut, icon: Icon, disabled, className = '', ...props }) => (
  <button type="button" disabled={disabled} className={`${MENU_ITEM} ${className}`} {...props}>
    {Icon ? <Icon className="size-3.5 shrink-0 text-placeholder" /> : null}
    <span className="min-w-0 truncate">{children}</span>
    {shortcut ? <span className={MENU_SHORTCUT}>{shortcut}</span> : null}
  </button>
);

export const MenuLabel = ({ children }) => <div className={MENU_LABEL}>{children}</div>;

export const MenuSeparator = () => <div className={MENU_SEPARATOR} />;

/* ---------- dialog ---------- */

export const Dialog = ({ open, onClose, title, description, footer, children, className = '' }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => setVisible(true));
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open && !visible) return null;
  return createPortal(
    <div
      aria-hidden={!open}
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 transition-opacity duration-200 ${
        open && visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="fixed inset-0 bg-scrim" />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`shadow-overlay relative z-10 flex w-full max-w-md flex-col gap-4 rounded-xl bg-dialog p-5 outline-none transition-all duration-200 ${
          open && visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        } ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-heading text-foreground">{title}</h2>
            {description ? <p className="mt-1 text-caption text-muted-foreground">{description}</p> : null}
          </div>
          <IconButton label="Close dialog" onClick={onClose} className="-mr-1 shrink-0">
            <X className="size-4" />
          </IconButton>
        </div>
        {children ? <div className="text-body-sm text-muted-foreground">{children}</div> : null}
        {footer ? <div className="flex items-center justify-end gap-2">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
};

export const AlertDialog = ({ open, onClose, title, description, onConfirm, confirmLabel = 'Confirm', destructive }) => (
  <Dialog
    open={open}
    onClose={onClose}
    title={title}
    description={description}
    footer={
      <>
        <DialogClose onClick={onClose} />
        <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  />
);

export const DialogClose = (props) => <Button variant="default" onClick={props.onClick || props.onClose}>{props.children || 'Cancel'}</Button>;

export const DialogAction = (props) => <Button variant="primary" onClick={props.onClick}>{props.children}</Button>;

/* ---------- dropdown menu / popover ---------- */

const useDismiss = (open, setOpen, ref) => {
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
  }, [open, setOpen, ref]);
};

export const DropdownMenu = ({ trigger, align = 'end', children, className = '', width = 'w-56' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useDismiss(open, setOpen, ref);
  return (
    <div ref={ref} className="relative inline-block">
      <span
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="contents"
      >
        {trigger}
      </span>
      {open ? (
        <div
          role="menu"
          className={`shadow-overlay absolute top-[calc(100%+4px)] z-50 flex max-h-[min(18.75rem,var(--available-height,18.75rem))] min-w-[min(11rem,100%)] flex-col overflow-y-auto rounded-xl p-1 bg-card ${width} ${
            align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          } ${className}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export const Popover = ({ open, onOpenChange, trigger, align = 'start', width = 'w-72', children, className = '' }) => {
  const ref = useRef(null);
  useDismiss(open, onOpenChange, ref);
  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => onOpenChange && onOpenChange(!open)} className="contents">
        {trigger}
      </span>
      {open ? (
        <div
          role="dialog"
          className={`bg-card shadow-overlay absolute top-[calc(100%+4px)] z-50 rounded-xl p-3 ${width} ${
            align === 'end' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          } ${className}`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

/* ---------- tooltip (hover + focus, CSS only) ---------- */

export const Tooltip = ({ label, side = 'bottom', children }) => (
  <span className="group/tt relative inline-flex">
    {children}
    <span
      role="tooltip"
      className={`bg-card shadow-overlay pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-caption text-foreground opacity-0 transition-opacity duration-fast group-focus-within/tt:opacity-100 group-hover/tt:opacity-100 ${
        side === 'bottom'
          ? 'left-1/2 top-[calc(100%+4px)] -translate-x-1/2'
          : 'bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2'
      }`}
    >
      {label}
    </span>
  </span>
);

/* ---------- toaster ---------- */

const TOAST_META = {
  success: { icon: CircleCheck, className: 'text-success-foreground after:bg-success-indicator' },
  info: { icon: Info, className: 'text-info-foreground after:bg-info-indicator' },
  warning: { icon: TriangleAlert, className: 'text-warning-foreground after:bg-warning-indicator' },
  error: { icon: CircleAlert, className: 'text-destructive-foreground after:bg-destructive-indicator' },
  loading: { icon: Info, className: 'text-muted-foreground after:bg-fill-strong' },
};

let listeners = new Set();
let nextId = 1;
const liveToasts = new Map();

export function toast({ title, description, variant = 'info', duration = 4000, action }) {
  const id = nextId++;
  liveToasts.set(id, { id, title, description, variant, action });
  listeners.forEach((l) => l());
  if (duration) setTimeout(() => dismissToast(id), duration);
  return id;
}

export function dismissToast(id) {
  if (liveToasts.delete(id)) listeners.forEach((l) => l());
}

const useToasts = () => {
  const [, force] = useState(0);
  useEffect(() => {
    const listener = () => force((n) => n + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);
  return [...liveToasts.values()];
};

export const Toaster = () => {
  const toasts = useToasts();
  if (!toasts.length || typeof document === 'undefined') return null;
  return createPortal(
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => {
        const meta = TOAST_META[t.variant] || TOAST_META.info;
        const Icon = meta.icon;
        return (
          <div
            key={t.id}
            className="bg-dialog shadow-overlay pointer-events-auto flex items-start gap-2.5 rounded-xl p-3 text-body-sm text-muted-foreground"
          >
            <span className={`relative mt-0.5 inline-flex shrink-0 after:absolute after:-inset-1 after:rounded-full ${meta.className}`}>
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-subheading text-foreground">{t.title}</p>
              {t.description ? <p className="mt-0.5 text-caption">{t.description}</p> : null}
            </div>
            {t.action}
            <IconButton label="Dismiss" className="-mr-1 -mt-1" onClick={() => dismissToast(t.id)}>
              <X className="size-3.5" />
            </IconButton>
          </div>
        );
      })}
    </div>,
    document.body,
  );
};
