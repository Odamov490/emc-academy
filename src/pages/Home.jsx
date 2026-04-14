import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { courseService } from '../firebase';
import { Card, Btn, Badge, Stars } from '../components/UI';

const STATS = [
  { value:'2,400+', label:"Talabalar", icon:'👨‍🎓', color:'#FFD600' },
  { value:'48', label:"Kurslar", icon:'📚', color:'#00D4FF' },
  { value:'120+', label:"Darslar", icon:'🎬', color:'#00E676' },
  { value:'98%', label:"Mamnunlik", icon:'⭐', color:'#FF6B35' },
];

const CATEGORIES = [
  { key:'programming', label:'Dasturlash', icon:'💻', color:'#00D4FF' },
  { key:'design', label:'Dizayn', icon:'🎨', color:'#FF6B35' },
  { key:'marketing', label:'Marketing', icon:'📣', color:'#00E676' },
  { key:'english', label:'Ingliz tili', icon:'🇬🇧', color:'#FFD600' },
  { key:'math', label:'Matematika', icon:'📐', color:'#FF4444' },
  { key:'business', label:'Biznes', icon:'💼', color:'#A855F7' },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(target.replace(/\D/g, '')) || 0;
    const step = Math.ceil(num / 60);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, num);
      setCount(cur);
      if (cur >= num) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{target.includes('+') ? '+' : ''}{target.includes('%') ? '%' : ''}</span>;
}

export default function Home() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then(d => { setCourses(d.slice(0, 6)); setLoading(false); });
  }, []);

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <style>{`
        .hero-section { min-height:calc(100vh - var(--nav-h)); position:relative; display:flex; align-items:center; overflow:hidden; }
        .floating-card { position:absolute; background:rgba(255,255,255,0.9); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.6); border-radius:16px; padding:14px 18px; box-shadow:0 8px 32px rgba(0,0,0,0.12); }
        [data-theme="dark"] .floating-card { background:rgba(13,17,32,0.9); border-color:rgba(255,255,255,0.1); }
        .course-card { transition:all 0.25s ease; }
        .course-card:hover { transform:translateY(-6px); box-shadow:0 20px 60px rgba(0,0,0,0.12); border-color:var(--yellow)!important; }
        .cat-card { transition:all 0.2s ease; cursor:pointer; }
        .cat-card:hover { transform:translateY(-4px) scale(1.03); }
        .section { max-width:1200px; margin:0 auto; padding:80px 32px; }
        @media(max-width:768px) { .section { padding:60px 20px; } .hero-content { text-align:center; } .floating-cards { display:none!important; } }
        .btn-pill { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border-radius:999px; font-size:0.82rem; font-weight:600; border:1.5px solid var(--border); background:var(--bg2); color:var(--text); cursor:pointer; transition:all var(--tr); }
        .btn-pill:hover { border-color:var(--yellow); color:var(--text); }
      `}</style>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="hero-section grid-bg">
        {/* BG blobs */}
        <div style={{ position:'absolute', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,214,0,0.12) 0%, transparent 70%)', top:-100, right:-100, pointerEvents:'none' }} />
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)', bottom:0, left:-50, pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 32px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center', width:'100%' }}>
          {/* Left */}
          <div className="hero-content">
            <div className="anim-up" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,214,0,0.12)', border:'1px solid rgba(255,214,0,0.3)', borderRadius:999, padding:'8px 18px', marginBottom:24 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--yellow)', animation:'pulse 1.5s infinite' }} />
              <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--yellow-dark)', letterSpacing:'0.04em', textTransform:'uppercase' }}>
                O'zbekistoning #1 IT Akademiyasi
              </span>
            </div>

            <h1 className="anim-up-1" style={{ marginBottom:20, letterSpacing:'-0.03em' }}>
              Kelajagingizni<br />
              <span className="grad-text">EMC Academy</span><br />
              bilan Quring
            </h1>

            <p className="anim-up-2" style={{ fontSize:'1.1rem', marginBottom:36, maxWidth:480, lineHeight:1.75 }}>
              Zamonaviy texnologiyalar, tajribali o'qituvchilar va amaliy loyihalar orqali IT sohasida kasbingizni boshlang.
            </p>

            <div className="anim-up-3" style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40 }}>
              <Btn size="lg" onClick={() => navigate('/courses')} style={{ borderRadius:999 }}>
                🚀 Kurslarni Ko'rish
              </Btn>
              <Btn variant="outline" size="lg" onClick={() => navigate('/about')} style={{ borderRadius:999 }}>
                Biz Haqimizda →
              </Btn>
            </div>

            <div className="anim-up-4" style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {[
                { icon:'✓', text:'Sertifikat beriladi' },
                { icon:'✓', text:"Ish joyiga joylashishga ko'mak" },
                { icon:'✓', text:'Onlayn va offline' },
              ].map(item => (
                <div key={item.text} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.82rem', color:'var(--text2)', fontWeight:500 }}>
                  <span style={{ width:18, height:18, borderRadius:'50%', background:'rgba(0,230,118,0.15)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800, flexShrink:0 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="floating-cards" style={{ position:'relative', height:500 }}>
            {/* Main card */}
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:280, height:340, background:'linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)', borderRadius:24, padding:28, boxShadow:'0 24px 80px rgba(10,14,26,0.3)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'var(--yellow)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>💻</div>
                <div>
                  <div style={{ color:'white', fontSize:'0.85rem', fontWeight:700 }}>React.js Kursi</div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem' }}>48 dars</div>
                </div>
              </div>
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:12, padding:16, marginBottom:16 }}>
                <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>Kurs jarayoni</div>
                <div style={{ height:6, background:'rgba(255,255,255,0.1)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ width:'72%', height:'100%', background:'linear-gradient(90deg, var(--yellow), var(--electric))', borderRadius:3 }} />
                </div>
                <div style={{ color:'white', fontSize:'0.8rem', fontWeight:700, marginTop:8 }}>72% tugallandi</div>
              </div>
              {[1,2,3].map(i => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background: i<=2 ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.05)', border: i<=2 ? '1.5px solid var(--green)' : '1.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', color: i<=2 ? 'var(--green)' : 'rgba(255,255,255,0.3)', flexShrink:0 }}>
                    {i<=2 ? '✓' : ''}
                  </div>
                  <div style={{ height:6, flex:1, background: i<=2 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)', borderRadius:3 }} />
                </div>
              ))}
            </div>

            {/* Floating cards */}
            <div className="floating-card float" style={{ top:40, right:0, minWidth:160 }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:4 }}>Yangi sertifikat</div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:'1.3rem' }}>🏆</span>
                <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text)' }}>Full Stack Dev</div>
              </div>
            </div>

            <div className="floating-card" style={{ bottom:60, right:10, minWidth:180, animationDelay:'1s' }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:6 }}>Haftalik talabalar</div>
              <div style={{ display:'flex', gap:-8 }}>
                {['#FFD600','#00D4FF','#00E676','#FF6B35'].map((c, i) => (
                  <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:c, border:'2px solid var(--bg2)', marginLeft: i > 0 ? -8 : 0 }} />
                ))}
              </div>
              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text)', marginTop:6 }}>+124 bu hafta</div>
            </div>

            <div className="floating-card" style={{ top:100, left:-20, minWidth:140 }}>
              <div style={{ fontSize:'0.72rem', color:'var(--text3)', marginBottom:4 }}>Reyting</div>
              <Stars rating={5} />
              <div style={{ fontSize:'0.72rem', color:'var(--text2)', marginTop:2 }}>4.9 / 5.0</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────── */}
      <div style={{ background:'var(--navy)', padding:'48px 32px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize:'1.8rem', marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'2.2rem', fontWeight:800, color:s.color, lineHeight:1 }}>
                <AnimatedCounter target={s.value} />
              </div>
              <div style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.5)', marginTop:6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ─────────────────────────────────── */}
      <section className="section">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <Badge color="electric">Yo'nalishlar</Badge>
          <h2 style={{ marginTop:12, marginBottom:12 }}>Qaysi sohada o'smoqchisiz?</h2>
          <p>Har bir yo'nalish bo'yicha mutaxassis o'qituvchilarimiz tayyor</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:16 }}>
          {CATEGORIES.map(c => (
            <div key={c.key} className="cat-card"
              onClick={() => navigate(`/courses?cat=${c.key}`)}
              style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'28px 20px', textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:16, background:`${c.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', margin:'0 auto 14px' }}>{c.icon}</div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:700, fontSize:'0.95rem', color:'var(--text)' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED COURSES ────────────────────────────── */}
      <section style={{ background:'var(--surface2)' }}>
        <div className="section">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
            <div>
              <Badge color="yellow">Kurslar</Badge>
              <h2 style={{ marginTop:12 }}>Mashhur Kurslar</h2>
            </div>
            <Link to="/courses" style={{ display:'flex', alignItems:'center', gap:6, color:'var(--text2)', fontWeight:600, fontSize:'0.875rem', textDecoration:'none' }}>
              Barchasini ko'rish →
            </Link>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height:320, borderRadius:'var(--radius)', background:'linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%)', backgroundSize:'400px 100%', animation:'shimmer 1.5s infinite' }} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📚</div>
              <p>Hozircha kurslar yo'q. Admin kurslar qo'shishi mumkin.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
              {courses.map(c => <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY EMC ─────────────────────────────────────── */}
      <section className="section">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <Badge color="green">Afzalliklar</Badge>
          <h2 style={{ marginTop:12, marginBottom:12 }}>Nega EMC Academy?</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:24 }}>
          {[
            { icon:'🎯', title:'Amaliy ta\'lim', desc:"Har bir kurs real loyihalar bilan mustahkamlanadi. Nazariya emas, amaliyot birinchi." },
            { icon:'👨‍🏫', title:'Tajribali o\'qituvchilar', desc:"IT sohasida 5+ yil tajribaga ega professional mutaxassislar." },
            { icon:'📜', title:'Sertifikat', desc:"Kursni tugatgach xalqaro sertifikat beriladi. Ish topishda yordam beradi." },
            { icon:'💼', title:'Ish joyiga joylashish', desc:"Bitiruvchilarning 85% birinchi 3 oyda ish topadi." },
            { icon:'🌐', title:'Onlayn & Offline', desc:"Istalgan joydan o'qish imkoniyati. Dars yozuvlari saqlanib qoladi." },
            { icon:'🤝', title:'Jamiyat', desc:"Kuchli alumni hamjamiyati va networking imkoniyatlari." },
          ].map(f => (
            <div key={f.title} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:28 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', marginBottom:16 }}>{f.icon}</div>
              <h3 style={{ fontSize:'1rem', marginBottom:8 }}>{f.title}</h3>
              <p style={{ fontSize:'0.85rem', lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section style={{ background:'var(--navy)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,214,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.05) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ maxWidth:700, margin:'0 auto', padding:'80px 32px', textAlign:'center', position:'relative' }}>
          <h2 style={{ color:'white', marginBottom:16 }}>Karyerangizni Bugun Boshlang!</h2>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'1.05rem', marginBottom:36 }}>
            2,400+ talaba allaqachon EMC Academy bilan o'z kelajagini qurmoqda.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Btn size="lg" onClick={() => navigate('/courses')} style={{ borderRadius:999 }}>
              🚀 Bepul Boshlash
            </Btn>
            <Btn variant="ghost" size="lg" onClick={() => navigate('/about')} style={{ color:'rgba(255,255,255,0.7)', borderRadius:999, border:'1px solid rgba(255,255,255,0.15)' }}>
              Ko'proq Bilish
            </Btn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={{ background:'var(--navy2)', padding:'48px 32px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.3rem', color:'var(--yellow)', marginBottom:12 }}>EMC Academy</div>
              <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.4)', lineHeight:1.8 }}>
                O'zbekistoning yetakchi IT ta'lim platformasi. Kelajak bu yerdan boshlanadi.
              </p>
            </div>
            {[
              { title:'Kurslar', links:['Dasturlash','Dizayn','Marketing','Ingliz tili'] },
              { title:'Kompaniya', links:['Haqimizda','O\'qituvchilar','Blog','Aloqa'] },
              { title:'Yordam', links:["Ko'p so'raladigan savollar",'Shartlar','Maxfiylik'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontFamily:'var(--font-head)', fontWeight:700, color:'white', marginBottom:12, fontSize:'0.9rem' }}>{col.title}</div>
                {col.links.map(l => <div key={l} style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.4)', marginBottom:8, cursor:'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:24, textAlign:'center', fontSize:'0.8rem', color:'rgba(255,255,255,0.3)' }}>
            © 2024 EMC Academy. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function CourseCard({ course, onClick }) {
  const LEVEL = { beginner:'Boshlang\'ich', intermediate:"O'rta", advanced:'Yuqori' };
  const CAT_COLORS = { programming:'electric', design:'orange', marketing:'green', english:'yellow', math:'red', business:'navy' };
  return (
    <Card onClick={onClick} style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ height:160, background:`linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%)`, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {course.coverImage
          ? <img src={course.coverImage} alt={course.title} style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
          : <span style={{ fontSize:'3.5rem', zIndex:1 }}>{
              { programming:'💻', design:'🎨', marketing:'📣', english:'🇬🇧', math:'📐', business:'💼' }[course.category] || '📚'
            }</span>}
        <div style={{ position:'absolute', top:12, left:12 }}>
          <Badge color={CAT_COLORS[course.category] || 'navy'}>{course.category}</Badge>
        </div>
        {course.isFeatured && <div style={{ position:'absolute', top:12, right:12 }}><Badge color="yellow">⭐ Featured</Badge></div>}
      </div>
      <div style={{ padding:'20px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
        <h3 style={{ fontSize:'1rem', lineHeight:1.4, color:'var(--text)' }}>{course.title}</h3>
        {course.description && <p style={{ fontSize:'0.82rem', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', lineHeight:1.6 }}>{course.description}</p>}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:4 }}>
          {course.duration && <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>⏱ {course.duration}</span>}
          {course.level && <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>📶 {LEVEL[course.level] || course.level}</span>}
          <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>👥 {course.studentCount || 0} talaba</span>
        </div>
        {course.rating > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Stars rating={course.rating} />
            <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>({course.ratingCount || 0})</span>
          </div>
        )}
      </div>
      <div style={{ padding:'14px 20px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          {course.price ? (
            <div style={{ fontFamily:'var(--font-head)', fontWeight:800, fontSize:'1.1rem', color:'var(--text)' }}>
              {course.price.toLocaleString()} so'm
            </div>
          ) : (
            <span style={{ color:'var(--green)', fontWeight:700, fontSize:'0.9rem' }}>✓ Bepul</span>
          )}
        </div>
        <div style={{ padding:'7px 16px', borderRadius:999, background:'var(--yellow)', color:'var(--navy)', fontSize:'0.8rem', fontWeight:700 }}>
          Boshlash →
        </div>
      </div>
    </Card>
  );
}
