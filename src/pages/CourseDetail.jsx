import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { courseService, lessonService, commentService, userService } from '../firebase';
import { Spinner, Btn, Badge, Stars, Avatar, Modal, FormGroup, Input, Textarea, Select } from '../components/UI';

const LEVEL = { beginner:"Boshlang'ich", intermediate:"O'rta", advanced:'Yuqori' };

export default function CourseDetail() {
  const { id } = useParams();
  const { currentUser, userProfile, isTeacher, showToast, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title:'', description:'', videoUrl:'', duration:'', order:1, isFree:true });
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEnrolled = userProfile?.enrolledCourses?.includes(id);
  const isOwner = course?.createdBy === currentUser?.uid || isTeacher;

  const load = async () => {
    const [c, ls] = await Promise.all([courseService.get(id), lessonService.getByCourse(id)]);
    if (!c) { navigate('/courses'); return; }
    setCourse(c); setLessons(ls);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (!id) return;
    return commentService.subscribe(id, setComments);
  }, [id]);

  const handleEnroll = async () => {
    if (!currentUser) { navigate('/auth'); return; }
    try {
      if (isEnrolled) await courseService.unenroll(id, currentUser.uid);
      else await courseService.enroll(id, currentUser.uid);
      showToast(isEnrolled ? 'Kursdan chiqildi' : 'Kursga yozildingiz! ✓', isEnrolled ? 'info' : 'success');
      await refreshProfile();
    } catch(err) { showToast(err.message, 'error'); }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await lessonService.create({ ...lessonForm, courseId: id, order: parseInt(lessonForm.order), createdBy: currentUser.uid });
      showToast("Dars qo'shildi! ✓", 'success');
      setShowLessonModal(false);
      setLessonForm({ title:'', description:'', videoUrl:'', duration:'', order: lessons.length + 1, isFree:true });
      load();
    } catch(err) { showToast(err.message, 'error'); }
    finally { setSubmitting(false); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;
    try {
      await commentService.add(id, { text: commentText, userId: currentUser.uid, userName: userProfile?.displayName || 'Talaba', userPhoto: userProfile?.photoURL || '' });
      setCommentText('');
    } catch(err) { showToast(err.message, 'error'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm("Darsni o'chirasizmi?")) return;
    await lessonService.delete(lessonId);
    showToast("Dars o'chirildi", 'success');
    load();
  };

  const handleDeleteComment = async (commentId) => {
    await commentService.delete(id, commentId);
    showToast("Izoh o'chirildi", 'info');
  };

  const extractYoutubeId = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) return <div style={{ paddingTop:'var(--nav-h)' }}><Spinner /></div>;
  if (!course) return null;

  const catIcon = { programming:'💻', design:'🎨', marketing:'📣', english:'🇬🇧', math:'📐', business:'💼' }[course.category] || '📚';

  const tabs = [
    { key:'overview', label:'Umumiy' },
    { key:'lessons', label:`Darslar (${lessons.length})` },
    { key:'comments', label:`Izohlar (${comments.length})` },
  ];

  return (
    <div style={{ paddingTop:'var(--nav-h)' }}>
      {/* Hero */}
      <div style={{ background:'var(--navy)', padding:'48px 32px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,214,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,214,0,0.04) 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 360px', gap:40, alignItems:'start', position:'relative' }}>
          <div>
            <button onClick={() => navigate('/courses')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', marginBottom:20, display:'flex', alignItems:'center', gap:6, fontSize:'0.875rem' }}>
              ← Kurslarga qaytish
            </button>
            <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
              <Badge color="yellow">{catIcon} {course.category}</Badge>
              {course.level && <Badge color="electric">{LEVEL[course.level]}</Badge>}
              {course.isFeatured && <Badge color="orange">⭐ Featured</Badge>}
            </div>
            <h1 style={{ color:'white', marginBottom:16, fontSize:'clamp(1.6rem, 3vw, 2.4rem)' }}>{course.title}</h1>
            {course.description && <p style={{ color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:20, fontSize:'1rem' }}>{course.description}</p>}
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', color:'rgba(255,255,255,0.5)', fontSize:'0.85rem' }}>
              {course.teacherName && <span>👨‍🏫 {course.teacherName}</span>}
              {course.duration && <span>⏱ {course.duration}</span>}
              <span>👥 {course.studentCount || 0} talaba</span>
              {course.rating > 0 && <span>⭐ {course.rating.toFixed(1)} ({course.ratingCount})</span>}
              {course.language && <span>🌐 {course.language === 'uz' ? "O'zbekcha" : course.language === 'ru' ? 'Ruscha' : 'Inglizcha'}</span>}
            </div>
          </div>

          {/* Sidebar card */}
          <div style={{ background:'var(--bg2)', borderRadius:'var(--radius-lg)', overflow:'hidden', boxShadow:'var(--shadow2)' }}>
            {course.coverImage ? (
              <img src={course.coverImage} alt={course.title} style={{ width:'100%', height:180, objectFit:'cover' }} />
            ) : (
              <div style={{ width:'100%', height:180, background:'linear-gradient(135deg, var(--navy3), var(--navy2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem' }}>{catIcon}</div>
            )}
            <div style={{ padding:24 }}>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.8rem', fontWeight:800, color:'var(--text)', marginBottom:6 }}>
                {course.price ? `${course.price.toLocaleString()} so'm` : <span style={{ color:'var(--green)' }}>✓ Bepul</span>}
              </div>
              {currentUser ? (
                <Btn full size="lg" variant={isEnrolled ? 'outline' : 'primary'} onClick={handleEnroll} style={{ borderRadius:999, marginBottom:12 }}>
                  {isEnrolled ? '✓ Yozilgansiz — Chiqish' : '🚀 Kursga Yozilish'}
                </Btn>
              ) : (
                <Btn full size="lg" onClick={() => navigate('/auth')} style={{ borderRadius:999, marginBottom:12 }}>
                  Kirish va Yozilish
                </Btn>
              )}
              {isOwner && (
                <Btn full variant="dark" size="sm" onClick={() => setShowLessonModal(true)} style={{ marginTop:8 }}>
                  + Dars Qo'shish
                </Btn>
              )}
              <div style={{ marginTop:16, display:'grid', gap:10 }}>
                {[
                  { icon:'📚', text:`${lessons.length} ta dars` },
                  { icon:'🏆', text:'Sertifikat beriladi' },
                  { icon:'♾️', text:'Doimiy kirish huquqi' },
                ].map(item => (
                  <div key={item.text} style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:'var(--text2)' }}>
                    <span>{item.icon}</span>{item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'0 32px', position:'sticky', top:'var(--nav-h)', zIndex:10 }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:4 }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding:'16px 20px', background:'none', border:'none',
              borderBottom:`2px solid ${activeTab===tab.key ? 'var(--yellow)' : 'transparent'}`,
              color: activeTab===tab.key ? 'var(--text)' : 'var(--text2)',
              fontWeight:600, fontSize:'0.875rem', cursor:'pointer',
              fontFamily:'var(--font-body)', transition:'all var(--tr)', marginBottom:-1,
            }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 32px 80px' }}>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
            <div>
              <h3 style={{ marginBottom:16 }}>Kurs haqida</h3>
              <p style={{ lineHeight:1.8, marginBottom:24 }}>{course.description || 'Tavsif qo\'shilmagan.'}</p>
              {course.whatYouLearn && (
                <>
                  <h3 style={{ marginBottom:16 }}>Nima o'rganasiz?</h3>
                  <div style={{ display:'grid', gap:10 }}>
                    {course.whatYouLearn.split('\n').filter(Boolean).map((item, i) => (
                      <div key={i} style={{ display:'flex', gap:10, fontSize:'0.875rem', color:'var(--text2)' }}>
                        <span style={{ color:'var(--green)', flexShrink:0 }}>✓</span>{item}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div>
              <h3 style={{ marginBottom:16 }}>Kurs ma'lumotlari</h3>
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden' }}>
                {[
                  ['📶 Daraja', LEVEL[course.level] || '—'],
                  ['⏱ Davomiylik', course.duration || '—'],
                  ['👥 Talabalar', `${course.studentCount || 0} ta`],
                  ['🌐 Til', course.language === 'uz' ? "O'zbekcha" : course.language === 'ru' ? 'Ruscha' : 'Inglizcha'],
                  ['📚 Darslar', `${lessons.length} ta`],
                  ['👨‍🏫 O\'qituvchi', course.teacherName || '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', fontSize:'0.875rem' }}>
                    <span style={{ color:'var(--text2)' }}>{label}</span>
                    <span style={{ fontWeight:600, color:'var(--text)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Lessons */}
        {activeTab === 'lessons' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h3>Darslar</h3>
              {isOwner && <Btn onClick={() => setShowLessonModal(true)} size="sm">+ Dars Qo'shish</Btn>}
            </div>
            {lessons.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 0', color:'var(--text3)' }}>
                <div style={{ fontSize:'3rem', marginBottom:16 }}>🎬</div>
                <p>Hozircha darslar yo'q</p>
              </div>
            ) : (
              <div style={{ display:'grid', gap:12 }}>
                {lessons.map((lesson, i) => {
                  const ytId = extractYoutubeId(lesson.videoUrl);
                  const canWatch = isEnrolled || lesson.isFree || isOwner;
                  return (
                    <div key={lesson.id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', overflow:'hidden', transition:'all var(--tr)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--yellow)'; e.currentTarget.style.boxShadow='var(--shadow)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow=''; }}
                    >
                      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:16 }}>
                        <div style={{ width:40, height:40, borderRadius:10, background: canWatch ? 'rgba(255,214,0,0.1)' : 'var(--bg3)', border: canWatch ? '1.5px solid rgba(255,214,0,0.3)' : '1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                          {canWatch ? '▶' : '🔒'}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)', marginBottom:4 }}>
                            {i+1}. {lesson.title}
                          </div>
                          {lesson.description && <div style={{ fontSize:'0.78rem', color:'var(--text3)' }}>{lesson.description}</div>}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          {lesson.duration && <span style={{ fontSize:'0.78rem', color:'var(--text3)' }}>⏱ {lesson.duration}</span>}
                          {lesson.isFree && <Badge color="green">Bepul</Badge>}
                          {isOwner && (
                            <button onClick={() => handleDeleteLesson(lesson.id)} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:'0.8rem', padding:'4px 8px' }}>✕</button>
                          )}
                        </div>
                      </div>
                      {canWatch && ytId && (
                        <div style={{ padding:'0 20px 16px' }}>
                          <div style={{ position:'relative', paddingBottom:'56.25%', borderRadius:'var(--radius-sm)', overflow:'hidden', background:'var(--navy)' }}>
                            <iframe src={`https://www.youtube.com/embed/${ytId}`} style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:'none' }} allowFullScreen title={lesson.title} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        {activeTab === 'comments' && (
          <div style={{ maxWidth:700 }}>
            {currentUser && (
              <form onSubmit={handleComment} style={{ marginBottom:32 }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <Avatar user={userProfile} size={40} />
                  <div style={{ flex:1 }}>
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Fikringizni yozing..."
                      style={{ width:'100%', padding:'12px 16px', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', background:'var(--bg3)', color:'var(--text)', fontSize:'0.875rem', outline:'none', resize:'none', minHeight:80, fontFamily:'var(--font-body)', transition:'all var(--tr)' }}
                      onFocus={e => { e.target.style.borderColor='var(--yellow)'; e.target.style.background='var(--bg2)'; }}
                      onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.background='var(--bg3)'; }}
                    />
                    <div style={{ marginTop:8, display:'flex', justifyContent:'flex-end' }}>
                      <Btn type="submit" size="sm" disabled={!commentText.trim()}>Izoh Qo'shish</Btn>
                    </div>
                  </div>
                </div>
              </form>
            )}
            <div style={{ display:'grid', gap:16 }}>
              {comments.map(c => (
                <div key={c.id} style={{ display:'flex', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--yellow),var(--electric))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:700, fontSize:'0.85rem', color:'var(--navy)', overflow:'hidden' }}>
                    {c.userPhoto ? <img src={c.userPhoto} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : (c.userName||'?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{c.userName}</span>
                      <span style={{ fontSize:'0.75rem', color:'var(--text3)' }}>
                        {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p style={{ fontSize:'0.875rem', lineHeight:1.7 }}>{c.text}</p>
                  </div>
                  {(c.userId === currentUser?.uid || isTeacher) && (
                    <button onClick={() => handleDeleteComment(c.id)} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'0.85rem', alignSelf:'flex-start', padding:4 }}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      {showLessonModal && (
        <Modal title="Dars Qo'shish" onClose={() => setShowLessonModal(false)}>
          <form onSubmit={handleAddLesson}>
            <FormGroup label="Dars nomi">
              <Input required value={lessonForm.title} onChange={e => setLessonForm(p=>({...p,title:e.target.value}))} placeholder="Dars nomi..." />
            </FormGroup>
            <FormGroup label="Tavsif">
              <Textarea value={lessonForm.description} onChange={e => setLessonForm(p=>({...p,description:e.target.value}))} placeholder="Dars haqida qisqacha..." />
            </FormGroup>
            <FormGroup label="YouTube havolasi" hint="youtube.com/watch?v=... yoki youtu.be/...">
              <Input value={lessonForm.videoUrl} onChange={e => setLessonForm(p=>({...p,videoUrl:e.target.value}))} placeholder="https://youtube.com/watch?v=..." />
            </FormGroup>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <FormGroup label="Davomiyligi">
                <Input value={lessonForm.duration} onChange={e => setLessonForm(p=>({...p,duration:e.target.value}))} placeholder="10 min" />
              </FormGroup>
              <FormGroup label="Tartib raqami">
                <Input type="number" min="1" value={lessonForm.order} onChange={e => setLessonForm(p=>({...p,order:e.target.value}))} />
              </FormGroup>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <input type="checkbox" id="isFree" checked={lessonForm.isFree} onChange={e => setLessonForm(p=>({...p,isFree:e.target.checked}))} style={{ width:16, height:16 }} />
              <label htmlFor="isFree" style={{ fontSize:'0.875rem', color:'var(--text2)', cursor:'pointer' }}>Bepul dars (ro'yxatdan o'tmagan talabalar ham ko'ra olsin)</label>
            </div>
            <Btn type="submit" full disabled={submitting}>{submitting ? 'Qo\'shilmoqda...' : '+ Dars Qo\'shish'}</Btn>
          </form>
        </Modal>
      )}
    </div>
  );
}
