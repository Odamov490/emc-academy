import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, getLessons } from '../lib/demoData.js';
import { Card, ProgressBar, Badge, Divider } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { markLessonDone, getCourseCompletion, isLessonDone } from '../lib/state.js';

export default function Learn() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const lessons = getLessons(courseId);
  const { appState, setAppState } = useAuth();
  const nav = useNavigate();
  const [active, setActive] = useState(lessons[0]?.id || null);

  const activeLesson = useMemo(() => lessons.find((l) => l.id === active) || lessons[0], [lessons, active]);
  const completion = getCourseCompletion(appState, courseId, lessons);

  if (!course) return <div className="muted">Kurs topilmadi.</div>;

  const done = (lessonId) => isLessonDone(appState, courseId, lessonId);

  const markDone = () => {
    if (!activeLesson) return;
    setAppState((s) => markLessonDone(s, courseId, activeLesson.id));
  };

  const allDone = completion.percent === 100;

  return (
    <div className="gridLearn">
      <Card className="sidebar">
        <div className="row between">
          <div>
            <div className="muted">Kurs</div>
            <div className="h3">{course.title}</div>
          </div>
          <Badge variant={allDone ? 'success' : 'info'}>{completion.percent}%</Badge>
        </div>
        <ProgressBar value={completion.percent} />

        <Divider />

        <div className="muted">Darslar</div>
        <div className="lessonList mt8">
          {lessons.map((l) => {
            const activeCls = l.id === active ? 'lessonItem active' : 'lessonItem';
            return (
              <button key={l.id} className={activeCls} onClick={() => setActive(l.id)}>
                <span className="lessonDot">{done(l.id) ? '✅' : '⬜️'}</span>
                <span className="lessonName">{l.title}</span>
              </button>
            );
          })}
        </div>

        <Divider />

        <div className="row gap10 wrap">
          <Link className="btn btnGhost" to={`/course/${courseId}`}>Batafsil</Link>
          <Link className="btn btnGhost" to="/academy">Kurslar</Link>
        </div>

        {allDone ? (
          <button className="btn mt12" onClick={() => nav(`/quiz/${courseId}`)}>Quizga o‘tish</button>
        ) : (
          <div className="muted mt12">Quiz ochilishi uchun darslar 100% bo‘lsin.</div>
        )}
      </Card>

      <Card>
        <div className="row between wrap gap10">
          <div>
            <div className="muted">Dars</div>
            <h1 className="h2">{activeLesson?.title}</h1>
          </div>
          <button className="btn" onClick={markDone} disabled={done(activeLesson?.id)}>
            {done(activeLesson?.id) ? 'Tugallangan ✅' : 'Darsni tugatdim'}
          </button>
        </div>
        <Divider />
        <div className="content">
          {activeLesson?.content}
        </div>
      </Card>
    </div>
  );
}
