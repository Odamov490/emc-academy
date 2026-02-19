import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../components/ui.jsx";

function Icon({ children }) {
  return (
    <span className="homeIcon" aria-hidden="true">
      <span className="homeIconInner">{children}</span>
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
      <div className="row gap12 homeRowTop">
        <Icon>{icon}</Icon>
        <div className="homeMin0">
          <div className="row gap8 wrap homeRowCenter">
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
      <div className="homeMin0">
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
      <div className="homeBg" />
      <div className="homeContainer">
        {/* TOP GRID */}
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
                mo‘ljallangan platforma. Keyin buni emclab sayting bilan to‘liq
                integratsiya qilamiz.
              </p>

              <div className="homeBadges">
                <Badge variant="success">Auto certificate</Badge>
                <Badge variant="info">PDF + QR code</Badge>
                <Badge variant="warning">Verify link</Badge>
                <Badge variant="info">Admin panel</Badge>
              </div>

              <div className="homeActions">
                <Link className="btn" to="/academy">
                  Kurslarni ko‘rish <span aria-hidden="true">→</span>
                </Link>
                <Link className="btn btnGhost" to="/login">
                  Kirish / Ro‘yxatdan o‘tish
                </Link>
                <Link className="btn btnGhost" to="/verify">
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
            <div className="homeCtaLeft">
              <h3 className="homeCtaTitle">Boshlaymizmi?</h3>
              <p className="homeCtaText">
                Kurslar ro‘yxatini ko‘rib chiq, enroll qil va demo quizdan o‘tib
                sertifikat generatsiyasini sinab ko‘r. Keyin Google login, role
                (admin/user), payment va real kurs kontentini qo‘shamiz.
              </p>
            </div>

            <div className="row gap10 wrap">
              <Link className="btn" to="/academy">
                Kurslar <span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btnGhost" to="/admin">
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
