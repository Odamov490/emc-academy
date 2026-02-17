import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge, Divider, EmptyState } from '../components/ui.jsx';
import { useAuth } from '../lib/auth.jsx';
import { findCertificate } from '../lib/state.js';
import { createCertificatePdfBytes, downloadBytes } from '../lib/pdf.js';

export default function Certificate() {
  const { certNo } = useParams();
  const { appState } = useAuth();
  const cert = useMemo(() => findCertificate(appState, certNo), [appState, certNo]);
  const [busy, setBusy] = useState(false);

  const baseUrl = window.location.origin;
  const verifyUrl = `${baseUrl}/verify/${certNo}`;

  const download = async () => {
    if (!cert) return;
    setBusy(true);
    try {
      const bytes = await createCertificatePdfBytes({
        name: cert.userName,
        courseTitle: cert.courseTitle,
        certNo: cert.certNo,
        issuedAt: cert.issuedAt,
        verifyUrl,
        hash: cert.hash
      });
      downloadBytes(bytes, `${cert.certNo}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  if (!cert) {
    return (
      <EmptyState
        title="Sertifikat topilmadi"
        desc="Bu certNo localStorage bazada yo‘q. Verify sahifada tekshirib ko‘ring yoki avval kurs/quizdan o‘ting."
        action={<Link className="btn" to="/academy">Kurslarga o‘tish</Link>}
      />
    );
  }

  return (
    <div className="grid2">
      <Card>
        <div className="row between wrap gap10">
          <div>
            <h1 className="h2">Sertifikat tayyor ✅</h1>
            <div className="muted">PDF + QR verify link.</div>
          </div>
          <Badge variant="success">{cert.certNo}</Badge>
        </div>

        <Divider />

        <div className="kv">
          <div className="kvRow"><div className="muted">Ism</div><div><b>{cert.userName}</b></div></div>
          <div className="kvRow"><div className="muted">Kurs</div><div>{cert.courseTitle}</div></div>
          <div className="kvRow"><div className="muted">Issued</div><div>{new Date(cert.issuedAt).toLocaleString()}</div></div>
          <div className="kvRow"><div className="muted">Verify</div><div className="mono">{verifyUrl}</div></div>
          <div className="kvRow"><div className="muted">Hash</div><div className="mono">{cert.hash}</div></div>
        </div>

        <div className="row gap10 mt16 wrap">
          <button className="btn" onClick={download} disabled={busy}>{busy ? 'PDF tayyorlanmoqda…' : 'PDF yuklab olish'}</button>
          <Link className="btn btnGhost" to={`/verify/${cert.certNo}`}>Verify sahifa</Link>
          <Link className="btn btnGhost" to="/profile">Mening sertifikatlar</Link>
        </div>
      </Card>

      <Card>
        <h2 className="h3">Keyingi qadam (emclabga ulash)</h2>
        <ol className="list">
          <li>DB (Postgres/Supabase) ga ko‘chiramiz</li>
          <li>Admin kurs yaratish paneli</li>
          <li>To‘lov (Payme/Click) + enrol avtomatik</li>
          <li>PDF serverda generate + digital signature</li>
        </ol>
      </Card>
    </div>
  );
}
