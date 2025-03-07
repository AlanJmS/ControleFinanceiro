import React, { useState } from "react";
import { useGastos } from "../context/GastosContext";
import "./CadastroGastos.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

function CadastroGastos() {
  const { adicionarGasto } = useGastos();
  const navigate = useNavigate();

  const [gasto, setGasto] = useState({
    nome: "",
    data: "",
    tipo: "",
    valor: "",
  });

  const handleChange = (e) => {
    setGasto({ ...gasto, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gasto.nome || !gasto.data || !gasto.valor) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const novoGasto = {
      ...gasto,
      valor: parseFloat(gasto.valor).toFixed(2),
    };

    adicionarGasto(novoGasto);
    navigate("/gastos", { state: { message: "Gasto adicionado com sucesso!" } });

    setGasto({
      nome: "",
      data: "",
      tipo: "",
      valor: "",
    });
  };

  return (
    <section className="container">
      <div id="gastos-div">
        <div id="img-gastos">
          <h3>
            Organize seus <span className="gastosH3">gastos</span> e tenha mais
            controle sobre suas finanças!
          </h3>
          <img src="/imgGastos.png" alt="" />
        </div>
        <div id="form-gastos">
          <form onSubmit={handleSubmit}>
            <h2>Cadastre os seus gastos!</h2>

            <input
            placeholder="Descrição"
              type="text"
              name="nome"
              value={gasto.nome}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="data"
              value={gasto.data}
              onChange={handleChange}
              required
            />

            <label>Tipo do Gasto:</label>
            <select name="tipo"  defaultValue="default" onChange={handleChange}>
              <option value="default" disabled >Selecionar</option>
              <option value="Alimentação">Alimentação</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Entretenimento">Entretenimento</option>
              <option value="Geral">Geral</option>
            </select>

            <input
            placeholder="Valor"
              type="number"
              name="valor"
              value={gasto.valor}
              onChange={handleChange}
              required
            />

            <Button text="Cadastrar Gasto" type="submit" customClass="blue" />
          </form>
        </div>
      </div>
    </section>
  );
}

export default CadastroGastos;
