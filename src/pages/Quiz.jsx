import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse, getLessons, getQuestions } from '../lib/demoData.js';
import { Card, Badge, Divider } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { getCourseCompletion, saveQuizAttempt, canIssueCertificate, issueCertificate } from '../lib/state.js';
import { generateCertNo, generateHash } from '../lib/cert.js';

const PASS = 70;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const { courseId } = useParams();
  const course = getCourse(courseId);
  const lessons = getLessons(courseId);
  const questions = getQuestions(courseId);

  const { user, appState, setAppState } = useAuth();
  const nav = useNavigate();

  const completion = getCourseCompletion(appState, courseId, lessons);
  const locked = completion.percent !== 100;

  const qset = useMemo(() => shuffle(questions), [courseId]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }, [courseId]);

  if (!course) return <div className="muted">Kurs topilmadi.</div>;

  const onPick = (qid, idx) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [qid]: idx }));
  };

  const onSubmit = () => {
    if (locked) return;
    const total = qset.length;
    let correct = 0;
    for (const q of qset) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const sc = Math.round((correct / total) * 100);
    const passed = sc >= PASS;

    const attempt = {
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      score: sc,
      passed,
      total,
      correct
    };

    setAppState((s) => saveQuizAttempt(s, courseId, attempt));
    setSubmitted(true);
    setScore(sc);

    // Auto-issue certificate if eligible
    setTimeout(() => {
      setAppState((s0) => {
        const ok = canIssueCertificate(s0, courseId, lessons, PASS);
        if (!ok) return s0;
        const certNo = generateCertNo();
        const issuedAt = new Date().toISOString();
        const hash = generateHash();
        const cert = {
          certNo,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          courseId,
          courseTitle: course.title,
          issuedAt,
          hash
        };
        const s1 = issueCertificate(s0, courseId, cert);
        // redirect to cert page
        queueMicrotask(() => nav(`/certificate/${certNo}`));
        return s1;
      });
    }, 300);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="grid2">
      <Card>
        <div className="row between wrap gap10">
          <div>
            <h1 className="h2">Quiz: {course.title}</h1>
            <div className="muted">Passing score: {PASS}%</div>
          </div>
          <div className="row gap8 wrap">
            <Badge variant={locked ? 'warning' : 'success'}>
              {locked ? `Locked (${completion.percent}%)` : 'Unlocked'}
            </Badge>
            {submitted ? (
              <Badge variant={score >= PASS ? 'success' : 'warning'}>
                Score: {score}%
              </Badge>
            ) : null}
          </div>
        </div>

        <Divider />

        {locked ? (
          <div className="muted">
            Quiz ochilishi uchun darslar 100% bo‘lishi kerak. <Link to={`/learn/${courseId}`}>Darslarga qaytish</Link>
          </div>
        ) : (
          <div className="muted">Savollar: {qset.length} ta. Javob bergan: {answeredCount}/{qset.length}</div>
        )}

        <div className="mt14">
          {qset.map((q, idx) => (
            <div key={q.id} className="qBlock">
              <div className="qTitle">
                {idx + 1}. {q.question}
              </div>
              <div className="qOptions">
                {q.options.map((opt, oi) => {
                  const picked = answers[q.id] === oi;
                  const correct = submitted && q.correctIndex === oi;
                  const wrong = submitted && picked && q.correctIndex !== oi;
                  return (
                    <button
                      key={oi}
                      className={`qOpt ${picked ? 'picked' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
                      onClick={() => onPick(q.id, oi)}
                      disabled={locked || submitted}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="row gap10 mt16 wrap">
          <Link className="btn btnGhost" to={`/learn/${courseId}`}>Darslar</Link>
          <button className="btn" onClick={onSubmit} disabled={locked || submitted || answeredCount !== qset.length}>
            {submitted ? 'Yuborildi ✅' : 'Yakunlash'}
          </button>
        </div>

        {submitted && score < PASS ? (
          <div className="muted mt12">Passing bo‘lmadi. Qayta urinib ko‘rish uchun sahifani yangilang (demo).</div>
        ) : null}
      </Card>

      <Card>
        <h2 className="h3">Sertifikat qanday chiqadi?</h2>
        <ol className="list">
          <li>Quizdan o‘tding (≥{PASS}%)</li>
          <li>Sertifikat avtomatik yaratiladi</li>
          <li>QR verify link bilan tekshiriladi</li>
        </ol>
        <div className="muted mt12">
          Keyin bu yerni real DB + email yuborish + to‘lov bilan kuchaytiramiz.
        </div>
      </Card>
    </div>
  );
}
