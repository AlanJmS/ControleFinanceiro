import React, { useState } from "react";
import { useGastos } from "../context/GastosContext";
import "./Metas.css";

function Metas() {
  const { orcamentoTotal } = useGastos();
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState({ descricao: "", valor: "" });

  const handleChange = (e) => {
    setNovaMeta({ ...novaMeta, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!novaMeta.descricao || !novaMeta.valor) {
      alert("Preencha todos os campos!");
      return;
    }
    setMetas([
      ...metas,
      { ...novaMeta, valor: parseFloat(novaMeta.valor), status: "Pendente" },
    ]);
    setNovaMeta({ descricao: "", valor: "" });
  };

  const handleDelete = (index) => {
    setMetas(metas.filter((_, i) => i !== index));
  };

  const handleToggleStatus = (index) => {
    const updatedMetas = [...metas];
    updatedMetas[index].status =
      updatedMetas[index].status === "Pendente" ? "Concluída" : "Pendente";
    setMetas(updatedMetas);
  };

  return (
    <div className="container-metas">
      <h1>Metas Financeiras</h1>
      <div className="metas-grid">
        <div className="coluna-info-form">
          <p>
            Seu orçamento total: <strong>R$ {orcamentoTotal.toFixed(2)}</strong>
          </p>
          <form className="form-metas" onSubmit={handleSubmit}>
            <label>
              Descrição da Meta:
              <textarea
                name="descricao"
                value={novaMeta.descricao}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Valor da Meta (R$):
              <input
                type="number"
                name="valor"
                value={novaMeta.valor}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Adicionar Meta</button>
          </form>
        </div>

        <div className="lista-metas">
          <h2>Lista de Metas</h2>
          {metas.length > 0 ? (
            <ul>
              {metas.map((meta, index) => (
                <li
                  key={index}
                  className={meta.status === "Concluída" ? "concluida" : "pendente"}
                >
                  <div className="meta-info">
                    <strong>{meta.descricao}</strong>
                    <span>R$ {meta.valor.toFixed(2)}</span>
                    <span> {meta.status}</span>
                  </div>
                  <button onClick={() => handleToggleStatus(index)}>
                    {meta.status === "Pendente" ? "Concluir" : "Reabrir"}
                  </button>
                  <button onClick={() => handleDelete(index)}>Remover</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma meta cadastrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Metas;