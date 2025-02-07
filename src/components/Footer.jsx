import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-links">
        <Link to="/privacy">Política de Privacidade</Link>
        <Link to="/contact">Termos de uso</Link>
        <Link to="/about">Fale conosco</Link>
      </nav>
      <div className="footer-container">
        <p>Alan | Iago - 2025. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
