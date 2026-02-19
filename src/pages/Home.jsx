import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../components/ui.jsx';

export default function Home() {
  return (
    <div className="grid2">
      <Card>
        <h1 className="h1">EMC Academy — platformasi</h1>
        <p className="muted">
          Bu demo platforma: haftalik/oylik kurslar, quiz, va QR-li sertifikat PDF.
          Keyin buni emclab sayting bilan birlashtiramiz.
        </p>
        <div className="row gap8 wrap">
          <Badge variant="success">Quiz + Passing score</Badge>
          <Badge variant="info">PDF Certificate</Badge>
          <Badge variant="warning">QR Verify Link</Badge>
        </div>
        <div className="mt16 row gap10">
          <Link className="btn" to="/academy">Kurslarni ko‘rish</Link>
          <Link className="btn btnGhost" to="/login">Kirish</Link>
        </div>
      </Card>

      <Card>
        <h2 className="h2">MVP qanday ishlaydi?</h2>
        <ol className="list">
          <li>Kursga enroll bo‘lasan</li>
          <li>Darslarni tugatasan (100%)</li>
          <li>Quizdan o‘tasan (≥70%)</li>
          <li>Sertifikat avtomatik yaratiladi</li>
          <li>Verify sahifada tekshiriladi</li>
        </ol>
        <div className="mt12 muted">
          Admin uchun demo kirish: <b>admin@emc.uz</b> (ixtiyoriy), oddiy user: istalgan email.
        </div>
      </Card>
    </div>
  );
}
