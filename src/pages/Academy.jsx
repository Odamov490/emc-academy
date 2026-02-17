import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../lib/demoData.js';
import { Card, Badge, ProgressBar } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { enroll, getCourseCompletion } from '../lib/state.js';
import { getLessons } from '../lib/demoData.js';

export default function Academy() {
  const { user, appState, setAppState } = useAuth();

  return (
    <div>
      <div className="row between wrap gap10">
        <div>
          <h1 className="h1">Kurslar</h1>
          <div className="muted">Haftalik / oylik kurslar. Tugatsang — sertifikat.</div>
        </div>
        {user ? (
          <Link className="btn btnGhost" to="/profile">Mening kabinet</Link>
        ) : (
          <Link className="btn" to="/login">Kirish</Link>
        )}
      </div>

      <div className="gridCards mt16">
        {courses.map((c) => {
          const enrolled = Boolean(appState.enrollments[c.id]);
          const lessons = getLessons(c.id);
          const completion = getCourseCompletion(appState, c.id, lessons);

          return (
            <Card key={c.id} className="courseCard">
              <div className="row between">
                <div className="row gap10">
                  <div className="emoji">{c.coverEmoji}</div>
                  <div>
                    <div className="courseTitle">{c.title}</div>
                    <div className="muted">{c.description}</div>
                  </div>
                </div>
              </div>

              <div className="row gap8 wrap mt12">
                <Badge variant="info">{c.durationType === 'weekly' ? 'Haftalik' : 'Oylik'}</Badge>
                <Badge variant="default">{c.level}</Badge>
                {c.price === 0 ? <Badge variant="success">Bepul</Badge> : <Badge variant="warning">Pullik</Badge>}
                {enrolled ? <Badge variant="success">Enrolled</Badge> : <Badge variant="default">Not enrolled</Badge>}
              </div>

              {enrolled ? (
                <div className="mt12">
                  <div className="row between">
                    <div className="muted">Progress</div>
                    <div className="muted">{completion.percent}%</div>
                  </div>
                  <ProgressBar value={completion.percent} />
                </div>
              ) : null}

              <div className="row gap10 mt14 wrap">
                <Link className="btn btnGhost" to={`/course/${c.id}`}>Batafsil</Link>
                {user ? (
                  enrolled ? (
                    <Link className="btn" to={`/learn/${c.id}`}>O‘qishni davom ettirish</Link>
                  ) : (
                    <button
                      className="btn"
                      onClick={() => setAppState((s) => enroll(s, c.id))}
                    >
                      Enroll
                    </button>
                  )
                ) : (
                  <Link className="btn" to="/login">Enroll uchun kirish</Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
