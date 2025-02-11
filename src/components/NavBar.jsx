import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

function Navbar() {
  return (
    <nav id="navBar">
      <NavLink to="/HomePage">
        <img src="logo.png" alt="Ícone da página" />
      </NavLink>

      <div id="nav-link">
        <NavLink to="/MainPage" className="link">
          Início
        </NavLink>
        <NavLink to="/Metas" className="link">
          Metas
        </NavLink>
        <NavLink to="/Gastos" className="link">
          Gastos
        </NavLink>
        <NavLink to="/Resume" className="link">
          Gráfico
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;