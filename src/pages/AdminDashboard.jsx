import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { userService, courseService, lessonService, announcementService } from '../firebase';
import { Spinner, Btn, Badge, Avatar, StatCard, Modal, FormGroup, Input, Textarea, Select } from '../components/UI';

// ── ADMIN PAGE ────────────────────────────────────────────
export function Admin() {
  const { userProfile, isAdmin, showToast } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [data, setData] = useState({ users:[], courses:[], announcements:[] });
  const [loading, setLoading] = useState(true);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState({ title:'', body:'', type:'info' });

  useEffect(() => {
    if (userProfile && !isAdmin) { navigate('/'); return; }
    load();
  }, [userProfile]);

  const load = async () => {
    setLoading(true);
    const [users, courses, announcements] = await Promise.all([
      userService.getAllUsers(),
      courseService.getAll(),
      announcementService.getAll(),
    ]);
    setData({ users, courses, announcements });
    setLoading(false);
  };

  const act = async (fn) => { try { await fn(); await load(); } catch(err) { showToast(err.message, 'error'); } };

  const tabs = [
    { key:'dashboard', label:'📊 Dashboard' },
    { key:'users', label:`👥 Foydalanuvchilar (${data.users.length})` },
    { key:'courses', label:`📚 Kurslar (${data.courses.length})` },
    { key:'announcements', label:'📢 E\'lonlar' },
  ];

  const th = { padding:'12px 16px', textAlign:'left', background:'var(--bg3)', fontWeight:600, color:'var(--text2)', borderBottom:'1px solid var(--border)', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' };
  const td = { padding:'14px 16px', borderBottom:'1px solid var(--border)', fontSize:'0.875rem', verticalAlign:'middle' };

  const ROLE = { student:'student', teacher:'teacher', admin:'admin' };
  const students = data.users.filter(u => u.role === 'student').length;
  const teachers = data.users.filter(u => u.role === 'teacher' || u.role === 'admin').length;

  const handleAnnouncement = async (e) => {
    e.preventDefault();
    await announcementService.create({ ...annForm });
    showToast("E'lon qo'shildi ✓", 'success');
    setShowAnnModal(false);
    setAnnForm({ title:'', body:'', type:'info' });
    load();
  };

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ background:'var(--navy)', padding:'40px 32px' }}>
        <div style={{ maxWidth:1300, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--yellow)', animation:'pulse 2s infinite' }} />
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Admin Panel</span>
          </div>
          <h1 style={{ color:'white' }}>EMC Academy Boshqaruv</h1>
        </div>
      </div>

      <div style={{ maxWidth:1300, margin:'0 auto', padding:'32px' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'var(--bg3)', borderRadius:'var(--radius)', padding:6, marginBottom:32, flexWrap:'wrap', overflowX:'auto' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, minWidth:120, padding:'10px 16px', background:tab===t.key?'var(--bg2)':'none',
              border:'none', borderRadius:'var(--radius-sm)', fontSize:'0.82rem', fontWeight:600,
              color:tab===t.key?'var(--text)':'var(--text2)', cursor:'pointer',
              fontFamily:'var(--font-body)', boxShadow:tab===t.key?'var(--shadow)':'none',
              transition:'all var(--tr)', whiteSpace:'nowrap',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? <Spinner /> : <>
          {/* Dashboard */}
          {tab === 'dashboard' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20, marginBottom:40 }}>
                <StatCard icon="👥" value={data.users.length} label="Jami foydalanuvchilar" color="yellow" />
                <StatCard icon="👨‍🎓" value={students} label="Talabalar" color="electric" />
                <StatCard icon="👨‍🏫" value={teachers} label="O'qituvchilar" color="green" />
                <StatCard icon="📚" value={data.courses.length} label="Kurslar" color="orange" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
                <div>
                  <h3 style={{ marginBottom:16 }}>So'nggi foydalanuvchilar</h3>
                  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                    {data.users.slice(0,6).map((u,i) => (
                      <div key={u.id} style={{ padding:'14px 18px', borderBottom: i<5 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', gap:12 }}>
                        <Avatar user={u} size={32} />
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'0.875rem', fontWeight:600 }}>{u.displayName}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>{u.email}</div>
                        </div>
                        <Badge color={u.role==='admin'?'orange':u.role==='teacher'?'electric':'navy'}>{u.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ marginBottom:16 }}>Kurslar statistikasi</h3>
                  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                    {data.courses.slice(0,6).map((c,i) => (
                      <div key={c.id} style={{ padding:'14px 18px', borderBottom:i<5?'1px solid var(--border)':'none', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                          {{'programming':'💻','design':'🎨','marketing':'📣','english':'🇬🇧','math':'📐','business':'💼'}[c.category]||'📚'}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'0.875rem', fontWeight:600, marginBottom:2 }}>{c.title}</div>
                          <div style={{ fontSize:'0.75rem', color:'var(--text3)' }}>👥 {c.studentCount||0} talaba</div>
                        </div>
                        {c.price ? <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text)' }}>{c.price.toLocaleString()} so'm</span> : <Badge color="green">Bepul</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {tab === 'users' && (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--surface)', borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)' }}>
                <thead><tr>
                  <th style={th}>Foydalanuvchi</th>
                  <th style={th}>Email</th>
                  <th style={th}>Kurslar</th>
                  <th style={th}>Rol</th>
                  <th style={th}>Amallar</th>
                </tr></thead>
                <tbody>
                  {data.users.map(u => (
                    <tr key={u.id} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={td}><div style={{ display:'flex', alignItems:'center', gap:10 }}><Avatar user={u} size={32} /><span style={{ fontWeight:600 }}>{u.displayName}</span></div></td>
                      <td style={{ ...td, color:'var(--text2)' }}>{u.email}</td>
                      <td style={td}>{u.enrolledCourses?.length || 0} ta</td>
                      <td style={td}><Badge color={u.role==='admin'?'orange':u.role==='teacher'?'electric':'navy'}>{u.role}</Badge></td>
                      <td style={td}>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {u.role !== 'teacher' && u.role !== 'admin' && <Btn size="sm" variant="outline" onClick={()=>act(()=>userService.setRole(u.id,'teacher'))}>O'qituvchi</Btn>}
                          {u.role !== 'admin' && <Btn size="sm" variant="dark" onClick={()=>act(()=>userService.setRole(u.id,'admin'))}>Admin</Btn>}
                          {u.role !== 'student' && <Btn size="sm" variant="outline" onClick={()=>act(()=>userService.setRole(u.id,'student'))}>Talaba</Btn>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Courses */}
          {tab === 'courses' && (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', background:'var(--surface)', borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)' }}>
                <thead><tr>
                  <th style={th}>Kurs</th>
                  <th style={th}>Kategoriya</th>
                  <th style={th}>O'qituvchi</th>
                  <th style={th}>Talabalar</th>
                  <th style={th}>Narx</th>
                  <th style={th}>Amallar</th>
                </tr></thead>
                <tbody>
                  {data.courses.map(c => (
                    <tr key={c.id} onMouseEnter={e=>e.currentTarget.style.background='var(--bg3)'} onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <td style={{ ...td, fontWeight:600, maxWidth:200 }}>{c.title}</td>
                      <td style={td}><Badge color="navy">{c.category}</Badge></td>
                      <td style={{ ...td, color:'var(--text2)' }}>{c.teacherName||'—'}</td>
                      <td style={td}>{c.studentCount||0}</td>
                      <td style={td}>{c.price ? `${c.price.toLocaleString()} so'm` : <span style={{color:'var(--green)',fontWeight:600}}>Bepul</span>}</td>
                      <td style={td}>
                        <div style={{ display:'flex', gap:6 }}>
                          <Btn size="sm" variant="outline" onClick={()=>navigate(`/courses/${c.id}`)}>Ko'rish</Btn>
                          <Btn size="sm" variant="danger" onClick={()=>{if(confirm("O'chirasizmi?"))act(()=>courseService.delete(c.id));}}>O'chir</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Announcements */}
          {tab === 'announcements' && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
                <h3>E'lonlar</h3>
                <Btn onClick={()=>setShowAnnModal(true)}>+ E'lon Qo'shish</Btn>
              </div>
              <div style={{ display:'grid', gap:16 }}>
                {data.announcements.length===0 ? <p style={{color:'var(--text3)'}}>E'lonlar yo'q</p> :
                  data.announcements.map(a => (
                    <div key={a.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20, display:'flex', justifyContent:'space-between', gap:16 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                          <Badge color={a.type==='warning'?'orange':a.type==='success'?'green':'electric'}>{a.type}</Badge>
                          <span style={{ fontWeight:700 }}>{a.title}</span>
                        </div>
                        <p style={{ fontSize:'0.875rem' }}>{a.body}</p>
                      </div>
                      <Btn size="sm" variant="danger" onClick={()=>act(()=>announcementService.delete(a.id))}>✕</Btn>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </>}
      </div>

      {showAnnModal && (
        <Modal title="E'lon Qo'shish" onClose={()=>setShowAnnModal(false)}>
          <form onSubmit={handleAnnouncement}>
            <FormGroup label="Sarlavha"><Input required value={annForm.title} onChange={e=>setAnnForm(p=>({...p,title:e.target.value}))} /></FormGroup>
            <FormGroup label="Matn"><Textarea required value={annForm.body} onChange={e=>setAnnForm(p=>({...p,body:e.target.value}))} /></FormGroup>
            <FormGroup label="Tur">
              <Select value={annForm.type} onChange={e=>setAnnForm(p=>({...p,type:e.target.value}))}>
                <option value="info">ℹ Info</option>
                <option value="success">✓ Muvaffaqiyat</option>
                <option value="warning">⚠ Ogohlantirish</option>
              </Select>
            </FormGroup>
            <Btn type="submit" full>E'lon Qo'shish</Btn>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── TEACHER DASHBOARD ─────────────────────────────────────
export function Dashboard() {
  const { currentUser, userProfile, isTeacher, showToast } = useApp();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (userProfile && !isTeacher) { navigate('/'); return; }
    load();
  }, [userProfile]);

  const load = async () => {
    const [allCourses, anns] = await Promise.all([courseService.getAll(), announcementService.getAll()]);
    setMyCourses(allCourses.filter(c => c.createdBy === currentUser?.uid));
    setAnnouncements(anns);
    setLoading(false);
  };

  if (loading) return <div style={{ paddingTop:'var(--nav-h)' }}><Spinner /></div>;

  const totalStudents = myCourses.reduce((sum, c) => sum + (c.studentCount || 0), 0);

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ background:'var(--navy)', padding:'40px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ color:'rgba(255,255,255,0.5)', marginBottom:8, fontSize:'0.875rem' }}>O'qituvchi paneli</p>
          <h1 style={{ color:'white' }}>Xush kelibsiz, {userProfile?.displayName?.split(' ')[0]}! 👋</h1>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:20, marginBottom:40 }}>
          <StatCard icon="📚" value={myCourses.length} label="Mening kurslarim" color="yellow" />
          <StatCard icon="👥" value={totalStudents} label="Jami talabalar" color="electric" />
          <StatCard icon="📢" value={announcements.length} label="Faol e'lonlar" color="green" />
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div style={{ marginBottom:40 }}>
            <h3 style={{ marginBottom:16 }}>📢 E'lonlar</h3>
            <div style={{ display:'grid', gap:12 }}>
              {announcements.map(a => (
                <div key={a.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:14 }}>
                  <span style={{ fontSize:'1.3rem' }}>{a.type==='warning'?'⚠':a.type==='success'?'✓':'ℹ'}</span>
                  <div>
                    <div style={{ fontWeight:700, marginBottom:4 }}>{a.title}</div>
                    <p style={{ fontSize:'0.875rem' }}>{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My courses */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3>Mening Kurslarim</h3>
          <Btn size="sm" onClick={()=>navigate('/courses')}>+ Yangi Kurs</Btn>
        </div>
        {myCourses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 0', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>📚</div>
            <p style={{ marginBottom:20 }}>Hali kurs yaratmagansiz</p>
            <Btn onClick={()=>navigate('/courses')}>Birinchi Kursni Yarating</Btn>
          </div>
        ) : (
          <div style={{ display:'grid', gap:14 }}>
            {myCourses.map(c => (
              <div key={c.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 24px', display:'flex', alignItems:'center', gap:20, cursor:'pointer', transition:'all var(--tr)' }}
                onClick={()=>navigate(`/courses/${c.id}`)}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--yellow)';e.currentTarget.style.transform='translateX(4px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform='';}}
              >
                <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,214,0,0.1)', border:'1.5px solid rgba(255,214,0,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
                  {{'programming':'💻','design':'🎨','marketing':'📣','english':'🇬🇧','math':'📐','business':'💼'}[c.category]||'📚'}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, marginBottom:4 }}>{c.title}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text3)' }}>👥 {c.studentCount||0} talaba · {c.price?`${c.price.toLocaleString()} so'm`:'Bepul'}</div>
                </div>
                <div style={{ color:'var(--text3)', fontSize:'0.875rem' }}>→</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
