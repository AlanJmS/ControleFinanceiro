import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import "./NavBar.css";

function Navbar() {
  const { gastos, salario } = useGastos();

  const navigate = useNavigate();

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

        <NavLink to="/Gastos" state={{ gastos, salario }} className="link">
          Gastos
        </NavLink>

        <NavLink to="/Resume" state={{ gastos, salario }} className="link">
          Gráfico
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
