import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, getLessons } from '../lib/demoData.js';
import { Card, Badge, Divider } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { enroll } from '../lib/state.js';

export default function Course() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const lessons = getLessons(courseId);
  const { user, appState, setAppState } = useAuth();
  const nav = useNavigate();

  if (!course) return <div className="muted">Kurs topilmadi.</div>;

  const enrolled = Boolean(appState.enrollments[courseId]);

  const onEnroll = () => {
    setAppState((s) => enroll(s, courseId));
    nav(`/learn/${courseId}`);
  };

  return (
    <div className="grid2">
      <Card>
        <div className="row gap10">
          <div className="emoji">{course.coverEmoji}</div>
          <div>
            <h1 className="h2">{course.title}</h1>
            <div className="muted">{course.description}</div>
          </div>
        </div>

        <div className="row gap8 wrap mt12">
          <Badge variant="info">{course.durationType === 'weekly' ? 'Haftalik' : 'Oylik'}</Badge>
          <Badge variant="default">{course.level}</Badge>
          {course.price === 0 ? <Badge variant="success">Bepul</Badge> : <Badge variant="warning">Pullik</Badge>}
        </div>

        <Divider />

        <div className="muted">Darslar: {lessons.length} ta</div>
        <ul className="list mt10">
          {lessons.map((l) => (
            <li key={l.id}>
              <b>{l.title}</b>
            </li>
          ))}
        </ul>

        <div className="row gap10 mt16 wrap">
          <Link className="btn btnGhost" to="/academy">Orqaga</Link>
          {user ? (
            enrolled ? (
              <Link className="btn" to={`/learn/${courseId}`}>O‘qishni ochish</Link>
            ) : (
              <button className="btn" onClick={onEnroll}>Enroll + Start</button>
            )
          ) : (
            <Link className="btn" to="/login">Enroll uchun kirish</Link>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="h3">Sertifikat olish shartlari</h2>
        <ol className="list">
          <li>Kursga enroll bo‘lish</li>
          <li>Barcha darslarni 100% tugatish</li>
          <li>Quizdan kamida 70% olish</li>
          <li>Sertifikat avtomatik beriladi (QR bilan)</li>
        </ol>
        <div className="muted mt12">
          Eslatma: bu demo. Keyin haqiqiy DB va imzolash (hash/signature) qo‘shamiz.
        </div>
      </Card>
    </div>
  );
}
