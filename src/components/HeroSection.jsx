import logo from "../assets/logo.png";

export default function HeroSection({ stats }) {
  return (
    <div className="hero">
      <div className="body-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="hero-ornament">✦ ✦ ✦</div>
      <h1 className="hero-title font-display">
        Nossa Lista de<br />Presentes
      </h1>
      <div className="hero-divider" />
      <p className="hero-subtitle">Casamento · 30 de Janeiro de 2027</p>
      <p className="hero-desc">
        Cada presente escolhido com carinho será parte da nossa nova história
        juntos. Escolha um item e nos ajude a construir nosso lar com amor.
      </p>
    </div>
  );
}