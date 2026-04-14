import { useApp } from '../contexts/AppContext';

/* ── SPINNER ────────────────────────────────────────────── */
export function Spinner({ size = 36 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:60 }}>
      <div style={{
        width:size, height:size,
        border:`3px solid rgba(255,214,0,0.2)`,
        borderTopColor:'var(--yellow)',
        borderRadius:'50%',
        animation:'spin 0.7s linear infinite',
      }} />
    </div>
  );
}

/* ── BTN ────────────────────────────────────────────────── */
export function Btn({ children, variant='primary', size='md', full, style:s, ...props }) {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
    border:'none', cursor:'pointer', fontFamily:'var(--font-body)',
    fontWeight:600, letterSpacing:'-0.01em',
    transition:'all var(--tr)',
    borderRadius: size === 'sm' ? 'var(--radius-sm)' : 'var(--radius-sm)',
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 32px' : '11px 22px',
    fontSize: size === 'sm' ? '0.82rem' : size === 'lg' ? '1rem' : '0.9rem',
    width: full ? '100%' : 'auto',
  };
  const variants = {
    primary: {
      background:'var(--yellow)',
      color:'var(--navy)',
      boxShadow:'0 4px 16px rgba(255,214,0,0.35)',
    },
    electric: {
      background:'var(--electric)',
      color:'var(--navy)',
      boxShadow:'0 4px 16px rgba(0,212,255,0.3)',
    },
    dark: {
      background:'var(--navy)',
      color:'#fff',
    },
    outline: {
      background:'transparent',
      border:'1.5px solid var(--border2)',
      color:'var(--text)',
    },
    ghost: {
      background:'transparent',
      border:'none',
      color:'var(--text2)',
    },
    danger: {
      background:'var(--red)',
      color:'white',
    },
    success: {
      background:'var(--green)',
      color:'var(--navy)',
    },
  };
  return (
    <button
      {...props}
      style={{ ...base, ...variants[variant], ...s }}
      onMouseEnter={e => {
        if (variant === 'primary') e.currentTarget.style.transform = 'translateY(-2px)';
        if (variant === 'electric') e.currentTarget.style.transform = 'translateY(-2px)';
        if (variant === 'dark') e.currentTarget.style.background = 'var(--navy3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        if (variant === 'dark') e.currentTarget.style.background = 'var(--navy)';
      }}
    >
      {children}
    </button>
  );
}

/* ── CARD ───────────────────────────────────────────────── */
export function Card({ children, onClick, hover=true, style:s }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:'var(--surface)',
        border:'1px solid var(--border)',
        borderRadius:'var(--radius)',
        overflow:'hidden',
        transition:'all var(--tr)',
        cursor: onClick ? 'pointer' : 'default',
        ...s,
      }}
      onMouseEnter={hover && onClick ? e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow2)';
        e.currentTarget.style.borderColor = 'var(--yellow)';
      } : null}
      onMouseLeave={hover && onClick ? e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--border)';
      } : null}
    >
      {children}
    </div>
  );
}

/* ── MODAL ──────────────────────────────────────────────── */
export function Modal({ title, onClose, children, wide }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, zIndex:300,
        background:'rgba(7,10,20,0.7)', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:16, animation:'fadeIn 0.15s ease',
      }}
    >
      <div style={{
        background:'var(--bg2)', borderRadius:'var(--radius-lg)',
        padding:'32px', width:'100%', maxWidth: wide ? 720 : 520,
        maxHeight:'90vh', overflowY:'auto',
        boxShadow:'0 24px 80px rgba(0,0,0,0.3)',
        animation:'scaleIn 0.2s ease',
        border:'1px solid var(--border2)',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <h3 style={{ fontSize:'1.2rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.3rem', color:'var(--text3)', cursor:'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── FORM ───────────────────────────────────────────────── */
export function FormGroup({ label, hint, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      {label && <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600, marginBottom:7, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>}
      {children}
      {hint && <p style={{ fontSize:'0.78rem', color:'var(--text3)', marginTop:5 }}>{hint}</p>}
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:'12px 16px',
  border:'1.5px solid var(--border)',
  borderRadius:'var(--radius-sm)',
  background:'var(--bg3)',
  color:'var(--text)',
  fontSize:'0.9rem', outline:'none',
  transition:'all var(--tr)',
};

export function Input({ ...props }) {
  return (
    <input {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={e => { e.target.style.borderColor='var(--yellow)'; e.target.style.background='var(--bg2)'; }}
      onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg3)'; }}
    />
  );
}

export function Textarea({ ...props }) {
  return (
    <textarea {...props}
      style={{ ...inputStyle, resize:'vertical', minHeight:90, ...props.style }}
      onFocus={e => { e.target.style.borderColor='var(--yellow)'; e.target.style.background='var(--bg2)'; }}
      onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg3)'; }}
    />
  );
}

export function Select({ children, ...props }) {
  return (
    <select {...props}
      style={{ ...inputStyle, cursor:'pointer', ...props.style }}
      onFocus={e => e.target.style.borderColor='var(--yellow)'}
      onBlur={e => e.target.style.borderColor='var(--border)'}
    >
      {children}
    </select>
  );
}

/* ── BADGE ──────────────────────────────────────────────── */
export function Badge({ children, color = 'yellow' }) {
  const colors = {
    yellow: { bg:'rgba(255,214,0,0.15)', color:'#A07800' },
    electric: { bg:'rgba(0,212,255,0.15)', color:'var(--electric2)' },
    green: { bg:'rgba(0,230,118,0.15)', color:'#00A854' },
    red: { bg:'rgba(255,68,68,0.15)', color:'var(--red)' },
    navy: { bg:'rgba(10,14,26,0.08)', color:'var(--text2)' },
    orange: { bg:'rgba(255,107,53,0.15)', color:'var(--orange)' },
  };
  const c = colors[color] || colors.navy;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding:'4px 12px', borderRadius:20,
      fontSize:'0.72rem', fontWeight:700,
      letterSpacing:'0.04em', textTransform:'uppercase',
      background:c.bg, color:c.color,
    }}>
      {children}
    </span>
  );
}

/* ── AVATAR ─────────────────────────────────────────────── */
export function Avatar({ user, size=38 }) {
  const initial = (user?.displayName || user?.email || '?')[0].toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0,
      background:'linear-gradient(135deg, var(--yellow), var(--electric))',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'var(--navy)', fontWeight:800, fontSize:size * 0.38,
      fontFamily:'var(--font-head)', overflow:'hidden',
    }}>
      {user?.photoURL
        ? <img src={user.photoURL} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        : initial}
    </div>
  );
}

/* ── STAR RATING ────────────────────────────────────────── */
export function Stars({ rating = 0, max = 5 }) {
  return (
    <span style={{ color:'var(--yellow)', fontSize:'0.9rem', letterSpacing:1 }}>
      {Array.from({ length: max }, (_, i) => i < Math.round(rating) ? '★' : '☆').join('')}
    </span>
  );
}

/* ── TOAST ──────────────────────────────────────────────── */
export function Toast() {
  const { toast } = useApp();
  const icons = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };
  const colors = { success:'var(--green)', error:'var(--red)', info:'var(--electric)', warning:'var(--yellow)' };
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:400, display:'flex', flexDirection:'column', gap:10 }}>
      {toast.map(t => (
        <div key={t.id} style={{
          background:'var(--navy2)', color:'#fff',
          borderLeft:`4px solid ${colors[t.type]||colors.info}`,
          borderRadius:'var(--radius-sm)', padding:'14px 20px',
          fontSize:'0.875rem', fontWeight:500,
          boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
          animation:'toastIn 0.3s ease',
          minWidth:220, maxWidth:360,
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ color:colors[t.type] || colors.info }}>{icons[t.type] || icons.info}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── EMPTY STATE ────────────────────────────────────────── */
export function EmptyState({ icon='📭', title='Ma\'lumot yo\'q', sub }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 24px' }}>
      <div style={{ fontSize:'3rem', marginBottom:16 }}>{icon}</div>
      <h3 style={{ color:'var(--text2)', marginBottom:8, fontSize:'1rem' }}>{title}</h3>
      {sub && <p style={{ fontSize:'0.85rem', color:'var(--text3)' }}>{sub}</p>}
    </div>
  );
}

/* ── STAT CARD ──────────────────────────────────────────── */
export function StatCard({ icon, value, label, color='yellow' }) {
  const colors = {
    yellow: 'var(--yellow)',
    electric: 'var(--electric)',
    green: 'var(--green)',
    orange: 'var(--orange)',
  };
  return (
    <div style={{
      background:'var(--surface)',
      border:'1px solid var(--border)',
      borderRadius:'var(--radius)',
      padding:'24px',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:-20, right:-20, fontSize:'5rem', opacity:0.06 }}>{icon}</div>
      <div style={{ fontSize:'1.8rem', marginBottom:6 }}>{icon}</div>
      <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800, color:colors[color], lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:'0.85rem', color:'var(--text2)', marginTop:6 }}>{label}</div>
    </div>
  );
}
