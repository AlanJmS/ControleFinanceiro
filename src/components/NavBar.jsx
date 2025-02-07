import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";

function Navbar() {
  const { gastos, salario } = useGastos();

  const navigate = useNavigate();

  return (
    <nav id="navBar">
      <div id="icone">
        <NavLink to="/HomePage">
          <img
            src="icon.png"
            alt="simbolos relacionados a temática de orçamento"
            width={"60px"}
            height={"60px"}
          />
        </NavLink>
      </div>

      <NavLink to="/MainPage" className="link">
        Início
      </NavLink>

      <NavLink to="/Metas" className="link">Metas</NavLink>

      <NavLink to="/Gastos" state={{ gastos, salario }} className="link">
        Gastos
      </NavLink>

      <NavLink to="/Resume" state={{ gastos, salario }} className="link">
        Gráfico
      </NavLink>
    </nav>
  );
}

export default Navbar;
