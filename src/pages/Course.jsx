import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Card, Badge, Divider } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";

/**
 * Minimal API helper (token bo'lsa Authorization yuboradi)
 */
async function apiFetch(path, { method = "GET", body, token } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // server xato matnini ko'rsatish
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  // 204 No Content bo'lishi mumkin
  if (res.status === 204) return null;
  return res.json();
}

export default function Course() {
  const { courseId } = useParams();
  const nav = useNavigate();
  const loc = useLocation();

  // useAuth ichida real auth bo'ladi:
  // user: { id, name, email }, token (agar ishlatsang), appState optional
  const { user, token, appState, setAppState } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [error, setError] = useState("");

  // local state: enrolledni DBdan qaytarish eng yaxshi.
  // Hozircha appState bo'lsa undan foydalanamiz; bo'lmasa course.enrolled flag.
  const enrolled = useMemo(() => {
    const fromLocal = Boolean(appState?.enrollments?.[courseId]);
    const fromServer = Boolean(course?.enrolled);
    return fromLocal || fromServer;
  }, [appState, courseId, course]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [c, ls] = await Promise.all([
        apiFetch(`/api/courses/${encodeURIComponent(courseId)}`, { token }),
        apiFetch(`/api/courses/${encodeURIComponent(courseId)}/lessons`, { token }),
      ]);
      setCourse(c);
      setLessons(Array.isArray(ls) ? ls : []);
    } catch (e) {
      setError(e?.message || "Xatolik yuz berdi");
      setCourse(null);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const onEnroll = async () => {
    // login bo'lmasa - qaytish URL bilan login
    if (!user) {
      const next = encodeURIComponent(loc.pathname);
      nav(`/login?next=${next}`);
      return;
    }

    setEnrollLoading(true);
    setError("");
    try {
      // serverga enroll yozish
      await apiFetch("/api/enrollments", {
        method: "POST",
        body: { courseId },
        token,
      });

      // agar sen hali local appState bilan ishlayotgan bo'lsang — UI tez yangilansin:
      if (setAppState) {
        setAppState((s) => {
          const prev = s?.enrollments || {};
          return { ...s, enrollments: { ...prev, [courseId]: { status: "active", startedAt: Date.now() } } };
        });
      }

      nav(`/learn/${courseId}`);
    } catch (e) {
      setError(e?.message || "Enroll bo‘lib bo‘lmadi");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid2">
        <Card>
          <div className="muted">Yuklanmoqda…</div>
        </Card>
        <Card>
          <div className="muted">Yuklanmoqda…</div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid2">
        <Card>
          <div className="h3">Xatolik</div>
          <div className="muted mt10">{error}</div>
          <div className="row gap10 mt16 wrap">
            <Link className="btn btnGhost" to="/academy">
              Orqaga
            </Link>
            <button className="btn" onClick={fetchAll}>
              Qayta urinish
            </button>
          </div>
        </Card>
        <Card>
          <div className="muted">Agar muammo davom etsa, admin bilan bog‘laning.</div>
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <Card>
        <div className="muted">Kurs topilmadi.</div>
        <div className="mt14">
          <Link className="btn btnGhost" to="/academy">
            Orqaga
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid2">
      <Card>
        <div className="row gap10">
          <div className="emoji">{course.coverEmoji || "📘"}</div>
          <div>
            <h1 className="h2">{course.title}</h1>
            <div className="muted">{course.description}</div>
          </div>
        </div>

        <div className="row gap8 wrap mt12">
          <Badge variant="info">{course.durationType === "weekly" ? "Haftalik" : "Oylik"}</Badge>
          {course.level ? <Badge variant="default">{course.level}</Badge> : null}
          {Number(course.price || 0) === 0 ? (
            <Badge variant="success">Bepul</Badge>
          ) : (
            <Badge variant="warning">{course.price} so‘m</Badge>
          )}
        </div>

        <Divider />

        <div className="muted">Darslar: {lessons.length} ta</div>

        {lessons.length === 0 ? (
          <div className="empty mt12">
            <div className="emptyTitle">Darslar hali qo‘shilmagan</div>
            <div className="muted">Admin paneldan darslarni qo‘shing.</div>
          </div>
        ) : (
          <ul className="list mt10">
            {lessons.map((l) => (
              <li key={l.id}>
                <b>{l.title}</b>
                {l.durationMin ? <span className="muted"> — {l.durationMin} min</span> : null}
              </li>
            ))}
          </ul>
        )}

        <div className="row gap10 mt16 wrap">
          <Link className="btn btnGhost" to="/academy">
            Orqaga
          </Link>

          {enrolled ? (
            <Link className="btn" to={`/learn/${courseId}`}>
              O‘qishni ochish
            </Link>
          ) : (
            <button className="btn" onClick={onEnroll} disabled={enrollLoading}>
              {enrollLoading ? "Enroll…" : "Enroll + Start"}
            </button>
          )}

          {!user ? (
            <span className="muted">
              Enroll uchun kirish kerak.
            </span>
          ) : null}
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

        <Divider />

        <div className="muted">
          <b>Verify:</b> Sertifikat raqami bilan tekshirish sahifasi mavjud.
        </div>
        <div className="row gap10 mt12 wrap">
          <Link className="btn btnGhost" to="/verify">
            Verify sahifasi
          </Link>
          <span className="mono">/verify/&lt;CERT_NO&gt;</span>
        </div>

        <div className="muted mt12">
          Keyingi bosqich: PDF sertifikatni hash/signature bilan imzolash va admin tomonidan revoke qilish.
        </div>
      </Card>
    </div>
  );
}
