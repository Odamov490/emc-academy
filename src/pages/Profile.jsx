import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Divider, EmptyState } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { listCertificatesForUser } from '../lib/state.js';
import { courses } from '../lib/demoData.js';

export default function Profile() {
  const { user, appState } = useAuth();
  const certs = useMemo(() => listCertificatesForUser(appState, user.id), [appState, user.id]);

  const myEnrollments = courses
    .filter((c) => appState.enrollments[c.id])
    .map((c) => ({ course: c, enrollment: appState.enrollments[c.id] }));

  return (
    <div className="grid2">
      <Card>
        <h1 className="h2">Mening kabinet</h1>
        <div className="kv mt12">
          <div className="kvRow"><div className="muted">Ism</div><div><b>{user.name}</b></div></div>
          <div className="kvRow"><div className="muted">Email</div><div>{user.email}</div></div>
          <div className="kvRow"><div className="muted">Role</div><div>{user.isAdmin ? <Badge variant="info">Admin</Badge> : <Badge variant="default">User</Badge>}</div></div>
        </div>

        <Divider />

        <h2 className="h3">Enrolled kurslar</h2>
        {myEnrollments.length ? (
          <ul className="list">
            {myEnrollments.map(({ course }) => (
              <li key={course.id}>
                <Link to={`/learn/${course.id}`}>{course.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="muted">Hozircha enroll qilmagansiz.</div>
        )}

        <div className="mt12">
          <Link className="btn" to="/academy">Kurslarni ochish</Link>
        </div>
      </Card>

      <Card>
        <h2 className="h3">Sertifikatlar</h2>
        {certs.length ? (
          <div className="certList mt10">
            {certs.map((c) => (
              <div key={c.certNo} className="certRow">
                <div>
                  <div className="mono"><b>{c.certNo}</b></div>
                  <div className="muted">{c.courseTitle}</div>
                </div>
                <div className="row gap8 wrap">
                  <Link className="btn btnGhost" to={`/verify/${c.certNo}`}>Verify</Link>
                  <Link className="btn" to={`/certificate/${c.certNo}`}>Ochish</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="Sertifikat yo‘q" desc="Kursni tugatib, quizdan o‘tsangiz sertifikat chiqadi." />
        )}
      </Card>
    </div>
  );
}
