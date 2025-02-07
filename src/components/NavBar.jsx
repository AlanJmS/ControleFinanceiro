import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext"; // Importando o contexto

function Navbar() {
  const { gastos, salario } = useGastos(); // Usando o contexto
  const navigate = useNavigate(); // Navegação programática

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

      {/* Usando NavLink para navegação e garantindo o estilo de página ativa */}
      <NavLink to="/MainPage" className="link">
        Início
      </NavLink>

      <NavLink
        to="/Gastos"
        state={{ gastos, salario }}
        className="link">
        Gastos
      </NavLink>

      <NavLink
        to="/Resume"
        state={{ gastos, salario }} // Passando os dados pelo contexto
        className="link"
      >
        Gráfico
      </NavLink>
    </nav>
  );
}

export default Navbar;
