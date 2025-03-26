import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const userName = localStorage.getItem("nome");
  const [active, setActive] = useState("/MainPage");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleActiveLink = (link) => setActive(link);
  const handleMenuStats = () => setMenuOpen(!menuOpen);

  return (
    <nav id="navBar">
      <div id="logo">
        <NavLink to="/MainPage">
          Logo
        </NavLink>
      </div>

      <div id="nav-link">
        <NavLink to="/MainPage" onClick={handleActiveLink} className={active === "MainPage" ? "active" : ""}>
          Início
        </NavLink>
        <NavLink to="/Gastos" onClick={handleActiveLink} className={active === "MainPage" ? "active" : ""}>
          Gastos
        </NavLink>
        <NavLink to="/Metas" onClick={handleActiveLink} className={active === "Metas" ? "active" : ""}>
          Metas
        </NavLink>
      </div>

      <div id="user__info">
        <FaUserCircle />
        {userName}
        <FaAngleDown onClick={handleMenuStats} />
        {menuOpen ? (
          <div id="user__menu">
            <NavLink to="/Perfil">Conta</NavLink>
            <NavLink to="/" onClick={localStorage.removeItem("token")}>Mudar conta</NavLink>
          </div>
        ) : ""}
      </div>
    </nav>
  );
}

export default Navbar;