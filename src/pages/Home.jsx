import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function HomePage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState(localStorage.getItem("nome") || "");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("nome", nome);
    localStorage.setItem("salario", salario);
    navigate("/MainPage");
  };

  return (
    <main id="homePag">
      <div id="div-esq"></div>
      <div id="div-form">
        <form onSubmit={handleSubmit} className="formulario">
          <h2>Seja bem-vindo ao seu assistente orçamental!</h2>

          <div className="form-group">
            <label htmlFor="nome">Nome: </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="profissao">Profissão: </label>
            <input
              type="text"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="salario">Salário: </label>
            <input
              type="number"
              min={1}
              id="salario"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              required
            />
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </main>
  );
}

export default HomePage;