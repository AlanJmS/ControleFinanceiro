import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { useGastos } from "../context/GastosContext";

function Navbar() {
  const [active, setActive] = useState("/MainPage");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useGastos();
  const navigate = useNavigate();
  
  const handleActiveLink = (link) => setActive(link);
  const handleMenuStats = () => setMenuOpen(!menuOpen);
  const userName = user.name || "Usuário";
  
  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };
  
  return (
    <nav id="navBar">
      <div id="logo">
        <NavLink to="/MainPage">
          Logo
        </NavLink>
      </div>

      <div id="nav-link">
        <NavLink to="/MainPage" onClick={() => handleActiveLink("MainPage")} className={active === "MainPage" ? "active" : ""}>
          Início
        </NavLink>
        <NavLink to="/Carteiras" onClick={() => handleActiveLink("Carteiras")} className={active === "Carteiras" ? "active" : ""}>
          Carteiras
        </NavLink>
        <NavLink to="/Metas" onClick={() => handleActiveLink("Metas")} className={active === "Metas" ? "active" : ""}>
          Metas
        </NavLink>
      </div>

      <div id="user__info">
        <FaUserCircle />
        {userName}
        <FaAngleDown onClick={handleMenuStats} />
        {menuOpen && (
          <div id="user__menu">
            <NavLink to="/Perfil" onClick={() => setMenuOpen(false)}>Conta</NavLink>
            <button 
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                padding: "8px 16px",
                fontSize: "inherit"
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;