import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import './MainPage.css';

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
    <section id="section-main">
    {/* Coluna Esquerda */}
    <div className="container">
      <div className="detalhes-usuario">
        <h1>Detalhes do Usuário</h1>
        <p>Bem-vindo, {nome}!</p>
        <p>Salário: R$ {salarioInput}</p>
      </div>
  
      <div className="form-gastos">
        <h2>Cadastro de Gastos</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Gasto:</label>
            <input
              type="text"
              name="nome"
              value={gasto.nome}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Data do Gasto:</label>
            <input
              type="date"
              name="data"
              value={gasto.data}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="form-group">
            <label>Tipo do Gasto:</label>
            <select name="tipo" value={gasto.tipo} onChange={handleChange}>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Entretenimento">Entretenimento</option>
              <option value="Geral">Gastos gerais</option>
            </select>
          </div>
  
          <div className="form-group">
            <label>Valor do Gasto:</label>
            <input
              type="number"
              name="valor"
              value={gasto.valor}
              onChange={handleChange}
              required
            />
          </div>
  
          <button type="submit">Cadastrar Gasto</button>
        </form>
      </div>
    </div>
  
    {/* Coluna Direita */}
    <div className="section-gastos">
      <div id="lista-gastos">
        <h2>Lista de Gastos</h2>
        {gastos.length > 0 ? (
          <ul>
          {gastos.map((gasto, index) => (
            <li key={index}>
              <strong>{gasto.nome}</strong>
              <span>{gasto.tipo}</span>
              <p>R${gasto.valor}</p>
              <span>{gasto.data}</span>
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
    </div>
  </section>
  
  );
}

export default MainPage;
