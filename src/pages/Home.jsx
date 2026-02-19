import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../components/ui.jsx";

function Icon({ children }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 40,
        height: 40,
        display: "grid",
        placeItems: "center",
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      }}
    >
      <span style={{ fontSize: 18 }}>{children}</span>
    </span>
  );
}

function MiniStat({ label, value, hint }) {
  return (
    <div className="homeStat">
      <div className="homeStatValue">{value}</div>
      <div className="homeStatLabel">{label}</div>
      {hint ? <div className="homeStatHint">{hint}</div> : null}
    </div>
  );
}

function Feature({ icon, title, desc, badge }) {
  return (
    <div className="homeFeature">
      <div className="row gap12" style={{ alignItems: "flex-start" }}>
        <Icon>{icon}</Icon>
        <div style={{ minWidth: 0 }}>
          <div className="row gap8 wrap" style={{ alignItems: "center" }}>
            <div className="homeFeatureTitle">{title}</div>
            {badge ? <Badge variant="info">{badge}</Badge> : null}
          </div>
          <div className="homeFeatureDesc">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function Step({ idx, title, desc }) {
  return (
    <div className="homeStep">
      <div className="homeStepIdx">{idx}</div>
      <div style={{ minWidth: 0 }}>
        <div className="homeStepTitle">{title}</div>
        <div className="homeStepDesc">{desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  return (
    <div className="homeFaqItem">
      <div className="homeFaqQ">{q}</div>
      <div className="homeFaqA">{a}</div>
    </div>
  );
}

export default function Home() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="homeWrap">
      {/* Inline premium styles (faqat Home sahifaga ta’sir qiladi) */}
      <style>{`
        .homeWrap{
          position: relative;
          padding: 18px 0 28px;
        }
        .homeBg{
          position:absolute; inset:-20px 0 auto 0; height: 520px;
          pointer-events:none;
          background:
            radial-gradient(900px 340px at 15% 15%, rgba(120,119,198,0.25), transparent 60%),
            radial-gradient(700px 320px at 75% 10%, rgba(56,189,248,0.20), transparent 60%),
            radial-gradient(800px 360px at 60% 70%, rgba(34,197,94,0.14), transparent 62%);
          filter: blur(0px);
        }
        .homeContainer{
          width: min(1180px, calc(100% - 24px));
          margin: 0 auto;
        }
        .homeGrid{
          display: grid;
          grid-template-columns: 1.35fr 0.65fr;
          gap: 14px;
          align-items: stretch;
        }
        @media (max-width: 980px){
          .homeGrid{ grid-template-columns: 1fr; }
        }

        .homeHero{
          position: relative;
          overflow: hidden;
          padding: 22px;
        }
        .homeHero::before{
          content:"";
          position:absolute; inset:0;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03)),
            radial-gradient(420px 220px at 12% 20%, rgba(56,189,248,0.16), transparent 70%),
            radial-gradient(480px 220px at 70% 30%, rgba(34,197,94,0.12), transparent 70%);
          pointer-events:none;
        }
        .homeHeroInner{
          position: relative;
          display:flex;
          flex-direction: column;
          gap: 14px;
        }
        .homeKicker{
          display:flex; gap:10px; align-items:center; flex-wrap:wrap;
        }
        .homeLogoDot{
          width:10px; height:10px; border-radius:999px;
          background: linear-gradient(90deg, rgba(56,189,248,0.95), rgba(34,197,94,0.95));
          box-shadow: 0 0 0 4px rgba(56,189,248,0.12);
        }
        .homeTitle{
          font-size: 34px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }
        @media (max-width: 520px){
          .homeTitle{ font-size: 28px; }
        }
        .homeSubtitle{
          color: rgba(255,255,255,0.78);
          font-size: 14.8px;
          line-height: 1.6;
          margin: 0;
          max-width: 62ch;
        }
        .homeBadges{
          display:flex; gap:8px; flex-wrap:wrap;
        }
        .homeActions{
          display:flex; gap:10px; flex-wrap:wrap; margin-top: 2px;
        }
        .homeBtnPrimary{
          display:inline-flex; align-items:center; gap:10px;
          padding: 10px 14px;
          border-radius: 14px;
          text-decoration:none;
          font-weight: 700;
          background: linear-gradient(90deg, rgba(56,189,248,0.92), rgba(34,197,94,0.92));
          color: rgba(8,10,12,0.95);
          box-shadow: 0 18px 40px rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.12);
          transform: translateY(0);
          transition: transform .15s ease, filter .15s ease;
        }
        .homeBtnPrimary:hover{ transform: translateY(-1px); filter: brightness(1.02); }
        .homeBtnGhost{
          display:inline-flex; align-items:center; gap:10px;
          padding: 10px 14px;
          border-radius: 14px;
          text-decoration:none;
          font-weight: 700;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.92);
          box-shadow: 0 18px 40px rgba(0,0,0,0.18);
          transition: transform .15s ease, background .15s ease;
        }
        .homeBtnGhost:hover{ transform: translateY(-1px); background: rgba(255,255,255,0.08); }
        .homeTinyNote{
          color: rgba(255,255,255,0.65);
          font-size: 12.5px;
          margin-top: 8px;
        }

        .homeSide{
          padding: 18px;
        }
        .homeSideTitle{
          margin: 0 0 8px;
          font-size: 16px;
          letter-spacing:-0.01em;
        }
        .homeSideText{
          color: rgba(255,255,255,0.72);
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0 0 10px;
        }
        .homeStats{
          display:grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 10px;
        }
        .homeStat{
          padding: 12px 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .homeStatValue{
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .homeStatLabel{
          margin-top: 2px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.72);
        }
        .homeStatHint{
          margin-top: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.60);
        }

        .homeSection{
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: stretch;
        }
        @media (max-width: 980px){
          .homeSection{ grid-template-columns: 1fr; }
        }

        .homeBlock{
          padding: 18px;
        }
        .homeBlockTitle{
          margin: 0 0 10px;
          font-size: 18px;
          letter-spacing:-0.01em;
        }

        .homeFeatures{
          display:grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .homeFeature{
          padding: 12px 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .homeFeatureTitle{
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .homeFeatureDesc{
          margin-top: 4px;
          color: rgba(255,255,255,0.70);
          font-size: 13.2px;
          line-height: 1.55;
        }

        .homeSteps{
          display:grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .homeStep{
          display:flex;
          gap: 12px;
          align-items:flex-start;
          padding: 12px 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .homeStepIdx{
          width: 34px; height: 34px;
          border-radius: 14px;
          display:grid; place-items:center;
          font-weight: 900;
          color: rgba(8,10,12,0.92);
          background: linear-gradient(90deg, rgba(56,189,248,0.92), rgba(34,197,94,0.92));
          border: 1px solid rgba(255,255,255,0.10);
          flex: 0 0 auto;
        }
        .homeStepTitle{
          font-weight: 800;
          margin-top: 1px;
          letter-spacing: -0.01em;
        }
        .homeStepDesc{
          margin-top: 4px;
          color: rgba(255,255,255,0.70);
          font-size: 13.2px;
          line-height: 1.55;
        }

        .homeCta{
          margin-top: 14px;
          padding: 18px;
          overflow:hidden;
          position: relative;
        }
        .homeCta::before{
          content:"";
          position:absolute; inset:0;
          background:
            radial-gradient(540px 240px at 20% 50%, rgba(56,189,248,0.18), transparent 70%),
            radial-gradient(540px 240px at 80% 50%, rgba(34,197,94,0.14), transparent 70%),
            linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
          pointer-events:none;
        }
        .homeCtaInner{ position: relative; display:flex; gap: 12px; align-items:center; justify-content: space-between; flex-wrap:wrap; }
        .homeCtaTitle{ margin:0; font-size: 18px; font-weight: 900; letter-spacing:-0.01em; }
        .homeCtaText{ margin:4px 0 0; color: rgba(255,255,255,0.72); font-size: 13.2px; line-height: 1.5; max-width: 70ch; }
        .homeFooterNote{
          margin-top: 10px;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
        }

        .homeFaq{
          margin-top: 14px;
          padding: 18px;
        }
        .homeFaqGrid{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 980px){
          .homeFaqGrid{ grid-template-columns: 1fr; }
        }
        .homeFaqItem{
          padding: 12px 12px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .homeFaqQ{
          font-weight: 850;
          letter-spacing:-0.01em;
        }
        .homeFaqA{
          margin-top: 6px;
          color: rgba(255,255,255,0.70);
          font-size: 13.2px;
          line-height: 1.55;
        }
      `}</style>

      <div className="homeBg" />
      <div className="homeContainer">
        {/* TOP GRID: HERO + SIDE */}
        <div className="homeGrid">
          <Card className="homeHero">
            <div className="homeHeroInner">
              <div className="homeKicker">
                <span className="homeLogoDot" />
                <Badge variant="success">EMC Academy • Demo</Badge>
                <Badge variant="warning">Quiz ≥ 70%</Badge>
                <Badge variant="info">QR Verify</Badge>
              </div>

              <h1 className="homeTitle">
                Kurs + Quiz + PDF Sertifikat — bitta platformada
              </h1>

              <p className="homeSubtitle">
                EMC Academy — o‘quv kurslarini boshqarish, testdan o‘tganlarni
                avtomatik sertifikatlash va QR orqali tekshirish (verify) uchun
                mo‘ljallangan zamonaviy platforma. Keyin buni emclab sayting bilan
                to‘liq integratsiya qilamiz.
              </p>

              <div className="homeBadges">
                <Badge variant="success">Auto certificate</Badge>
                <Badge variant="info">PDF + QR code</Badge>
                <Badge variant="warning">Verify link</Badge>
                <Badge variant="info">Admin panel</Badge>
              </div>

              <div className="homeActions">
                <Link className="homeBtnPrimary" to="/academy">
                  Kurslarni ko‘rish <span aria-hidden="true">→</span>
                </Link>
                <Link className="homeBtnGhost" to="/login">
                  Kirish / Ro‘yxatdan o‘tish
                </Link>
                <Link className="homeBtnGhost" to="/verify">
                  Sertifikatni tekshirish
                </Link>
              </div>

              <div className="homeTinyNote">
                🔒 Demo rejim: hozircha ma’lumotlar test uchun. Keyin Firestore +
                real login bilan to‘liq ish rejimiga o‘tkazamiz.
              </div>
            </div>
          </Card>

          <Card className="homeSide">
            <h2 className="homeSideTitle">Tez start (MVP)</h2>
            <p className="homeSideText">
              Platforma mantig‘i oddiy: enroll → progress 100% → quiz → sertifikat.
              Admin kurs qo‘shadi, test savollarini boshqaradi, sertifikat dizaynini
              o‘zgartiradi.
            </p>

            <div className="homeStats">
              <MiniStat
                value="≥ 70%"
                label="Passing score"
                hint="Quizdan o‘tish uchun minimal ball"
              />
              <MiniStat
                value="PDF"
                label="Sertifikat"
                hint="QR + Verify link bilan"
              />
              <MiniStat
                value="Firestore"
                label="Ma’lumotlar bazasi"
                hint="Online, keyin role-based access"
              />
            </div>

            <div className="homeFooterNote">
              Demo login: <b>admin@emc.uz</b> (admin), user: istalgan email.
            </div>
          </Card>
        </div>

        {/* SECOND ROW */}
        <div className="homeSection">
          <Card className="homeBlock">
            <h2 className="homeBlockTitle">Nimalar bor?</h2>
            <div className="homeFeatures">
              <Feature
                icon="🧠"
                title="Kurslar struktura (modul/dars)"
                badge="Flexible"
                desc="Kurs ichida bo‘limlar va darslar, progress tracking va 100% shart."
              />
              <Feature
                icon="✅"
                title="Quiz va natija"
                badge="Grading"
                desc="Passing score (≥70%), urinishlar soni va natijani saqlash."
              />
              <Feature
                icon="🧾"
                title="PDF sertifikat generator"
                badge="Premium"
                desc="Ism, kurs, sana, davomiylik, tashkilot, imzo va QR verify link."
              />
              <Feature
                icon="🔎"
                title="Verify sahifa"
                badge="Public"
                desc="QR orqali sertifikat ID topiladi va status (valid/invalid) ko‘rsatiladi."
              />
            </div>
          </Card>

          <Card className="homeBlock">
            <h2 className="homeBlockTitle">Qanday ishlaydi?</h2>
            <div className="homeSteps">
              <Step
                idx="1"
                title="Ro‘yxatdan o‘tish / Kirish"
                desc="Email yoki keyin Google Sign-In (tezkor) qo‘shamiz."
              />
              <Step
                idx="2"
                title="Kursga enroll"
                desc="Kurs sahifasida enroll bosiladi va progress 0% dan boshlanadi."
              />
              <Step
                idx="3"
                title="Darslarni tugatish (100%)"
                desc="Video/tekst darslar. Tugatildi belgisi bilan progress to‘liq bo‘ladi."
              />
              <Step
                idx="4"
                title="Quizdan o‘tish (≥70%)"
                desc="Savollarga javob beriladi, ball hisoblanadi, natija saqlanadi."
              />
              <Step
                idx="5"
                title="Sertifikat avtomatik"
                desc="Shablon bo‘yicha PDF generatsiya, QR verify link bilan."
              />
            </div>
          </Card>
        </div>

        {/* CTA */}
        <Card className="homeCta">
          <div className="homeCtaInner">
            <div>
              <h3 className="homeCtaTitle">Boshlaymizmi?</h3>
              <p className="homeCtaText">
                Kurslar ro‘yxatini ko‘rib chiq, enroll qil va demo quizdan o‘tib
                sertifikat generatsiyasini sinab ko‘r. Keyin biz Google login, role
                (admin/user), payment va real kurs kontentini qo‘shamiz.
              </p>
            </div>

            <div className="row gap10 wrap">
              <Link className="homeBtnPrimary" to="/academy">
                Kurslar <span aria-hidden="true">→</span>
              </Link>
              <Link className="homeBtnGhost" to="/admin">
                Admin panel
              </Link>
            </div>
          </div>
        </Card>

        {/* FAQ */}
        <Card className="homeFaq">
          <h2 className="homeBlockTitle">Ko‘p so‘raladigan savollar</h2>
          <div className="homeFaqGrid">
            <FaqItem
              q="Sertifikatni kim beradi?"
              a="Hozir demo. Real rejimda sertifikatda tashkilot (EMCLAB/EMC Academy), direktor va o‘qituvchi ma’lumotlari Firestore’dan keladi."
            />
            <FaqItem
              q="QR verify qanday ishlaydi?"
              a="PDF ichidagi QR verify sahifaga olib boradi. U yerda sertifikat ID bo‘yicha status (valid/invalid) ko‘rsatiladi."
            />
            <FaqItem
              q="Google bilan tezkor login bo‘ladimi?"
              a="Ha. Firebase Auth orqali Google Sign-In qo‘shamiz. Hozircha email/login demo."
            />
            <FaqItem
              q="Keyingi bosqich nima?"
              a="Role-based access (admin/user), kurs kontenti CMS, quiz builder, sertifikat shablon editor va payment (Payme/Click) integratsiya."
            />
          </div>

          <div className="homeFooterNote">© {year} EMC Academy • Demo platforma</div>
        </Card>
      </div>
    </div>
  );
}
