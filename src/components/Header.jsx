import logo from "../assets/logo.png";

export default function Header({ view, setView, isAdmin, onLogout }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div>
          <div className="header-title font-display">Lista de Presentes</div>
          <div className="header-subtitle">Cecília &amp; Thiago · 30 Jan 2027</div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${view === "gallery" ? "active" : ""}`}
          onClick={() => setView("gallery")}
        >
          Presentes
        </button>

        {isAdmin ? (
          <>
            <button
              className={`nav-tab admin ${view === "admin" ? "active" : ""}`}
              onClick={() => setView("admin")}
            >
              Painel Admin
            </button>
            <button className="nav-tab" onClick={onLogout}>
              Sair
            </button>
          </>
        ) : (
          <button
            className={`nav-tab admin ${view === "admin-login" ? "active" : ""}`}
            onClick={() => setView("admin-login")}
          >
            Admin
          </button>
        )}
      </nav>
    </header>
  );
}