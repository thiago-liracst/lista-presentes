import { useState, useCallback } from "react";

import "./styles/global.css";

import { useGifts } from "./hooks/useGifts";

import Header           from "./components/Header";
import HeroSection      from "./components/HeroSection";
import GiftCard         from "./components/GiftCard";
import AdminLogin       from "./components/AdminLogin";
import AdminDashboard   from "./components/AdminDashboard";
import ReservationModal from "./components/modals/ReservationModal";
import GiftFormModal    from "./components/modals/GiftFormModal";
import QrConfigModal    from "./components/modals/QrConfigModal";

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Navigation & auth ─────────────────────────────────────────────────────
  const [view, setView]       = useState("gallery"); // "gallery" | "admin-login" | "admin"
  const [isAdmin, setIsAdmin] = useState(false);

  // ── UI state for modals ────────────────────────────────────────────────────
  const [selectedGift,  setSelectedGift]  = useState(null);
  const [showAddGift,   setShowAddGift]   = useState(false);
  const [editingGift,   setEditingGift]   = useState(null);
  const [showQrConfig,  setShowQrConfig]  = useState(false);

  // ── Data & operations (Firebase) ──────────────────────────────────────────
  const {
    gifts, qrCode, stats, filter, setFilter, sortBy, setSortBy, search, setSearch, filteredGifts,
    saveGift, deleteGiftById, confirmReservation, releaseGift, handleSaveQr,
    toast, showToast,
  } = useGifts();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdminLogin = useCallback(() => {
    setIsAdmin(true);
    setView("admin");
    showToast("Bem-vindo, administrador!", "success");
  }, [showToast]);

  const handleLogout = useCallback(() => {
    setIsAdmin(false);
    setView("gallery");
  }, []);

  const handleSaveGift = useCallback(async (data) => {
    const ok = await saveGift(data, editingGift);
    if (ok) { setShowAddGift(false); setEditingGift(null); }
  }, [saveGift, editingGift]);

  const handleEditGift = useCallback((gift) => {
    setEditingGift(gift);
    setShowAddGift(true);
  }, []);

  const handleSaveQrAndClose = useCallback(async (url) => {
    const ok = await handleSaveQr(url);
    if (ok) setShowQrConfig(false);
  }, [handleSaveQr]);

  const handleConfirmReservation = useCallback(async (giftId, guestName, method) => {
    const ok = await confirmReservation(giftId, guestName, method);
    if (ok) setSelectedGift(null);
  }, [confirmReservation]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <Header
        view={view}
        setView={setView}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* ── Gallery ─────────────────────────────────────────────────────── */}
      {view === "gallery" && (
        <>
          <HeroSection stats={stats} />

          <div className="section-header">
            <div className="section-title font-display">Escolha um Presente</div>
            <div className="section-divider" />
            <div className="section-sub">
              {stats.available} itens disponíveis · {stats.reserved + stats.confirmed} já reservados
            </div>
          </div>

          {/* Filter bar */}
          <div className="filter-bar">
            <div className="filter-chips">
              {[["all","Todos"], ["available","Disponíveis"], ["reserved","Reservados"]].map(([val, label]) => (
                <button
                  key={val}
                  className={`filter-chip ${filter === val ? "active" : ""}`}
                  onClick={() => setFilter(val)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="filter-controls">
              <input
                type="text"
                className="form-input filter-search"
                placeholder="Buscar presente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="form-input filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Ordenar por</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome (A-Z)</option>
                <option value="name-desc">Nome (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Gift grid */}
          <div className="container">
            {filteredGifts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎁</div>
                <div className="empty-state-text font-display">Nenhum presente encontrado</div>
              </div>
            ) : (
              <div className="grid">
                {filteredGifts.map((gift) => (
                  <GiftCard key={gift.id} gift={gift} onSelect={() => setSelectedGift(gift)} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Admin Login ─────────────────────────────────────────────────── */}
      {view === "admin-login" && !isAdmin && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}

      {/* ── Admin Dashboard ─────────────────────────────────────────────── */}
      {view === "admin" && isAdmin && (
        <AdminDashboard
          gifts={gifts}
          stats={stats}
          qrCode={qrCode}
          onAddGift={() => { setEditingGift(null); setShowAddGift(true); }}
          onEditGift={handleEditGift}
          onDeleteGift={deleteGiftById}
          onReleaseGift={releaseGift}
          onConfigQr={() => setShowQrConfig(true)}
        />
      )}

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      {selectedGift && (
        <ReservationModal
          gift={selectedGift}
          qrCode={qrCode}
          onClose={() => setSelectedGift(null)}
          onConfirm={handleConfirmReservation}
        />
      )}

      {showAddGift && (
        <GiftFormModal
          gift={editingGift}
          onClose={() => { setShowAddGift(false); setEditingGift(null); }}
          onSave={handleSaveGift}
        />
      )}

      {showQrConfig && (
        <QrConfigModal
          currentQr={qrCode}
          onClose={() => setShowQrConfig(false)}
          onSave={handleSaveQrAndClose}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────────────── */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}