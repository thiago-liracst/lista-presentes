import { useState } from "react";

export default function QrConfigModal({ currentQr, onClose, onSave }) {
  const [url, setUrl] = useState(currentQr || "");
  const [inputType, setInputType] = useState("url"); // "url" | "upload"

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title font-display">Configurar QR Code Pix</div>
        <div className="modal-subtitle">
          Este código será exibido para os convidados realizarem pagamento
        </div>

        {/* Toggle url / upload */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {[["url", "URL da Imagem"], ["upload", "Upload"]].map(([val, label]) => (
            <button
              key={val}
              className={`filter-chip ${inputType === val ? "active" : ""}`}
              onClick={() => setInputType(val)}
            >
              {label}
            </button>
          ))}
        </div>

        {inputType === "url" ? (
          <div className="form-group">
            <label className="form-label">URL da imagem do QR Code</label>
            <input
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
            <p style={{ fontSize: "0.75rem", color: "var(--light)", marginTop: "0.4rem" }}>
              Cole o link direto da imagem do seu QR Code Pix
            </p>
          </div>
        ) : (
          <div className="qr-preview">
            <p style={{ fontSize: "0.82rem", color: "var(--mid)" }}>
              Para upload de imagem, utilize a URL do Firebase Storage ou outro serviço de
              hospedagem e cole a URL acima.
            </p>
          </div>
        )}

        {url && (
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--light)", marginBottom: "0.5rem" }}>
              Prévia:
            </p>
            <img
              src={url}
              alt="QR Preview"
              style={{ maxWidth: 150, maxHeight: 150, borderRadius: 10, border: "1px solid var(--border)" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={() => onSave(url)}
            disabled={!url}
          >
            Salvar QR Code
          </button>
        </div>
      </div>
    </div>
  );
}