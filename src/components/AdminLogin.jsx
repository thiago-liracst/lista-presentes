import { useState } from "react";

const ADMIN_PASSWORD = "casamento2025"; // ⚠️ Altere antes de publicar!

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setError(false);
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--white)",
          borderRadius: 20,
          padding: "2.5rem",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
          <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 400 }}>
            Acesso Administrativo
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--light)", marginTop: "0.4rem" }}>
            Apenas para os noivos
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-input"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={error ? { borderColor: "#e05252" } : {}}
          />
          {error && (
            <p style={{ fontSize: "0.78rem", color: "#e05252", marginTop: "0.4rem" }}>
              Senha incorreta.
            </p>
          )}
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.75rem" }}
          onClick={handleSubmit}
        >
          Entrar
        </button>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--light)", marginTop: "1rem" }}>
          Senha padrão:{" "}
          <code style={{ background: "var(--gold-pale)", padding: "2px 6px", borderRadius: 4 }}>
            casamento2025
          </code>
        </p>
      </div>
    </div>
  );
}