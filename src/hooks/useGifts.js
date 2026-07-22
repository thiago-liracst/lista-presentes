import { useState, useEffect, useCallback } from "react";
import { subscribeGifts, addGift, updateGift, deleteGift, saveQrCode, getQrCode } from "../firebase";

/**
 * Centraliza todo o estado de presentes e QR Code, além das
 * operações de leitura/escrita no Firebase.
 *
 * Retorna:
 *  - gifts, qrCode, stats, filteredGifts
 *  - filter / setFilter
 *  - saveGift, deleteGiftById, confirmReservation, releaseGift, handleSaveQr
 *  - toast, showToast
 */
export function useGifts() {
  const [gifts, setGifts] = useState([]);
  const [qrCode, setQrCode] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default"); // "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc"
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // ── Realtime subscription ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = subscribeGifts((data) => setGifts(data));
    getQrCode().then((url) => { if (url) setQrCode(url); });
    return () => unsub();
  }, []);

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const saveGift = async (giftData, editingGift = null) => {
    try {
      if (editingGift) {
        await updateGift(editingGift.id, giftData);
        showToast("Presente atualizado!", "success");
      } else {
        await addGift({ ...giftData, status: "available", reservedBy: null });
        showToast("Presente adicionado!", "success");
      }
      return true;
    } catch (e) {
      showToast("Erro ao salvar. Verifique o Firebase.", "error");
      console.error(e);
      return false;
    }
  };

  const deleteGiftById = async (id) => {
    if (!window.confirm("Remover este presente da lista?")) return;
    try {
      await deleteGift(id);
      showToast("Presente removido.");
    } catch (e) {
      showToast("Erro ao remover.", "error");
    }
  };

  const confirmReservation = async (giftId, guestName, method) => {
    try {
      await updateGift(giftId, {
        status: method === "pix" ? "confirmed" : "reserved",
        reservedBy: { name: guestName, method },
      });
      showToast(`Reservado com sucesso! Obrigado, ${guestName.split(" ")[0]}! 💕`, "success");
      return true;
    } catch (e) {
      showToast("Erro ao reservar. Tente novamente.", "error");
      console.error(e);
      return false;
    }
  };

  const releaseGift = async (id) => {
    try {
      await updateGift(id, { status: "available", reservedBy: null });
      showToast("Presente disponibilizado novamente.");
    } catch (e) {
      showToast("Erro ao liberar presente.", "error");
    }
  };

  const handleSaveQr = async (url) => {
    try {
      await saveQrCode(url);
      setQrCode(url);
      showToast("QR Code atualizado!", "success");
      return true;
    } catch (e) {
      showToast("Erro ao salvar QR Code.", "error");
      return false;
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const stats = {
    total: gifts.length,
    available: gifts.filter((g) => g.status === "available").length,
    reserved: gifts.filter((g) => g.status === "reserved").length,
    confirmed: gifts.filter((g) => g.status === "confirmed").length,
    totalValue: gifts.reduce((s, g) => s + (Number(g.price) || 0), 0),
    collectedValue: gifts
      .filter((g) => g.status === "confirmed")
      .reduce((s, g) => s + (Number(g.price) || 0), 0),
  };

  const filteredGifts = gifts
    .filter((g) => {
      if (filter === "available") return g.status === "available";
      if (filter === "reserved") return g.status !== "available";
      return true; // "all"
    })
    .filter((g) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        g.name?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return (Number(a.price) || 0) - (Number(b.price) || 0);
      if (sortBy === "price-desc") return (Number(b.price) || 0) - (Number(a.price) || 0);
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "", "pt-BR");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "", "pt-BR");
      return 0; // "default" — mantém ordem original (Firestore)
    });

  return {
    gifts,
    qrCode,
    stats,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    search,
    setSearch,
    filteredGifts,
    saveGift,
    deleteGiftById,
    confirmReservation,
    releaseGift,
    handleSaveQr,
    toast,
    showToast,
  };
}