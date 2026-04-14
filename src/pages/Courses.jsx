import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { courseService, storageService } from '../firebase';
import { Spinner, EmptyState, Btn, Modal, FormGroup, Input, Textarea, Select, Badge } from '../components/UI';
import { CourseCard } from './Home';

const CATS = [
  { key:'', label:'Barchasi' },
  { key:'programming', label:'💻 Dasturlash' },
  { key:'design', label:'🎨 Dizayn' },
  { key:'marketing', label:'📣 Marketing' },
  { key:'english', label:'🇬🇧 Ingliz tili' },
  { key:'math', label:'📐 Matematika' },
  { key:'business', label:'💼 Biznes' },
];

export default function Courses() {
  const { currentUser, isTeacher, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState(searchParams.get('cat') || '');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', category:'programming', level:'beginner', duration:'', price:'', language:'uz', coverImage:null, isFeatured:false });

  const load = async (c = cat) => {
    setLoading(true);
    const data = await courseService.getAll(c || null);
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [cat]);

  const filtered = search ? courses.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())) : courses;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      let coverImage = '';
      if (form.coverImage) coverImage = await storageService.upload(`courses/${Date.now()}_${form.coverImage.name}`, form.coverImage);
      await courseService.create({
        title: form.title,
        description: form.description,
        category: form.category,
        level: form.level,
        duration: form.duration,
        price: form.price ? parseInt(form.price) : 0,
        language: form.language,
        isFeatured: form.isFeatured,
        coverImage,
        createdBy: currentUser.uid,
        teacherName: currentUser.displayName,
      });
      showToast('Kurs yaratildi! ✓', 'success');
      setShowModal(false);
      setForm({ title:'', description:'', category:'programming', level:'beginner', duration:'', price:'', language:'uz', coverImage:null, isFeatured:false });
      load();
    } catch(err) { showToast(err.message, 'error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      <style>{`
        .filter-pill { padding:8px 18px; border-radius:999px; border:1.5px solid var(--border); background:var(--bg2); color:var(--text2); font-size:.82rem; font-weight:600; cursor:pointer; transition:all .2s; white-space:nowrap; }
        .filter-pill:hover { border-color:var(--yellow); color:var(--text); }
        .filter-pill.active { background:var(--yellow); border-color:var(--yellow); color:var(--navy); }
      `}</style>

      {/* Page header */}
      <div style={{ background:'var(--navy)', padding:'60px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,214,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.04) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative' }}>
          <Badge color="yellow" style={{ marginBottom:16, display:'inline-block' }}>Kurslar</Badge>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <h1 style={{ color:'white', marginBottom:10 }}>Barcha Kurslar</h1>
              <p style={{ color:'rgba(255,255,255,0.5)' }}>{courses.length} ta kurs mavjud</p>
            </div>
            {isTeacher && <Btn onClick={() => setShowModal(true)}>+ Kurs Qo'shish</Btn>}
          </div>
        </div>
      </div>

      {/* Filters + Search */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'20px 32px', position:'sticky', top:'var(--nav-h)', zIndex:10 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', flex:1 }}>
            {CATS.map(c => (
              <button key={c.key} className={`filter-pill${cat===c.key?' active':''}`} onClick={() => setCat(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--bg3)', border:'1.5px solid var(--border)', borderRadius:999, padding:'8px 16px', minWidth:220 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Kurs qidirish..." style={{ background:'none', border:'none', outline:'none', fontSize:'0.875rem', color:'var(--text)', width:'100%', fontFamily:'var(--font-body)' }} />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 32px 80px' }}>
        {loading ? <Spinner /> : filtered.length === 0 ? (
          <EmptyState icon="📚" title="Kurslar topilmadi" sub="Boshqa kalit so'z bilan qidiring" />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:24 }}>
            {filtered.map(c => <CourseCard key={c.id} course={c} onClick={() => navigate(`/courses/${c.id}`)} />)}
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <Modal title="Yangi Kurs Yaratish" onClose={() => setShowModal(false)} wide>
          <form onSubmit={handleCreate}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <FormGroup label="Kurs nomi">
                  <Input required value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="Masalan: React.js dan Scratch gacha" />
                </FormGroup>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <FormGroup label="Tavsif">
                  <Textarea value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} placeholder="Kurs haqida batafsil..." style={{ minHeight:100 }} />
                </FormGroup>
              </div>
              <FormGroup label="Kategoriya">
                <Select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>
                  <option value="programming">💻 Dasturlash</option>
                  <option value="design">🎨 Dizayn</option>
                  <option value="marketing">📣 Marketing</option>
                  <option value="english">🇬🇧 Ingliz tili</option>
                  <option value="math">📐 Matematika</option>
                  <option value="business">💼 Biznes</option>
                </Select>
              </FormGroup>
              <FormGroup label="Daraja">
                <Select value={form.level} onChange={e => setForm(p=>({...p,level:e.target.value}))}>
                  <option value="beginner">📗 Boshlang'ich</option>
                  <option value="intermediate">📘 O'rta</option>
                  <option value="advanced">📕 Yuqori</option>
                </Select>
              </FormGroup>
              <FormGroup label="Davomiyligi (masalan: 3 oy)">
                <Input value={form.duration} onChange={e => setForm(p=>({...p,duration:e.target.value}))} placeholder="3 oy / 48 soat" />
              </FormGroup>
              <FormGroup label="Narx (so'm, 0 = bepul)">
                <Input type="number" min="0" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} placeholder="500000" />
              </FormGroup>
              <FormGroup label="Til">
                <Select value={form.language} onChange={e => setForm(p=>({...p,language:e.target.value}))}>
                  <option value="uz">🇺🇿 O'zbek</option>
                  <option value="ru">🇷🇺 Rus</option>
                  <option value="en">🇬🇧 Ingliz</option>
                </Select>
              </FormGroup>
              <FormGroup label="Muqova rasm">
                <Input type="file" accept="image/*" onChange={e => setForm(p=>({...p,coverImage:e.target.files[0]}))} />
              </FormGroup>
              <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(p=>({...p,isFeatured:e.target.checked}))} style={{ width:16, height:16 }} />
                <label htmlFor="featured" style={{ fontSize:'0.875rem', fontWeight:500, color:'var(--text2)', cursor:'pointer' }}>⭐ Featured kurs sifatida belgilash</label>
              </div>
            </div>
            <div style={{ marginTop:24 }}>
              <Btn type="submit" full disabled={submitting} size="lg">{submitting ? 'Yaratilmoqda...' : '✓ Kurs Yaratish'}</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
