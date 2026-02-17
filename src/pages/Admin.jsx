import React from 'react';
import { Card, Divider, Badge } from '../components/ui.jsx';
import { courses, lessonsByCourse, questionsByCourse } from '../lib/demoData.js';
import { resetState } from '../lib/storage.js';

export default function Admin() {
  return (
    <div className="grid2">
      <Card>
        <h1 className="h2">Admin panel (Demo)</h1>
        <div className="muted">Hozircha kurslar va quizlar statik. Keyin DB orqali CRUD qilamiz.</div>

        <Divider />

        <div className="row gap8 wrap">
          <Badge variant="info">Kurslar: {courses.length}</Badge>
          <Badge variant="default">Darslar: {Object.values(lessonsByCourse).flat().length}</Badge>
          <Badge variant="default">Savollar: {Object.values(questionsByCourse).flat().length}</Badge>
        </div>

        <Divider />

        <button
          className="btn btnDanger"
          onClick={() => {
            if (confirm('Demo ma’lumotlarni tozalaysizmi? (localStorage reset)')) {
              resetState();
              location.reload();
            }
          }}
        >
          Reset demo data (localStorage)
        </button>

        <div className="muted mt12">
          Keyingi bosqich: Admin kurs yaratadi, dars qo‘shadi, quiz savol kiritadi, sertifikat shablonini tanlaydi.
        </div>
      </Card>

      <Card>
        <h2 className="h3">Integration (emclab saytinga ulash)</h2>
        <ol className="list">
          <li>Auth: Supabase / JWT</li>
          <li>DB: courses, lessons, questions, enrollments, attempts, certificates</li>
          <li>PDF: serverda generate + digital signature</li>
          <li>Verify: public endpoint (certNo → status)</li>
          <li>Payment: Payme/Click (enroll avtomatik)</li>
        </ol>
      </Card>
    </div>
  );
}
