import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const isAdmin = email.trim().toLowerCase() === 'admin@emc.uz';
    login({ name: name || 'Foydalanuvchi', email: email || 'user@emc.uz', isAdmin });
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

          <div className="row gap10 mt16">
            <button className="btn" type="submit">Kirish</button>
            <button className="btn btnGhost" type="button" onClick={() => { setName(''); setEmail(''); }}>Tozalash</button>
          </div>

          <div className="muted mt12">
            Admin demo: <b>admin@emc.uz</b> kiritsang, <b>/admin</b> ochiladi.
          </div>
        </form>
      </Card>
    </div>
  );
}
