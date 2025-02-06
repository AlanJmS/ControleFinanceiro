import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2025 Gerenciador de finanças</p>
        
        <nav className="footer-links">
          <Link to="/privacy">Política de Privacidade</Link>
          <Link to="/contact">Contato</Link>
          <Link to="/about">Sobre</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;