import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [nome, setNome] = useState("");
  const [salario, setSalario] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/MainPage", {
      state: { nome, salario },
    });
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
            <input type="text" id="profissao" required />
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