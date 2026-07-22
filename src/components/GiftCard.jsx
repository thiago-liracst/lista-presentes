import { fmt } from "../utils/format";

export default function GiftCard({ gift, onSelect }) {
  const isReserved = gift.status !== "available";

  return (
    <div className={`gift-card ${isReserved ? "reserved" : ""}`}>
      <div className="gift-img">
        {gift.imageUrl ? (
          <img src={gift.imageUrl} alt={gift.name} />
        ) : (
          <span className="gift-img-placeholder">{gift.emoji || "🎁"}</span>
        )}
        {isReserved && (
          <span className="reserved-badge">
            {gift.status === "confirmed" ? "✓ Confirmado" : "Reservado"}
          </span>
        )}
        {gift.reservedBy && (
          <div className="reserved-by">Reservado por {gift.reservedBy.name}</div>
        )}
      </div>

      <div className="gift-body">
        <div className="gift-name font-display">{gift.name}</div>
        <div className="gift-desc">{gift.description}</div>
        <div className="gift-price">{fmt(gift.price)}</div>
      </div>

      <div className="gift-footer">
        {gift.link && (
          <a
            href={gift.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ textDecoration: "none", flex: "0 0 auto" }}
          >
            Ver no site
          </a>
        )}
        <button
          className={`btn ${isReserved ? "btn-outline" : "btn-primary"}`}
          onClick={!isReserved ? onSelect : undefined}
          disabled={isReserved}
        >
          {isReserved
            ? gift.status === "confirmed"
              ? "Pago via Pix"
              : "Já reservado"
            : "Dar este presente"}
        </button>
      </div>
    </div>
  );
}