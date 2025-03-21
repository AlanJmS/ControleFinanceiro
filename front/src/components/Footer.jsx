import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <nav className="footer-links">
          <ul>
            <li>
              <a href="#">Política de privacidade</a>
            </li>
            <li>
              <a href="#">Termos de uso</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </nav>

        <p>&copy; Alan | Iago - 2025. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
