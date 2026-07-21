import { useState } from "react";

const EMOJIS = ["🎁","🍳","🛏️","📺","☕","🫙","🌀","🥗","🎂","🪴","🍽️","🏺","🕯️","🪑","🛁","🎨","📚","🎵","🌿","💐"];

export default function GiftFormModal({ gift, onClose, onSave }) {
  const [form, setForm] = useState({
    name: gift?.name || "",
    description: gift?.description || "",
    price: gift?.price || "",
    link: gift?.link || "",
    emoji: gift?.emoji || "🎁",
    imageUrl: gift?.imageUrl || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.price) return;
    onSave({ ...form, price: parseFloat(String(form.price).replace(",", ".")) });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 540 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title font-display">
          {gift ? "Editar Presente" : "Adicionar Presente"}
        </div>
        <div className="modal-subtitle">Preencha os detalhes do item</div>

        {/* Emoji picker */}
        <div className="form-group">
          <label className="form-label">Emoji / Ícone</label>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => set("emoji", e)}
                style={{
                  width: 36, height: 36,
                  border: `2px solid ${form.emoji === e ? "var(--gold)" : "var(--border)"}`,
                  borderRadius: 8,
                  background: form.emoji === e ? "var(--gold-pale)" : "var(--white)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nome do Presente *</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Ex: Jogo de Panelas Tramontina"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-input"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Descreva o produto brevemente..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Preço (R$) *</label>
            <input
              className="form-input"
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Link do Produto</label>
            <input
              className="form-input"
              value={form.link}
              onChange={(e) => set("link", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">URL da Imagem (opcional)</label>
          <input
            className="form-input"
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="btn btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={handleSave}
            disabled={!form.name || !form.price}
          >
            {gift ? "Salvar Alterações" : "Adicionar Presente"}
          </button>
        </div>
      </div>
    </div>
  );
}