import { fmt } from "../utils/format";

export default function AdminDashboard({
  gifts,
  stats,
  qrCode,
  onAddGift,
  onEditGift,
  onDeleteGift,
  onReleaseGift,
  onConfigQr,
}) {
  const statusLabel = (s) =>
    s === "available" ? "Disponível" : s === "reserved" ? "Reservado" : "Confirmado";

  const methodLabel = (method) =>
    method === "pix" ? "💳 Pix" : method === "presencial" ? "🤝 Presencial" : "—";

  return (
    <div className="container" style={{ paddingTop: "2.5rem" }}>
      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "2rem" }}>
        <h2 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 400, marginBottom: "1rem" }}>
          Visão Geral
        </h2>
        <div className="stats-grid">
          <StatCard value={stats.total} label="Total de Presentes" />
          <StatCard value={stats.available} label="Disponíveis" color="var(--sage)" />
          <StatCard value={stats.reserved} label="Reservados" color="#c47a00" />
          <StatCard value={stats.confirmed} label="Confirmados (Pix)" color="var(--rose)" />
          <StatCard value={fmt(stats.totalValue)} label="Valor Total da Lista" small />
          <StatCard value={fmt(stats.collectedValue)} label="Valor Arrecadado (Pix)" small color="var(--sage)" />
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button className="btn btn-gold" onClick={onAddGift}>
          + Adicionar Presente
        </button>
        <button className="btn btn-outline" onClick={onConfigQr}>
          ☎ Configurar QR Code
        </button>
      </div>

      {/* ── QR Preview ────────────────────────────────────────────────────── */}
      {qrCode && (
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "1.25rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <img
            src={qrCode}
            alt="QR Code Pix"
            style={{ width: 72, height: 72, borderRadius: 8, border: "1px solid var(--border)" }}
          />
          <div>
            <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>QR Code Pix cadastrado</div>
            <div style={{ fontSize: "0.78rem", color: "var(--light)", marginTop: "0.2rem" }}>
              Este código será exibido para os convidados realizarem o pagamento
            </div>
          </div>
        </div>
      )}

      {/* ── Gifts table ───────────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
          <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500 }}>
            Gerenciar Presentes
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Presente</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Reservado por</th>
                <th>Método</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gifts.map((gift) => (
                <tr key={gift.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {gift.emoji} {gift.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--light)" }}>
                      {gift.description?.slice(0, 50)}…
                    </div>
                  </td>
                  <td
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      fontWeight: 600,
                      color: "var(--gold)",
                    }}
                  >
                    {fmt(gift.price)}
                  </td>
                  <td>
                    <span className={`status-pill status-${gift.status}`}>
                      {statusLabel(gift.status)}
                    </span>
                  </td>
                  <td>{gift.reservedBy?.name || "—"}</td>
                  <td style={{ fontSize: "0.8rem", color: "var(--mid)" }}>
                    {methodLabel(gift.reservedBy?.method)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onEditGift(gift)}
                      >
                        Editar
                      </button>
                      {gift.status !== "available" && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onReleaseGift(gift.id)}
                        >
                          Liberar
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDeleteGift(gift.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sub-component local ────────────────────────────────────────────────────────
function StatCard({ value, label, color, small }) {
  return (
    <div className="stat-card">
      <div
        className="stat-value"
        style={{
          ...(color ? { color } : {}),
          ...(small ? { fontSize: "1.4rem" } : {}),
        }}
      >
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}