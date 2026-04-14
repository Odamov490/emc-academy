// ── AUTH PAGE ────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { authService } from '../firebase';
import { Btn, FormGroup, Input } from '../components/UI';

export function Auth() {
  const { showToast, currentUser } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });

  useEffect(() => { if (currentUser) navigate('/'); }, [currentUser]);

  const errMap = {
    'auth/user-not-found': 'Foydalanuvchi topilmadi',
    'auth/wrong-password': "Parol noto'g'ri",
    'auth/email-already-in-use': "Bu email allaqachon ro'yxatdan o'tgan",
    'auth/weak-password': 'Parol kamida 6 ta belgidan iborat bo\'lsin',
    'auth/invalid-credential': "Email yoki parol noto'g'ri",
    'auth/invalid-email': "Email noto'g'ri formatda",
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await authService.loginWithGoogle(); navigate('/'); }
    catch(err) { showToast(errMap[err.code] || err.message, 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === 'login') await authService.loginWithEmail(form.email, form.password);
      else await authService.registerWithEmail(form.email, form.password, form.name);
      showToast('Xush kelibsiz! 🎉', 'success');
      navigate('/');
    } catch(err) { showToast(errMap[err.code] || err.message, 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,214,0,0.08) 0%, transparent 70%)', top:-100, right:-100, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', bottom:-100, left:-100, pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:440, position:'relative' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'var(--yellow)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.5rem', color:'var(--navy)', margin:'0 auto 14px', boxShadow:'var(--shadow-yellow)' }}>E</div>
          <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.4rem', color:'var(--text)' }}>EMC Academy</div>
          <p style={{ fontSize:'0.875rem', marginTop:6 }}>{mode === 'login' ? 'Hisobingizga kiring' : "Ro'yxatdan o'ting"}</p>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:36, boxShadow:'var(--shadow2)' }}>
          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} style={{ width:'100%', padding:'13px', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', background:'var(--bg2)', color:'var(--text)', fontWeight:600, fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:10, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all var(--tr)', marginBottom:20 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--yellow)'; e.currentTarget.style.background='var(--bg3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg2)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google orqali kirish
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20, color:'var(--text3)', fontSize:'0.82rem' }}>
            <div style={{ flex:1, height:1, background:'var(--border)' }} /> yoki <div style={{ flex:1, height:1, background:'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <FormGroup label="Ism Familiya">
                <Input required value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="Abdullayev Sardor" />
              </FormGroup>
            )}
            <FormGroup label="Email">
              <Input required type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="email@example.com" />
            </FormGroup>
            <FormGroup label="Parol">
              <Input required type="password" minLength={6} value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" />
            </FormGroup>
            <Btn type="submit" full size="lg" disabled={loading} style={{ borderRadius:999, marginTop:4 }}>
              {loading ? '⏳ Kutilmoqda...' : mode === 'login' ? '→ Kirish' : "✓ Ro'yxatdan o'tish"}
            </Btn>
          </form>

          <div style={{ textAlign:'center', marginTop:20, fontSize:'0.85rem', color:'var(--text2)' }}>
            {mode === 'login' ? "Hisobingiz yo'qmi?" : 'Hisobingiz bormi?'}{' '}
            <button onClick={() => setMode(m => m==='login'?'register':'login')} style={{ background:'none', border:'none', color:'var(--yellow-dark)', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-body)' }}>
              {mode === 'login' ? "Ro'yxatdan o'tish" : 'Kirish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PROFILE PAGE ─────────────────────────────────────────
import { courseService, userService, storageService } from '../firebase';
import { Avatar, Card, Spinner } from '../components/UI';

export function Profile() {
  const { currentUser, userProfile, refreshProfile, isTeacher, showToast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('info');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ displayName:'', bio:'', phone:'' });
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) { navigate('/auth'); return; }
    if (userProfile) setForm({ displayName:userProfile.displayName||'', bio:userProfile.bio||'', phone:userProfile.phone||'' });
  }, [userProfile]);

  useEffect(() => {
    if (tab === 'courses') {
      setLoading(true);
      const ids = userProfile?.enrolledCourses || [];
      Promise.all(ids.map(id => courseService.get(id))).then(data => { setMyCourses(data.filter(Boolean)); setLoading(false); });
    }
  }, [tab]);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      await userService.updateUser(currentUser.uid, { displayName:form.displayName, bio:form.bio, phone:form.phone });
      await refreshProfile(); showToast('Profil yangilandi ✓', 'success'); setEditing(false);
    } catch(err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const url = await storageService.upload(`avatars/${currentUser.uid}`, file);
      await userService.updateUser(currentUser.uid, { photoURL:url });
      await refreshProfile(); showToast('Rasm yangilandi ✓', 'success');
    } catch(err) { showToast(err.message, 'error'); }
  };

  if (!userProfile) return <div style={{ paddingTop:'var(--nav-h)' }}><Spinner /></div>;

  const ROLE = { student:'Talaba', teacher:"O'qituvchi", admin:'Admin' };

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ background:'var(--navy)', padding:'48px 32px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'flex', alignItems:'center', gap:24, flexWrap:'wrap' }}>
          <div style={{ position:'relative' }}>
            <Avatar user={userProfile} size={90} />
            <label style={{ position:'absolute', bottom:0, right:0, width:28, height:28, background:'var(--yellow)', color:'var(--navy)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'0.75rem', fontWeight:700 }}>
              ✎<input type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }} />
            </label>
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ color:'white', marginBottom:4 }}>{userProfile.displayName}</h2>
            <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:8, fontSize:'0.875rem' }}>{userProfile.email}</p>
            <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:999, background:'rgba(255,214,0,0.15)', color:'var(--yellow)', fontSize:'0.75rem', fontWeight:700 }}>{ROLE[userProfile.role] || userProfile.role}</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn variant="outline" size="sm" onClick={() => setEditing(p=>!p)} style={{ color:'white', borderColor:'rgba(255,255,255,0.2)' }}>{editing ? 'Bekor' : '✎ Tahrirlash'}</Btn>
            <Btn variant="ghost" size="sm" onClick={() => { authService.logout(); navigate('/'); }} style={{ color:'rgba(255,255,255,0.5)' }}>← Chiqish</Btn>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px' }}>
        <div style={{ display:'flex', gap:4, marginBottom:28, borderBottom:'1px solid var(--border)' }}>
          {[['info','👤 Ma\'lumotlar'],['courses','📚 Kurslarim']].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ padding:'12px 20px', background:'none', border:'none', borderBottom:`2px solid ${tab===k?'var(--yellow)':'transparent'}`, color:tab===k?'var(--text)':'var(--text2)', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'var(--font-body)', marginBottom:-1, transition:'all var(--tr)' }}>{l}</button>
          ))}
        </div>

        {tab === 'info' && (editing ? (
          <form onSubmit={handleSave} style={{ maxWidth:500 }}>
            <FormGroup label="Ism Familiya"><Input required value={form.displayName} onChange={e=>setForm(p=>({...p,displayName:e.target.value}))} /></FormGroup>
            <FormGroup label="Bio"><Textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} placeholder="O'zing haqingda..." /></FormGroup>
            <FormGroup label="Telefon"><Input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+998 90 123 45 67" /></FormGroup>
            <div style={{ display:'flex', gap:10 }}><Btn type="submit" disabled={saving}>{saving?'Saqlanmoqda...':'💾 Saqlash'}</Btn><Btn type="button" variant="outline" onClick={()=>setEditing(false)}>Bekor</Btn></div>
          </form>
        ) : (
          <div style={{ display:'grid', gap:14, maxWidth:500 }}>
            {[['Ism',userProfile.displayName],['Email',userProfile.email],['Telefon',userProfile.phone||'—'],['Bio',userProfile.bio||'—'],["Ro'l",ROLE[userProfile.role]]].map(([l,v])=>(
              <div key={l} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'14px 18px' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{l}</div>
                <div style={{ fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
        ))}

        {tab === 'courses' && (loading ? <Spinner /> : myCourses.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 0' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>📚</div>
            <p>Hali hech qanday kursga yozilmagansiz</p>
            <Btn onClick={()=>navigate('/courses')} style={{ marginTop:20 }}>Kurslarni Ko'rish →</Btn>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {myCourses.map(c => (
              <Card key={c.id} onClick={()=>navigate(`/courses/${c.id}`)}>
                <div style={{ padding:20 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontWeight:700, marginBottom:8 }}>{c.title}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text3)' }}>👥 {c.studentCount||0} talaba</div>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TEACHERS PAGE ─────────────────────────────────────────
import { teacherService } from '../firebase';

export function Teachers() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherService.getAll().then(data => { setTeachers(data); setLoading(false); });
  }, []);

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ background:'var(--navy)', padding:'60px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,214,0,0.1)', border:'1px solid rgba(255,214,0,0.2)', borderRadius:999, padding:'6px 16px', marginBottom:20 }}>
            <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--yellow)', textTransform:'uppercase', letterSpacing:'0.06em' }}>Jamoamiz</span>
          </div>
          <h1 style={{ color:'white', marginBottom:12 }}>Tajribali O'qituvchilar</h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'1.05rem' }}>IT sohasida yillik tajribaga ega mutaxassislar</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 32px' }}>
        {loading ? <Spinner /> : teachers.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>👨‍🏫</div>
            <p>O'qituvchilar hali qo'shilmagan</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24 }}>
            {teachers.map(t => (
              <Card key={t.id}>
                <div style={{ padding:28, textAlign:'center' }}>
                  <Avatar user={t} size={80} />
                  <div style={{ marginTop:16, marginBottom:6, fontFamily:'var(--font-head)', fontWeight:700, fontSize:'1.1rem' }}>{t.displayName}</div>
                  <div style={{ fontSize:'0.82rem', color:'var(--text3)', marginBottom:12 }}>{t.specialization || (t.role === 'admin' ? 'Admin & O\'qituvchi' : "O'qituvchi")}</div>
                  {t.bio && <p style={{ fontSize:'0.82rem', lineHeight:1.7 }}>{t.bio}</p>}
                  {t.phone && <div style={{ marginTop:12, fontSize:'0.82rem', color:'var(--text3)' }}>📞 {t.phone}</div>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────
export function About() {
  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ background:'var(--navy)', padding:'80px 32px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,214,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.04) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ position:'relative', maxWidth:700, margin:'0 auto' }}>
          <h1 style={{ color:'white', marginBottom:16 }}>EMC Academy Haqida</h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1.1rem', lineHeight:1.8 }}>
            2020-yilda tashkil etilgan EMC Academy O'zbekistoning yetakchi IT ta'lim markazidir.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'80px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, marginBottom:60, alignItems:'center' }}>
          <div>
            <h2 style={{ marginBottom:16 }}>Bizning Missiya</h2>
            <p style={{ lineHeight:1.85, marginBottom:16 }}>
              EMC Academy har bir o'zbek yoshini zamonaviy texnologiyalar bilan qurollantirish, ularning karyera imkoniyatlarini kengaytirish va raqamli iqtisodiyotda faol ishtirokchi bo'lishiga ko'maklashish uchun tashkil etilgan.
            </p>
            <p style={{ lineHeight:1.85 }}>
              Biz nafaqat nazariy bilim beramiz — real loyihalar, professional mentorlik va ish joyiga joylashishda ko'mak orqali talabalarimizni muvaffaqiyatga eltamiz.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[
              { icon:'🎯', label:'Missiya', text:"Har bir yoshni IT'ga tayyorlash" },
              { icon:'👁', label:'Vizyon', text:"O'zbekistoning yetakchi akademiyasi" },
              { icon:'💡', label:'Yondashuv', text:'Amaliy + Nazariy' },
              { icon:'🤝', label:'Jamiyat', text:'Kuchli alumni tarmog\'i' },
            ].map(item => (
              <div key={item.label} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20 }}>
                <div style={{ fontSize:'1.6rem', marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--text)', marginBottom:4 }}>{item.label}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--text2)' }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:40, marginBottom:60 }}>
          <h2 style={{ marginBottom:32, textAlign:'center' }}>Bizning Yutuqlarimiz</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24, textAlign:'center' }}>
            {[
              { val:'2,400+', label:'Bitiruvchilar', icon:'👨‍🎓' },
              { val:'85%', label:'Ish topganlar', icon:'💼' },
              { val:'48', label:'Kurslar', icon:'📚' },
              { val:'4.9/5', label:'O\'rtacha reyting', icon:'⭐' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize:'1.8rem', marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800, color:'var(--yellow)', lineHeight:1 }}>{s.val}</div>
                <div style={{ fontSize:'0.82rem', color:'var(--text2)', marginTop:6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom:32, textAlign:'center' }}>Aloqa</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:20 }}>
            {[
              { icon:'📍', title:'Manzil', val:"Toshkent shahar, Mirzo Ulug'bek tumani" },
              { icon:'📞', title:'Telefon', val:'+998 71 123 45 67' },
              { icon:'✉️', title:'Email', val:'info@emc-academy.uz' },
              { icon:'🕐', title:'Ish vaqti', val:'Du-Sha: 09:00 — 20:00' },
            ].map(c => (
              <div key={c.title} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
                <div style={{ fontSize:'1.5rem', marginBottom:10 }}>{c.icon}</div>
                <div style={{ fontWeight:700, fontSize:'0.875rem', marginBottom:6 }}>{c.title}</div>
                <div style={{ fontSize:'0.85rem', color:'var(--text2)' }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
