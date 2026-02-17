import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui.jsx';

export default function NotFound() {
  return (
    <EmptyState
      title="Sahifa topilmadi"
      desc="URL noto‘g‘ri yoki sahifa o‘chirilgan."
      action={<Link className="btn" to="/">Bosh sahifa</Link>}
    />
  );
}
