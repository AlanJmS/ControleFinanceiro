import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function MainPage() {
  const { state } = useLocation();
  const { nome, salario } = state || {};
  const navigate = useNavigate();

  const [gastosList, setGastosList] = useState([]);

  const [gasto, setGasto] = useState({
    nome: "",
    data: "",
    tipo: "alimentação",
    valor: "",
  });

  const converterParaNumero = (valor) => {
    return parseFloat(valor.toString().replace(",", "."));
  };

  const handleChange = (e) => {
    setGasto({ ...gasto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gasto.nome || !gasto.data || !gasto.valor) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const valorNumerico = converterParaNumero(gasto.valor);
    const novoGasto = {
      ...gasto,
      valor: valorNumerico.toFixed(2),
    };

    setGastosList([...gastosList, novoGasto]);

    setGasto({
      nome: "",
      data: "",
      tipo: "alimentação",
      valor: "",
    });
  };

  const prepararDadosParaGrafico = () => {
    const salarioNumero = converterParaNumero(salario);

    const gastosConvertidos = gastosList.map((gasto) => ({
      ...gasto,
      valor: converterParaNumero(gasto.valor),
    }));

    return {
      gastos: gastosConvertidos,
      salario: salarioNumero,
    };
  };

  return (
    <section>
      <div id="pagPrincipal">
        <h1>Detalhes do Usuário</h1>
        {nome && salario ? (
          <div>
            <p>Bem-vindo, {nome}!</p>
            <p>Salário: R${salario}</p>
          </div>
        ) : (
          <p>Sem dados para exibir.</p>
        )}
      </div>

      <div id="form-gastos">
        <h2>Cadastro de Gastos</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nome do Gasto:
            <input
              type="text"
              name="nome"
              value={gasto.nome}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Data do Gasto:
            <input
              type="date"
              name="data"
              value={gasto.data}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Tipo do Gasto:
            <select name="tipo" value={gasto.tipo} onChange={handleChange}>
              <option value="alimentação">Alimentação</option>
              <option value="transporte">Transporte</option>
              <option value="saúde">Saúde</option>
              <option value="entretenimento">Entretenimento</option>
              <option value="geral">Gastos gerais</option>
            </select>
          </label>
          <label>
            Valor do Gasto:
            <input
              type="number"
              name="valor"
              value={gasto.valor}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Cadastrar Gasto</button>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid #ccc",
            }}
          >
            <h4>Gastos Cadastrados:</h4>
            {gastosList.length > 0 ? (
              gastosList.map((gasto, index) => (
                <div
                  key={index}
                  style={{
                    padding: "5px",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <p>
                    <strong>{gasto.nome}</strong> - R${gasto.valor} (
                    {gasto.tipo})
                  </p>
                </div>
              ))
            ) : (
              <p>Nenhum gasto cadastrado ainda.</p>
            )}
          </div>
        </form>

        <button
          onClick={() =>
            navigate("/gastos", { state: { gastos: gastosList, salario } })
          }
          style={{ marginTop: "20px", marginRight: "10px" }}
        >
          Ver Todos os Gastos
        </button>

        <button
          onClick={() => {
            const dadosParaGrafico = prepararDadosParaGrafico();
            navigate("/resume", { state: dadosParaGrafico });
          }}
          style={{ marginTop: "20px" }}
        >
          Ver Gráfico de Gastos
        </button>
      </div>
    </section>
      );
    }
    
    export default MainPage;

