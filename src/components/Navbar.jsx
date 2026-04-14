import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../firebase';
import { Avatar, Btn } from './UI';

export default function Navbar() {
  const { currentUser, userProfile, isAdmin, isTeacher } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);

  const active = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const links = [
    { to:'/', label:'Bosh sahifa' },
    { to:'/courses', label:'Kurslar' },
    { to:'/teachers', label:"O'qituvchilar" },
    { to:'/about', label:'Haqimizda' },
    ...(isTeacher ? [{ to:'/dashboard', label:'Panel' }] : []),
    ...(isAdmin ? [{ to:'/admin', label:'Admin' }] : []),
  ];

  const linkStyle = (to) => ({
    padding:'8px 14px', borderRadius:'var(--radius-sm)',
    fontSize:'0.875rem', fontWeight:600,
    color: active(to) && to !== '/' ? 'var(--navy)' : 'var(--text2)',
    background: active(to) && to !== '/' ? 'var(--yellow)' : 'transparent',
    transition:'all var(--tr)',
    textDecoration:'none', whiteSpace:'nowrap',
  });

  return (
    <>
      <style>{`
        .nav-link:hover { color:var(--text)!important; background:var(--bg3)!important; }
        .nav-link.active { color:var(--navy)!important; background:var(--yellow)!important; }
        @media(max-width:900px){ .nav-links { display:none!important; } .nav-mobile-btn { display:flex!important; } }
        @media(min-width:901px){ .nav-mobile-btn { display:none!important; } }
      `}</style>

      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        height:'var(--nav-h)',
        background: scrolled ? 'rgba(248,249,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition:'all 0.3s ease',
        display:'flex', alignItems:'center', padding:'0 32px', gap:16,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginRight:24 }}>
          <div style={{
            width:40, height:40, borderRadius:12,
            background:'var(--yellow)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.1rem',
            color:'var(--navy)', boxShadow:'var(--shadow-yellow)',
          }}>E</div>
          <div>
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.03em', color:'var(--text)', lineHeight:1 }}>EMC</div>
            <div style={{ fontSize:'0.65rem', color:'var(--text3)', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>Academy</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display:'flex', gap:4, flex:1 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`nav-link${active(l.to) && l.to !== '/' ? ' active' : ''}`} style={linkStyle(l.to)}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginLeft:'auto' }}>
          <button
            onClick={() => setThemeMode(m => m === 'light' ? 'dark' : 'light')}
            style={{ width:36, height:36, borderRadius:'50%', border:'1.5px solid var(--border)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'1rem' }}
          >
            {themeMode === 'light' ? '☾' : '☀'}
          </button>

          {currentUser ? (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Link to="/profile" style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:'var(--radius-sm)', background:'var(--bg3)', border:'1px solid var(--border)', textDecoration:'none' }}>
                <Avatar user={userProfile || currentUser} size={28} />
                <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text)', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {userProfile?.displayName || 'Profil'}
                </span>
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <Link to="/auth" style={{ padding:'8px 18px', borderRadius:'var(--radius-sm)', border:'1.5px solid var(--border)', fontWeight:600, fontSize:'0.875rem', color:'var(--text)', textDecoration:'none', transition:'all var(--tr)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--yellow)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
              >Kirish</Link>
              <Link to="/auth?mode=register" style={{ padding:'8px 18px', borderRadius:'var(--radius-sm)', background:'var(--yellow)', fontWeight:600, fontSize:'0.875rem', color:'var(--navy)', textDecoration:'none', boxShadow:'var(--shadow-yellow)' }}>
                Ro'yxat
              </Link>
            </div>
          )}

          {/* Mobile menu btn */}
          <button className="nav-mobile-btn" onClick={() => setMenuOpen(p => !p)}
            style={{ width:36, height:36, borderRadius:8, border:'1.5px solid var(--border)', background:'var(--bg2)', display:'none', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'1.1rem' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed', top:'var(--nav-h)', left:0, right:0, zIndex:199, background:'var(--bg2)', borderBottom:'1px solid var(--border)', padding:'16px 24px', display:'flex', flexDirection:'column', gap:4 }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              style={{ padding:'12px 16px', borderRadius:'var(--radius-sm)', fontWeight:600, fontSize:'0.9rem', color:'var(--text)', textDecoration:'none', background: active(l.to) ? 'var(--yellow)' : 'transparent' }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
