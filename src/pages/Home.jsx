import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../components/ui.jsx";

export default function Home() {
  return (
    <div className="homeMinWrap">
      <div className="homeMinBg" />

      <div className="homeMinContainer">
        <Card className="homeMinCard">
          <div className="homeMinTop">
            <span className="homeMinDot" />
            <Badge variant="info">EMC Academy</Badge>
            <Badge variant="success">Sertifikat</Badge>
            <Badge variant="warning">QR Verify</Badge>
          </div>

          <h1 className="homeMinTitle">Kurs + Quiz + Sertifikat</h1>

          <p className="homeMinText">
            O‘qishni tugating, quizdan o‘ting va sertifikatingizni PDF ko‘rinishda oling.
            QR orqali tekshirish (verify) mavjud.
          </p>

          <div className="homeMinActions">
            <Link className="btn" to="/academy">
              Kurslarni ko‘rish <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btnGhost" to="/login">
              Kirish
            </Link>
          </div>

          <div className="homeMinHow">
            <div className="homeMinHowItem">
              <span className="homeMinChip">1</span> Enroll
            </div>
            <div className="homeMinHowLine" />
            <div className="homeMinHowItem">
              <span className="homeMinChip">2</span> Dars 100%
            </div>
            <div className="homeMinHowLine" />
            <div className="homeMinHowItem">
              <span className="homeMinChip">3</span> Quiz ≥ 70%
            </div>
            <div className="homeMinHowLine" />
            <div className="homeMinHowItem">
              <span className="homeMinChip">4</span> PDF Sertifikat
            </div>
          </div>

          <div className="homeMinNote">
            Sertifikatni tekshirish: <Link className="homeMinLink" to="/verify">Verify</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
