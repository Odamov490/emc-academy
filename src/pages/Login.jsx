import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Iltimos, to‘g‘ri email kiriting.');
      return;
    }

    const isAdmin = cleanEmail === 'admin@emc.uz';
    login({ name, email: cleanEmail, isAdmin });
    setError('');
    nav('/academy');
  };

  return (
    <div className="center">
      <Card className="max520">
        <h1 className="h2">Kirish</h1>
        <p className="muted">Demo: parol yo‘q. Email orqali user yaratiladi.</p>
        <form onSubmit={onSubmit} className="form">
          <label className="label">Ism</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="G‘ulomjon" />

          <label className="label mt10">Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="gulomjon@..." />

          {error ? <div className="errorText mt8">{error}</div> : null}

          <div className="row gap10 mt16">
            <button className="btn" type="submit">Kirish</button>
            <button className="btn btnGhost" type="button" onClick={() => { setName(''); setEmail(''); setError(''); }}>Tozalash</button>
          </div>

          <div className="muted mt12">
            Admin demo: <b>admin@emc.uz</b> kiritsang, <b>/admin</b> ochiladi.
          </div>
        </form>
      </Card>
    </div>
  );
}
