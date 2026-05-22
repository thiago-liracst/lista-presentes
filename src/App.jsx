import { useState, useEffect, useCallback } from "react";

const FIREBASE_CONFIG_PLACEHOLDER = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

// ─── Inline Firebase SDK via CDN ─────────────────────────────────────────────
// This component dynamically loads Firebase from CDN
// Replace FIREBASE_CONFIG_PLACEHOLDER with your actual config

const ADMIN_PASSWORD = "casamento2025"; // Change this!

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #F4F5EE;
    --gold: #6B7A3A;
    --gold-light: #8C9E50;
    --gold-pale: #E8EDD6;
    --dark: #1E2410;
    --mid: #4A5528;
    --light: #7D8C58;
    --white: #FFFFFF;
    --rose: #8A9E6A;
    --sage: #5C7A3E;
    --border: rgba(107,122,58,0.25);
    --shadow: 0 2px 24px rgba(30,36,16,0.08);
  }

  body { background: var(--cream); font-family: 'Jost', sans-serif; color: var(--dark); }

  .font-display { font-family: 'Cormorant Garamond', serif; }

  /* Header */
  .header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(8px);
  }
  .header-brand { display: flex; align-items: center; gap: 1rem; }
  .header-logo {
    width: 44px; height: 44px;
    background: var(--gold);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1.1rem;
  }
  .header-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 400; color: var(--dark); }
  .header-subtitle { font-size: 0.75rem; color: var(--light); letter-spacing: 0.12em; text-transform: uppercase; }
  .nav-tabs { display: flex; gap: 0.5rem; }
  .nav-tab {
    padding: 0.5rem 1.25rem;
    border: 1px solid transparent;
    border-radius: 100px;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    font-weight: 400;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s;
    background: transparent;
    color: var(--mid);
  }
  .nav-tab:hover { border-color: var(--border); background: var(--gold-pale); }
  .nav-tab.active { background: var(--dark); color: var(--white); border-color: var(--dark); }
  .nav-tab.admin { color: var(--gold); border-color: var(--border); }
  .nav-tab.admin.active { background: var(--gold); color: var(--white); border-color: var(--gold); }

  /* Hero */
  .hero {
    text-align: center;
    padding: 5rem 2rem 3rem;
    background: linear-gradient(180deg, var(--white) 0%, var(--cream) 100%);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle at 20% 50%, rgba(184,150,62,0.06) 0%, transparent 60%),
                      radial-gradient(circle at 80% 20%, rgba(196,132,122,0.06) 0%, transparent 60%);
  }
  .hero-ornament { color: var(--gold); font-size: 1.5rem; letter-spacing: 0.5em; margin-bottom: 1rem; opacity: 0.7; }
  .hero-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 300; color: var(--dark); line-height: 1.1; }
  .hero-subtitle { font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--light); margin: 1rem 0; }
  .hero-desc { max-width: 540px; margin: 0 auto; color: var(--mid); font-size: 0.95rem; line-height: 1.7; font-weight: 300; }
  .hero-divider { width: 60px; height: 1px; background: var(--gold); margin: 1.5rem auto; }

  /* Grid */
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

  /* Gift Card */
  .gift-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }
  .gift-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
  .gift-card.reserved { opacity: 0.75; }

  .gift-img {
    width: 100%; height: 200px;
    background: var(--gold-pale);
    display: flex; align-items: center; justify-content: center;
    font-size: 3rem; color: var(--gold-light);
    position: relative; overflow: hidden;
  }
  .gift-img img { width: 100%; height: 100%; object-fit: cover; }
  .gift-img-placeholder { font-size: 2.5rem; opacity: 0.5; }

  .reserved-badge {
    position: absolute; top: 12px; right: 12px;
    background: var(--dark); color: var(--white);
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; padding: 4px 12px; border-radius: 100px;
  }
  .reserved-by {
    position: absolute; bottom: 12px; left: 12px; right: 12px;
    background: rgba(44,36,24,0.85);
    color: var(--white); font-size: 0.75rem;
    padding: 6px 12px; border-radius: 8px;
    backdrop-filter: blur(4px);
  }

  .gift-body { padding: 1.25rem; }
  .gift-name { font-family: 'Cormorant Garamond', serif; font-size: 1.25rem; font-weight: 500; color: var(--dark); margin-bottom: 0.4rem; }
  .gift-desc { font-size: 0.82rem; color: var(--mid); line-height: 1.6; margin-bottom: 1rem; min-height: 52px; }
  .gift-price { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 600; color: var(--gold); }
  .gift-footer { padding: 0 1.25rem 1.25rem; display: flex; gap: 0.5rem; }

  /* Buttons */
  .btn {
    padding: 0.6rem 1.25rem;
    border-radius: 100px;
    font-family: 'Jost', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    flex: 1;
    text-align: center;
  }
  .btn-primary { background: var(--dark); color: var(--white); }
  .btn-primary:hover { background: var(--mid); }
  .btn-outline { background: transparent; border-color: var(--border); color: var(--mid); }
  .btn-outline:hover { background: var(--gold-pale); border-color: var(--gold); color: var(--dark); }
  .btn-gold { background: var(--gold); color: var(--white); }
  .btn-gold:hover { background: var(--gold-light); }
  .btn-danger { background: #e05252; color: white; }
  .btn-danger:hover { background: #c43d3d; }
  .btn-sm { padding: 0.4rem 0.9rem; font-size: 0.75rem; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(44,36,24,0.6);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--white);
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }
  .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; font-weight: 400; margin-bottom: 0.25rem; }
  .modal-subtitle { font-size: 0.82rem; color: var(--light); margin-bottom: 1.5rem; }
  .modal-close {
    position: absolute; top: 1rem; right: 1rem;
    background: var(--cream); border: none; border-radius: 50%;
    width: 32px; height: 32px;
    cursor: pointer; font-size: 1rem; color: var(--mid);
    display: flex; align-items: center; justify-content: center;
  }

  /* Form */
  .form-group { margin-bottom: 1.1rem; }
  .form-label { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); margin-bottom: 0.4rem; display: block; }
  .form-input {
    width: 100%;
    padding: 0.65rem 1rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: 'Jost', sans-serif;
    font-size: 0.9rem;
    color: var(--dark);
    background: var(--white);
    transition: border-color 0.2s;
    outline: none;
  }
  .form-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(184,150,62,0.1); }
  .form-input::placeholder { color: var(--light); }
  textarea.form-input { resize: vertical; min-height: 80px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  /* QR Code section */
  .qr-preview {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin: 1rem 0;
    background: var(--gold-pale);
  }
  .qr-img { max-width: 160px; max-height: 160px; border-radius: 8px; }
  .qr-placeholder { color: var(--light); font-size: 0.85rem; }

  /* Admin Dashboard */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.25rem;
    text-align: center;
  }
  .stat-value { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 600; color: var(--gold); }
  .stat-label { font-size: 0.75rem; color: var(--light); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.25rem; }

  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th {
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--light);
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .admin-table td { padding: 0.9rem 1rem; border-bottom: 1px solid rgba(184,150,62,0.1); font-size: 0.88rem; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: var(--gold-pale); }

  .status-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 100px;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.06em;
  }
  .status-available { background: #eaf5e9; color: #3a7a35; }
  .status-reserved { background: #fff3e0; color: #c47a00; }
  .status-confirmed { background: #fde8e8; color: #c43d3d; }

  /* Section heading */
  .section-header { text-align: center; padding: 3rem 2rem 1.5rem; }
  .section-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 400; }
  .section-divider { width: 48px; height: 1px; background: var(--gold); margin: 0.75rem auto; }
  .section-sub { color: var(--mid); font-size: 0.88rem; }

  /* Filter bar */
  .filter-bar {
    display: flex; gap: 0.5rem; flex-wrap: wrap;
    padding: 0 2rem 1.5rem;
    max-width: 1200px; margin: 0 auto;
  }
  .filter-chip {
    padding: 0.4rem 1rem;
    border-radius: 100px;
    border: 1px solid var(--border);
    font-size: 0.8rem;
    color: var(--mid);
    background: var(--white);
    cursor: pointer;
    transition: all 0.2s;
  }
  .filter-chip.active { background: var(--dark); color: var(--white); border-color: var(--dark); }

  /* Payment step */
  .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 1rem 0; }
  .payment-option {
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    background: var(--white);
  }
  .payment-option:hover { border-color: var(--gold); background: var(--gold-pale); }
  .payment-option.selected { border-color: var(--gold); background: var(--gold-pale); }
  .payment-option-icon { font-size: 1.5rem; margin-bottom: 0.4rem; }
  .payment-option-title { font-size: 0.82rem; font-weight: 500; color: var(--dark); }
  .payment-option-desc { font-size: 0.72rem; color: var(--light); margin-top: 2px; }

  /* Steps */
  .steps { display: flex; gap: 0; margin-bottom: 1.5rem; }
  .step-item {
    flex: 1; text-align: center; padding: 0.5rem;
    font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase;
    color: var(--light); border-bottom: 2px solid var(--border); padding-bottom: 0.75rem;
  }
  .step-item.active { color: var(--gold); border-color: var(--gold); font-weight: 500; }
  .step-item.done { color: var(--sage); border-color: var(--sage); }

  /* Toast */
  .toast {
    position: fixed; bottom: 2rem; right: 2rem;
    background: var(--dark); color: var(--white);
    padding: 0.9rem 1.5rem;
    border-radius: 12px;
    font-size: 0.88rem;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  }
  .toast.success { background: #2e6b2a; }
  .toast.error { background: #8b2020; }

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  /* Empty state */
  .empty-state { text-align: center; padding: 5rem 2rem; color: var(--light); }
  .empty-state-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
  .empty-state-text { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: var(--mid); }

  /* Loader */
  .loader { text-align: center; padding: 4rem; color: var(--light); }

  /* Config notice */
  .config-notice {
    background: #fff8e1; border: 1px solid #f0c040; border-radius: 12px;
    padding: 1.25rem 1.5rem; margin: 1rem 2rem;
    font-size: 0.85rem; color: #7a5f00;
  }
  .config-notice code {
    background: rgba(0,0,0,0.08); border-radius: 4px;
    padding: 2px 6px; font-family: monospace; font-size: 0.8rem;
  }

  @media (max-width: 640px) {
    .header { padding: 1rem; }
    .nav-tabs { display: none; }
    .form-row { grid-template-columns: 1fr; }
    .payment-options { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── Mock data for demo ───────────────────────────────────────────────────────
const MOCK_GIFTS = [
  { id: "1", name: "Jogo de Panelas Tramontina", description: "Conjunto 5 peças antiaderente, perfeito para equipar a nova cozinha com qualidade e durabilidade.", price: 389.90, link: "https://tramontina.com.br", emoji: "🍳", status: "available", reservedBy: null },
  { id: "2", name: "Liquidificador Mondial", description: "Potência de 900W com 10 velocidades e copo de vidro de 2 litros.", price: 189.90, link: "https://mondial.com.br", emoji: "🫙", status: "reserved", reservedBy: { name: "Carlos Mendes", method: "presencial" } },
  { id: "3", name: "Aspirador de Pó Dyson", description: "Modelo sem fio com 60 min de autonomia e tecnologia ciclônica de alta eficiência.", price: 2890.00, link: "https://dyson.com.br", emoji: "🌀", status: "available", reservedBy: null },
  { id: "4", name: "Jogo de Cama Queen Premium", description: "Lençol 500 fios 100% algodão egípcio, inclui 4 fronhas com bordado exclusivo.", price: 599.00, link: "https://amazon.com.br", emoji: "🛏️", status: "confirmed", reservedBy: { name: "Ana Paula Lima", method: "pix" } },
  { id: "5", name: "Fritadeira Air Fryer 5L", description: "Capacidade familiar com 12 funções pré-programadas e display digital touchscreen.", price: 449.00, link: "https://philips.com.br", emoji: "🥗", status: "available", reservedBy: null },
  { id: "6", name: "Smart TV 55\" 4K", description: "Tela QLED com HDR10+, sistema operacional com streaming integrado e controle por voz.", price: 3199.00, link: "https://samsung.com.br", emoji: "📺", status: "available", reservedBy: null },
  { id: "7", name: "Cafeteira Nespresso", description: "Máquina de cápsulas com sistema de espuma de leite aeroccino, 19 bar de pressão.", price: 879.00, link: "https://nespresso.com", emoji: "☕", status: "reserved", reservedBy: { name: "Roberto Silva", method: "presencial" } },
  { id: "8", name: "Batedeira Stand Mixer KitchenAid", description: "Motor de 300W com 10 velocidades e acessórios de aço inox para todas as receitas.", price: 1599.00, link: "https://kitchenaid.com.br", emoji: "🎂", status: "available", reservedBy: null },
];

const MOCK_QR = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/220px-QR_code_for_mobile_English_Wikipedia.svg.png";

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function WeddingRegistry() {
  const [view, setView] = useState("gallery"); // gallery | admin | admin-login
  const [gifts, setGifts] = useState(MOCK_GIFTS);
  const [qrCode, setQrCode] = useState(MOCK_QR);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedGift, setSelectedGift] = useState(null);
  const [showAddGift, setShowAddGift] = useState(false);
  const [showQrConfig, setShowQrConfig] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [usingMock, setUsingMock] = useState(true);

  // Firebase refs (populated after init)
  const [db, setDb] = useState(null);
  const [firebaseApp, setFirebaseApp] = useState(null);

  const showToast = useCallback((msg, type = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Firebase init ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Try to load Firebase from CDN
    const loadFirebase = async () => {
      try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } =
          await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        // Check if user has configured Firebase
        if (FIREBASE_CONFIG_PLACEHOLDER.apiKey === "SUA_API_KEY") {
          setUsingMock(true);
          return;
        }

        const app = initializeApp(FIREBASE_CONFIG_PLACEHOLDER);
        const firestore = getFirestore(app);
        setFirebaseApp(app);
        setDb(firestore);
        setFirebaseReady(true);
        setUsingMock(false);

        // Listen to gifts
        const unsub = onSnapshot(collection(firestore, "gifts"), (snap) => {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setGifts(data);
        });

        // Listen to settings (QR code)
        const unsubSettings = onSnapshot(collection(firestore, "settings"), (snap) => {
          const settings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          const qrSetting = settings.find(s => s.id === "qrcode");
          if (qrSetting?.url) setQrCode(qrSetting.url);
        });

        return () => { unsub(); unsubSettings(); };
      } catch (e) {
        setUsingMock(true);
      }
    };

    loadFirebase();
  }, []);

  // ── Admin login ────────────────────────────────────────────────────────────
  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setView("admin");
      setAdminPassword("");
      showToast("Bem-vindo, administrador!", "success");
    } else {
      showToast("Senha incorreta.", "error");
    }
  };

  // ── CRUD gifts (mock mode) ─────────────────────────────────────────────────
  const saveGift = async (giftData) => {
    if (editingGift) {
      setGifts(g => g.map(item => item.id === editingGift.id ? { ...item, ...giftData } : item));
    } else {
      const newGift = { ...giftData, id: Date.now().toString(), status: "available", reservedBy: null };
      setGifts(g => [...g, newGift]);
    }
    setShowAddGift(false);
    setEditingGift(null);
    showToast(editingGift ? "Presente atualizado!" : "Presente adicionado!", "success");
  };

  const deleteGift = (id) => {
    if (!window.confirm("Remover este presente da lista?")) return;
    setGifts(g => g.filter(item => item.id !== id));
    showToast("Presente removido.");
  };

  const confirmReservation = (giftId, guestName, method) => {
    setGifts(g => g.map(item =>
      item.id === giftId
        ? { ...item, status: method === "pix" ? "confirmed" : "reserved", reservedBy: { name: guestName, method } }
        : item
    ));
    setSelectedGift(null);
    showToast(`Presente reservado com sucesso! Obrigado, ${guestName.split(" ")[0]}! 💕`, "success");
  };

  const releaseGift = (id) => {
    setGifts(g => g.map(item => item.id === id ? { ...item, status: "available", reservedBy: null } : item));
    showToast("Presente disponibilizado novamente.");
  };

  // ── Computed stats ─────────────────────────────────────────────────────────
  const stats = {
    total: gifts.length,
    available: gifts.filter(g => g.status === "available").length,
    reserved: gifts.filter(g => g.status === "reserved").length,
    confirmed: gifts.filter(g => g.status === "confirmed").length,
    totalValue: gifts.reduce((s, g) => s + g.price, 0),
    collectedValue: gifts.filter(g => g.status === "confirmed").reduce((s, g) => s + g.price, 0),
  };

  const filteredGifts = gifts.filter(g => {
    if (filter === "all") return true;
    if (filter === "available") return g.status === "available";
    if (filter === "reserved") return g.status !== "available";
    return true;
  });

  const fmt = (val) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <style>{styles}</style>

      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">♡</div>
          <div>
            <div className="header-title font-display">Lista de Presentes</div>
            <div className="header-subtitle">Ana & Bruno · 15 de Novembro</div>
          </div>
        </div>
        <nav className="nav-tabs">
          <button className={`nav-tab ${view === "gallery" ? "active" : ""}`} onClick={() => setView("gallery")}>
            Presentes
          </button>
          {isAdmin ? (
            <>
              <button className={`nav-tab admin ${view === "admin" ? "active" : ""}`} onClick={() => setView("admin")}>
                Painel Admin
              </button>
              <button className="nav-tab" onClick={() => { setIsAdmin(false); setView("gallery"); }}>
                Sair
              </button>
            </>
          ) : (
            <button className={`nav-tab admin ${view === "admin-login" ? "active" : ""}`} onClick={() => setView("admin-login")}>
              Admin
            </button>
          )}
        </nav>
      </header>

      {/* Firebase config notice */}
      {usingMock && (
        <div className="config-notice">
          <strong>Modo demonstração</strong> — Para usar com Firebase real, edite <code>FIREBASE_CONFIG_PLACEHOLDER</code> no código com as credenciais do seu projeto Firebase. Os dados abaixo são de exemplo.
        </div>
      )}

      {/* ── Gallery View ─────────────────────────────────────────────────── */}
      {view === "gallery" && (
        <>
          <div className="hero">
            <div className="hero-ornament">✦ ✦ ✦</div>
            <h1 className="hero-title font-display">Nossa Lista de<br />Presentes</h1>
            <div className="hero-divider" />
            <p className="hero-subtitle">Casamento · 15 de Novembro de 2025</p>
            <p className="hero-desc">
              Cada presente escolhido com carinho será parte da nossa nova história juntos.
              Escolha um item e nos ajude a construir nosso lar com amor.
            </p>
          </div>

          <div className="section-header">
            <div className="section-title font-display">Escolha um Presente</div>
            <div className="section-divider" />
            <div className="section-sub">{stats.available} itens disponíveis · {stats.reserved + stats.confirmed} já reservados</div>
          </div>

          <div className="filter-bar">
            {[["all","Todos"], ["available","Disponíveis"], ["reserved","Reservados"]].map(([val, label]) => (
              <button key={val} className={`filter-chip ${filter === val ? "active" : ""}`} onClick={() => setFilter(val)}>
                {label}
              </button>
            ))}
          </div>

          <div className="container">
            {filteredGifts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎁</div>
                <div className="empty-state-text font-display">Nenhum presente encontrado</div>
              </div>
            ) : (
              <div className="grid">
                {filteredGifts.map(gift => (
                  <GiftCard key={gift.id} gift={gift} onSelect={() => setSelectedGift(gift)} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Admin Login ──────────────────────────────────────────────────── */}
      {view === "admin-login" && !isAdmin && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", padding: "2rem" }}>
          <div style={{ width: "100%", maxWidth: 380, background: "var(--white)", borderRadius: 20, padding: "2.5rem", border: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
              <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 400 }}>Acesso Administrativo</h2>
              <p style={{ fontSize: "0.82rem", color: "var(--light)", marginTop: "0.4rem" }}>Apenas para os noivos</p>
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="Digite a senha"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
              />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: "0.75rem" }} onClick={handleAdminLogin}>
              Entrar
            </button>
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--light)", marginTop: "1rem" }}>
              Senha padrão: <code style={{ background: "var(--gold-pale)", padding: "2px 6px", borderRadius: 4 }}>casamento2025</code>
            </p>
          </div>
        </div>
      )}

      {/* ── Admin Dashboard ──────────────────────────────────────────────── */}
      {view === "admin" && isAdmin && (
        <div className="container" style={{ paddingTop: "2.5rem" }}>
          {/* Stats */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 className="font-display" style={{ fontSize: "1.8rem", fontWeight: 400, marginBottom: "1rem" }}>Visão Geral</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total de Presentes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--sage)" }}>{stats.available}</div>
                <div className="stat-label">Disponíveis</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "#c47a00" }}>{stats.reserved}</div>
                <div className="stat-label">Reservados</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: "var(--rose)" }}>{stats.confirmed}</div>
                <div className="stat-label">Confirmados (Pix)</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: "1.4rem" }}>{fmt(stats.totalValue)}</div>
                <div className="stat-label">Valor Total da Lista</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ fontSize: "1.4rem", color: "var(--sage)" }}>{fmt(stats.collectedValue)}</div>
                <div className="stat-label">Valor Arrecadado (Pix)</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-gold" onClick={() => { setEditingGift(null); setShowAddGift(true); }}>
              + Adicionar Presente
            </button>
            <button className="btn btn-outline" onClick={() => setShowQrConfig(true)}>
              ☎ Configurar QR Code
            </button>
          </div>

          {/* QR Preview */}
          {qrCode && (
            <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 14, padding: "1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={qrCode} alt="QR Code Pix" style={{ width: 72, height: 72, borderRadius: 8, border: "1px solid var(--border)" }} />
              <div>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>QR Code Pix cadastrado</div>
                <div style={{ fontSize: "0.78rem", color: "var(--light)", marginTop: "0.2rem" }}>Este código será exibido para os convidados realizarem o pagamento</div>
              </div>
            </div>
          )}

          {/* Gifts table */}
          <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h3 className="font-display" style={{ fontSize: "1.3rem", fontWeight: 500 }}>Gerenciar Presentes</h3>
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
                  {gifts.map(gift => (
                    <tr key={gift.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{gift.emoji} {gift.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--light)" }}>{gift.description?.slice(0, 50)}…</div>
                      </td>
                      <td style={{ fontFamily: "Cormorant Garamond, serif", fontWeight: 600, color: "var(--gold)" }}>
                        {fmt(gift.price)}
                      </td>
                      <td>
                        <span className={`status-pill status-${gift.status}`}>
                          {gift.status === "available" ? "Disponível" : gift.status === "reserved" ? "Reservado" : "Confirmado"}
                        </span>
                      </td>
                      <td>{gift.reservedBy?.name || "—"}</td>
                      <td style={{ fontSize: "0.8rem", color: "var(--mid)" }}>
                        {gift.reservedBy?.method === "pix" ? "💳 Pix" : gift.reservedBy?.method === "presencial" ? "🤝 Presencial" : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button className="btn btn-outline btn-sm" onClick={() => { setEditingGift(gift); setShowAddGift(true); }}>Editar</button>
                          {gift.status !== "available" && (
                            <button className="btn btn-outline btn-sm" onClick={() => releaseGift(gift.id)}>Liberar</button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => deleteGift(gift.id)}>✕</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Gift Reservation Modal ────────────────────────────────────────── */}
      {selectedGift && (
        <ReservationModal
          gift={selectedGift}
          qrCode={qrCode}
          onClose={() => setSelectedGift(null)}
          onConfirm={confirmReservation}
        />
      )}

      {/* ── Add/Edit Gift Modal ───────────────────────────────────────────── */}
      {showAddGift && (
        <GiftFormModal
          gift={editingGift}
          onClose={() => { setShowAddGift(false); setEditingGift(null); }}
          onSave={saveGift}
        />
      )}

      {/* ── QR Code Config Modal ─────────────────────────────────────────── */}
      {showQrConfig && (
        <QrConfigModal
          currentQr={qrCode}
          onClose={() => setShowQrConfig(false)}
          onSave={(url) => { setQrCode(url); setShowQrConfig(false); showToast("QR Code atualizado!", "success"); }}
        />
      )}

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ─── Gift Card Component ──────────────────────────────────────────────────────
function GiftCard({ gift, onSelect }) {
  const fmt = (val) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const isReserved = gift.status !== "available";

  return (
    <div className={`gift-card ${isReserved ? "reserved" : ""}`}>
      <div className="gift-img">
        {gift.imageUrl
          ? <img src={gift.imageUrl} alt={gift.name} />
          : <span className="gift-img-placeholder">{gift.emoji || "🎁"}</span>
        }
        {isReserved && <span className="reserved-badge">{gift.status === "confirmed" ? "✓ Confirmado" : "Reservado"}</span>}
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
          <a href={gift.link} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: "none", flex: "0 0 auto" }}>
            Ver
          </a>
        )}
        <button
          className={`btn ${isReserved ? "btn-outline" : "btn-primary"}`}
          onClick={!isReserved ? onSelect : undefined}
          disabled={isReserved}
        >
          {isReserved ? (gift.status === "confirmed" ? "Pago via Pix" : "Já reservado") : "Dar este presente"}
        </button>
      </div>
    </div>
  );
}

// ─── Reservation Modal ────────────────────────────────────────────────────────
function ReservationModal({ gift, qrCode, onClose, onConfirm }) {
  const [step, setStep] = useState(1); // 1=method, 2=name, 3=qr or confirm
  const [method, setMethod] = useState(null); // pix | presencial
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fmt = (val) => val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleContinue = () => {
    if (step === 1 && !method) return;
    if (step === 2 && (!firstName.trim() || !lastName.trim())) return;
    if (step === 2 && method === "pix") { setStep(3); return; }
    if (step === 2 && method === "presencial") {
      onConfirm(gift.id, `${firstName} ${lastName}`, "presencial");
      return;
    }
    if (step === 3) {
      onConfirm(gift.id, `${firstName} ${lastName}`, "pix");
      return;
    }
    setStep(s => s + 1);
  };

  const stepLabels = method === "pix"
    ? ["Forma de Pagamento", "Seus Dados", "QR Code Pix"]
    : ["Forma de Pagamento", "Seus Dados"];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-title font-display">{gift.emoji} {gift.name}</div>
        <div className="modal-subtitle">{fmt(gift.price)}</div>

        {/* Steps indicator */}
        <div className="steps">
          {stepLabels.map((label, i) => (
            <div key={i} className={`step-item ${step === i+1 ? "active" : step > i+1 ? "done" : ""}`}>
              {step > i+1 ? "✓ " : ""}{label}
            </div>
          ))}
        </div>

        {/* Step 1: Method selection */}
        {step === 1 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              Como você prefere presentear o casal?
            </p>
            <div className="payment-options">
              <div className={`payment-option ${method === "pix" ? "selected" : ""}`} onClick={() => setMethod("pix")}>
                <div className="payment-option-icon">💳</div>
                <div className="payment-option-title">Pagar via Pix</div>
                <div className="payment-option-desc">Transfira o valor agora</div>
              </div>
              <div className={`payment-option ${method === "presencial" ? "selected" : ""}`} onClick={() => setMethod("presencial")}>
                <div className="payment-option-icon">🎁</div>
                <div className="payment-option-title">Presentear pessoalmente</div>
                <div className="payment-option-desc">Reserva em seu nome</div>
              </div>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <div className={`payment-option ${method === "outro" ? "selected" : ""}`} onClick={() => setMethod("outro")}>
                <div className="payment-option-icon">🛍️</div>
                <div className="payment-option-title">Comprar em outra loja</div>
                <div className="payment-option-desc">Trago o presente no dia</div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              {method === "pix" ? "Após informar seus dados, você verá o QR Code para pagamento." : "Seu presente será reservado em seu nome."}
            </p>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Maria" />
              </div>
              <div className="form-group">
                <label className="form-label">Sobrenome</label>
                <input className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Silva" />
              </div>
            </div>
          </>
        )}

        {/* Step 3: QR Code */}
        {step === 3 && (
          <>
            <p style={{ fontSize: "0.88rem", color: "var(--mid)", marginBottom: "1rem" }}>
              Escaneie o QR Code abaixo para realizar o Pix no valor de <strong>{fmt(gift.price)}</strong>.
            </p>
            <div style={{ textAlign: "center" }}>
              {qrCode
                ? <img src={qrCode} alt="QR Code Pix" style={{ width: 180, height: 180, borderRadius: 12, border: "1px solid var(--border)" }} />
                : <div className="qr-preview"><div className="qr-placeholder">QR Code não configurado</div></div>
              }
              <p style={{ fontSize: "0.78rem", color: "var(--light)", marginTop: "0.75rem" }}>
                Após o pagamento, clique em "Confirmar" abaixo.
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
          {step > 1 && (
            <button className="btn btn-outline" onClick={() => setStep(s => s - 1)} style={{ flex: "0 0 auto" }}>
              Voltar
            </button>
          )}
          <button
            className="btn btn-gold"
            style={{ flex: 1 }}
            onClick={handleContinue}
            disabled={step === 1 && !method}
          >
            {step === 2 && method !== "pix" ? "Reservar Presente" : step === 3 ? "Confirmar Pagamento" : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Gift Form Modal ──────────────────────────────────────────────────────────
function GiftFormModal({ gift, onClose, onSave }) {
  const [form, setForm] = useState({
    name: gift?.name || "",
    description: gift?.description || "",
    price: gift?.price || "",
    link: gift?.link || "",
    emoji: gift?.emoji || "🎁",
    imageUrl: gift?.imageUrl || "",
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name || !form.price) return;
    onSave({ ...form, price: parseFloat(String(form.price).replace(",", ".")) });
  };

  const emojis = ["🎁","🍳","🛏️","📺","☕","🫙","🌀","🥗","🎂","🪴","🍽️","🏺","🕯️","🪑","🛁","🎨","📚","🎵","🌿","💐"];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 540 }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title font-display">{gift ? "Editar Presente" : "Adicionar Presente"}</div>
        <div className="modal-subtitle">Preencha os detalhes do item</div>

        <div className="form-group">
          <label className="form-label">Emoji / Ícone</label>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {emojis.map(e => (
              <button key={e} onClick={() => set("emoji", e)}
                style={{ width: 36, height: 36, border: `2px solid ${form.emoji === e ? "var(--gold)" : "var(--border)"}`, borderRadius: 8, background: form.emoji === e ? "var(--gold-pale)" : "var(--white)", cursor: "pointer", fontSize: "1.1rem" }}>
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nome do Presente *</label>
          <input className="form-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Jogo de Panelas Tramontina" />
        </div>

        <div className="form-group">
          <label className="form-label">Descrição</label>
          <textarea className="form-input" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Descreva o produto brevemente..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Preço (R$) *</label>
            <input className="form-input" type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0,00" min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label className="form-label">Link do Produto</label>
            <input className="form-input" value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">URL da Imagem (opcional)</label>
          <input className="form-input" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://..." />
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={handleSave} disabled={!form.name || !form.price}>
            {gift ? "Salvar Alterações" : "Adicionar Presente"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QR Config Modal ──────────────────────────────────────────────────────────
function QrConfigModal({ currentQr, onClose, onSave }) {
  const [url, setUrl] = useState(currentQr || "");
  const [inputType, setInputType] = useState("url"); // url | upload

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title font-display">Configurar QR Code Pix</div>
        <div className="modal-subtitle">Este código será exibido para os convidados realizarem pagamento</div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {[["url","URL da Imagem"], ["upload","Upload"]].map(([val, label]) => (
            <button key={val} className={`filter-chip ${inputType === val ? "active" : ""}`} onClick={() => setInputType(val)}>
              {label}
            </button>
          ))}
        </div>

        {inputType === "url" ? (
          <div className="form-group">
            <label className="form-label">URL da imagem do QR Code</label>
            <input className="form-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            <p style={{ fontSize: "0.75rem", color: "var(--light)", marginTop: "0.4rem" }}>
              Cole o link direto da imagem do seu QR Code Pix
            </p>
          </div>
        ) : (
          <div>
            <div className="qr-preview">
              <p style={{ fontSize: "0.82rem", color: "var(--mid)" }}>
                Para upload de imagem, utilize a URL do Firebase Storage ou outro serviço de hospedagem de imagens e cole a URL acima.
              </p>
            </div>
          </div>
        )}

        {url && (
          <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--light)", marginBottom: "0.5rem" }}>Prévia:</p>
            <img src={url} alt="QR Preview" style={{ maxWidth: 150, maxHeight: 150, borderRadius: 10, border: "1px solid var(--border)" }}
              onError={e => { e.target.style.display = "none"; }} />
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-gold" style={{ flex: 1 }} onClick={() => onSave(url)} disabled={!url}>
            Salvar QR Code
          </button>
        </div>
      </div>
    </div>
  );
}