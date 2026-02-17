import React from 'react';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Badge({ children, variant = 'default' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="progress">
      <div className="progressFill" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Divider() {
  return <div className="divider" />;
}

export function EmptyState({ title, desc, action }) {
  return (
    <div className="empty">
      <div className="emptyTitle">{title}</div>
      {desc ? <div className="muted">{desc}</div> : null}
      {action ? <div className="mt12">{action}</div> : null}
    </div>
  );
}
