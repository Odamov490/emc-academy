import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';

function mapGoogleError(error) {
  const code = error?.code || '';

  if (code === 'auth/popup-closed-by-user') {
    return 'Google oynasi yopildi. Qayta urinib ko‘ring.';
  }

  if (code === 'auth/popup-blocked') {
    return 'Popup bloklangan. Brauzerda popup ruxsatini yoqing.';
  }

  if (code === 'auth/cancelled-popup-request') {
    return 'Google kirish jarayoni bekor qilindi.';
  }

  return error?.message || 'Google orqali kirishda xatolik yuz berdi.';
}

export default function Login() {
  const { login, signInWithGoogle, hasGoogleAuth } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busyGoogle, setBusyGoogle] = useState(false);

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

  const onGoogleSignIn = async () => {
    setError('');
    setBusyGoogle(true);
    try {
      await signInWithGoogle();
      nav('/academy');
    } catch (err) {
      setError(mapGoogleError(err));
    } finally {
      setBusyGoogle(false);
    }
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

        <div className="divider" />

        <button
          className="btn btnGhost"
          type="button"
          onClick={onGoogleSignIn}
          disabled={busyGoogle}
          title="Google orqali kirish"
        >
          {busyGoogle ? 'Google orqali kirilmoqda...' : 'Google bilan kirish'}
        </button>
        {!hasGoogleAuth ? <div className="muted mt8">Google login uchun Firebase env qiymatlari hali sozlanmagan.</div> : null}
      </Card>
    </div>
  );
}
