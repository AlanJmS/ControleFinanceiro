import React, { useState, useEffect } from "react";

function Metas() {
  const [salario, setSalario] = useState(0);
  const [metas, setMetas] = useState([]);
  const [novaMeta, setNovaMeta] = useState({ descricao: "", valor: "" });

  useEffect(() => {
    const salarioSalvo = localStorage.getItem("salario");
    if (salarioSalvo) {
      setSalario(parseFloat(salarioSalvo));
    }
  }, []);

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
    <div>
      <h1>Metas Financeiras</h1>
      <p>Seu salário atual: R$ {salario.toFixed(2)}</p>

      <form onSubmit={handleSubmit}>
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

      <h2>Lista de Metas</h2>
      {metas.length > 0 ? (
        <ul>
          {metas.map((meta, index) => (
            <li
              key={index}
              style={{
                padding: "10px",
                margin: "5px",
                border: "1px solid #ccc",
              }}
            >
              <strong>{meta.descricao}</strong> - R$ {meta.valor.toFixed(2)} -
              Status: {meta.status}
              <button onClick={() => handleToggleStatus(index)}>
                {meta.status === "Pendente" ? "Concluída" : "Pendente"}
              </button>
              <button onClick={() => handleDelete(index)}>Remover</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma meta cadastrada.</p>
      )}
    </div>
  );
}

export default Metas;
