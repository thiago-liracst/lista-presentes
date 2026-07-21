import { useState } from "react";
import { fmt } from "../../utils/format";

export default function ReservationModal({ gift, qrCode, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1=method | 2=name | 3=qr
  const [method, setMethod] = useState(null); // "pix" | "presencial" | "outro"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const stepLabels =
    method === "pix"
      ? ["Forma de Pagamento", "Seus Dados", "QR Code Pix"]
      : ["Forma de Pagamento", "Seus Dados"];

  const handleContinue = () => {
    if (step === 1 && !method) return;
    if (step === 2 && (!firstName.trim() || !lastName.trim())) return;

    if (step === 2 && method === "pix") { setStep(3); return; }
    if (step === 2 && (method === "presencial" || method === "outro")) {
      onConfirm(gift.id, `${firstName} ${lastName}`, "presencial");
      return;
    }
    if (step === 3) {
      onConfirm(gift.id, `${firstName} ${lastName}`, "pix");
      return;
    }

    setStep((s) => s + 1);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-title font-display">
          {gift.emoji} {gift.name}
        </div>
        <div className="modal-subtitle">{fmt(gift.price)}</div>

        {/* Steps indicator */}
        <div className="steps">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`step-item ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}
            >
              {step > i + 1 ? "✓ " : ""}
              {label}
            </div>
          ))}
        </div>

        {/* Step 1 — Método */}
        {step === 1 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              Como você prefere presentear o casal?
            </p>
            <div className="payment-options">
              <PaymentOption
                icon="💳" title="Pagar via Pix" desc="Transfira o valor agora"
                selected={method === "pix"} onClick={() => setMethod("pix")}
              />
              <PaymentOption
                icon="🎁" title="Presentear pessoalmente" desc="Reserva em seu nome"
                selected={method === "presencial"} onClick={() => setMethod("presencial")}
              />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <PaymentOption
                icon="🛍️" title="Comprar em outra loja" desc="Trago o presente no dia"
                selected={method === "outro"} onClick={() => setMethod("outro")}
              />
            </div>
          </>
        )}

        {/* Step 2 — Nome */}
        {step === 2 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              {method === "pix"
                ? "Após informar seus dados, você verá o QR Code para pagamento."
                : "Seu presente será reservado em seu nome."}
            </p>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input
                  className="form-input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Maria"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sobrenome</label>
                <input
                  className="form-input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Silva"
                />
              </div>
            </div>
          </>
        )}

        {/* Step 3 — QR Code */}
        {step === 3 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              Escaneie o QR Code abaixo para realizar o Pix no valor de{" "}
              <strong>{fmt(gift.price)}</strong>.
            </p>
            <div style={{ textAlign: "center" }}>
              {qrCode ? (
                <img
                  src={qrCode}
                  alt="QR Code Pix"
                  style={{ width: 180, height: 180, borderRadius: 12, border: "1px solid var(--border)" }}
                />
              ) : (
                <div className="qr-preview">
                  <div className="qr-placeholder">QR Code não configurado</div>
                </div>
              )}
              <p style={{ fontSize: "0.78rem", color: "var(--light)", marginTop: "0.75rem" }}>
                Após o pagamento, clique em "Confirmar" abaixo.
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={() => setStep((s) => s - 1)} style={{ flex: "0 0 auto" }}>
              Voltar
            </button>
          )}
          <button
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={handleContinue}
            disabled={step === 1 && !method}
          >
            {step === 2 && method !== "pix"
              ? "Reservar Presente"
              : step === 3
              ? "Confirmar Pagamento"
              : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Local sub-component ────────────────────────────────────────────────────────
function PaymentOption({ icon, title, desc, selected, onClick }) {
  return (
    <div className={`payment-option ${selected ? "selected" : ""}`} onClick={onClick}>
      <div className="payment-option-icon">{icon}</div>
      <div className="payment-option-title">{title}</div>
      <div className="payment-option-desc">{desc}</div>
    </div>
  );
}