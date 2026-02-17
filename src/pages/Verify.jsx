import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Divider } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { findCertificate } from '../lib/state.js';

export default function Verify() {
  const { certNo } = useParams();
  const { appState } = useAuth();
  const cert = useMemo(() => findCertificate(appState, certNo), [appState, certNo]);
  const [input, setInput] = useState(certNo || '');
  const nav = useNavigate();

  const status = cert ? 'VALID' : 'INVALID';

  return (
    <div className="center">
      <Card className="max720">
        <div className="row between wrap gap10">
          <div>
            <h1 className="h2">Sertifikat tekshirish</h1>
            <div className="muted">certNo bo‘yicha tekshiradi (demo: localStorage).</div>
          </div>
          <Badge variant={cert ? 'success' : 'warning'}>{status}</Badge>
        </div>

        <Divider />

        <div className="row gap10 wrap">
          <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="EMC-2026-000001" />
          <button className="btn" onClick={() => nav(`/verify/${encodeURIComponent(input.trim())}`)} disabled={!input.trim()}>
            Tekshirish
          </button>
        </div>

        <Divider />

        {cert ? (
          <div className="kv">
            <div className="kvRow"><div className="muted">Certificate No</div><div><b>{cert.certNo}</b></div></div>
            <div className="kvRow"><div className="muted">Ism</div><div>{cert.userName}</div></div>
            <div className="kvRow"><div className="muted">Email</div><div>{cert.userEmail}</div></div>
            <div className="kvRow"><div className="muted">Kurs</div><div>{cert.courseTitle}</div></div>
            <div className="kvRow"><div className="muted">Issued</div><div>{new Date(cert.issuedAt).toLocaleString()}</div></div>
            <div className="kvRow"><div className="muted">Hash</div><div className="mono">{cert.hash}</div></div>
          </div>
        ) : (
          <div className="muted">
            Bu certNo bazada topilmadi. Demo bo‘lgani uchun boshqa brauzerda yoki tozalanganda yo‘qolishi mumkin.
          </div>
        )}

        <div className="row gap10 mt16 wrap">
          <Link className="btn btnGhost" to="/academy">Kurslar</Link>
          <Link className="btn btnGhost" to="/login">Kirish</Link>
        </div>
      </Card>
    </div>
  );
}
