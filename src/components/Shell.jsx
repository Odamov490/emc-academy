import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../lib/auth.jsx';

function Topbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();

  const NavLink = ({ to, children }) => {
    const active = loc.pathname === to || (to !== '/' && loc.pathname.startsWith(to));
    return (
      <Link className={`navLink ${active ? 'active' : ''}`} to={to}>
        {children}
      </Link>
    );
  };

  return (
    <header className="topbar">
      <div className="container topbarInner">
        <div className="brand">
          <Link to="/" className="brandLink">
            <span className="brandDot" /> EMC Academy
          </Link>
          <span className="brandTag">beta</span>
        </div>

        <nav className="nav">
          <NavLink to="/academy">Kurslar</NavLink>
          <NavLink to="/verify/EMC-2026-000001">Verify</NavLink>
          {user?.isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
        </nav>

        <div className="authArea">
          {user ? (
            <>
              <Link className="pill" to="/profile">{user.name}</Link>
              <button className="btn btnGhost" onClick={logout}>Chiqish</button>
            </>
          ) : (
            <Link className="btn" to="/login">Kirish</Link>
          )}
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div>
          <div className="muted">⚠️ Demo rejim: ma’lumotlar localStorage’da saqlanadi.</div>
          <div className="muted">Keyin emclab saytingga ulamiz (DB + real sertifikat verifikatsiya).</div>
        </div>
        <div className="muted">© {new Date().getFullYear()} EMC Academy</div>
      </div>
    </footer>
  );
}

export default function Shell({ children }) {
  return (
    <AuthProvider>
      <div className="app">
        <Topbar />
        <main className="main">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
