import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card } from "../components/ui.jsx";
import { useAuth } from "../lib/auth.jsx";

export default function Login() {
  const { loginGoogle, loginEmail, signUpEmail } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const next = sp.get("next") || "/academy";

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const goNext = () => nav(next);

  const onGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      await loginGoogle();
      goNext();
    } catch (e) {
      setErr(e?.message || "Google login xato");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUpEmail({ name, email, password });
      } else {
        await loginEmail({ email, password });
      }
      goNext();
    } catch (e2) {
      setErr(e2?.message || "Xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center">
      <Card className="max520">
        <div className="row between wrap gap10">
          <h1 className="h2">{mode === "signup" ? "Ro‘yxatdan o‘tish" : "Kirish"}</h1>
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </div>

        <p className="muted">
          {mode === "signup"
            ? "Email va parol bilan ro‘yxatdan o‘ting yoki Google orqali kirib keting."
            : "Email+parol yoki Google orqali kiring."}
        </p>

        {err ? (
          <div className="mt10" style={{ color: "#ef4444", fontWeight: 700 }}>
            {err}
          </div>
        ) : null}

        <div className="row gap10 mt12 wrap">
          <button className="btn" type="button" onClick={onGoogle} disabled={loading}>
            {loading ? "..." : "Google bilan kirish"}
          </button>
          <span className="muted">yoki</span>
        </div>

        <form onSubmit={onSubmit} className="form mt12">
          {mode === "signup" ? (
            <>
              <label className="label">Ism</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="G‘ulomjon"
                autoComplete="name"
              />
            </>
          ) : null}

          <label className="label mt10">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="gulomjon@..."
            autoComplete="email"
          />

          <label className="label mt10">Parol</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          <div className="row gap10 mt16 wrap">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "..." : mode === "signup" ? "Ro‘yxatdan o‘tish" : "Kirish"}
            </button>

            <button
              className="btn btnGhost"
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setPassword("");
                setErr("");
              }}
            >
              Tozalash
            </button>

            <Link className="pill" to="/academy">
              Bekor qilish
            </Link>
          </div>

          <div className="muted mt12">
            Admin: <b>admin@emc.uz</b> (email shunday bo‘lsa admin bo‘ladi).
          </div>
        </form>
      </Card>
    </div>
  );
}
