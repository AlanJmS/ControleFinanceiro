import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useGastos } from "../context/GastosContext";

function MainPage() {
  const { gastos, adicionarGasto, limparGastos } = useGastos();

  const location = useLocation();

  const navigate = useNavigate();

  const [nome, setNome] = useState(() => {
    return localStorage.getItem("nome") || location.state?.nome || "";
  });

  const [salarioInput, setSalario] = useState(() => {
    return localStorage.getItem("salario") || location.state?.salario || "";
  });

  const [gasto, setGasto] = useState({
    nome: "",
    data: "",
    tipo: "alimentação",
    valor: "",
  });

  useEffect(() => {
    if (nome) localStorage.setItem("nome", nome);
    if (salarioInput) localStorage.setItem("salario", salarioInput);
  }, [nome, salarioInput]);

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

    adicionarGasto(novoGasto);

    setGasto({
      nome: "",
      data: "",
      tipo: "alimentação",
      valor: "",
    });
  };

  const prepararDadosParaGrafico = () => {
    const salarioNumero = converterParaNumero(salarioInput);
    const gastosConvertidos = gastos.map((gasto) => ({
      ...gasto,
      valor: converterParaNumero(gasto.valor),
    }));

    return {
      gastos: gastosConvertidos,
      salario: salarioNumero,
    };
  };

  const handleGrafico = () => {
    const dadosParaGrafico = prepararDadosParaGrafico();
    navigate("/Resume", { state: dadosParaGrafico });
  };

  const handleVerGastos = () => {
    navigate("/Gastos", { state: { gastos, salarioInput } });
  };

  return (
    <section>
      <div id="pagPrincipal">
        <h1>Detalhes do Usuário</h1>
        <div>
          <p>Bem-vindo, {nome}!</p>
          <p>Salário: R${salarioInput}</p>
        </div>
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
        </form>
      </div>

      <div id="lista-gastos">
        <h2>Lista de Gastos</h2>
        {gastos.length > 0 ? (
          <ul>
            {gastos.map((gasto, index) => (
              <li key={index}>
                <strong>{gasto.nome}</strong> - {gasto.tipo} - R${gasto.valor} -{" "}
                {gasto.data}
              </li>
            ))}
          </ul>
        ) : (
          <p>Não há gastos cadastrados.</p>
        )}
      </div>

      <div id="acoes">
        <button onClick={handleGrafico}>Gerar Gráfico</button>
        <button onClick={handleVerGastos}>Ver Gastos</button>
        <button onClick={() => limparGastos()}>Limpar Gastos</button>
      </div>
    </section>
  );
}

export default MainPage;
