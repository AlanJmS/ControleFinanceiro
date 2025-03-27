import React, { useState } from "react";
import { useGastos } from "../context/GastosContext";
import "./CadastroGastos.css";
import Button from "../components/Button";
import { useNavigate,useLocation, data } from "react-router-dom";
import {createCost} from "../api/api"

function CadastroGastos() {
  const location = useLocation();   
  const {walletId} = location.state || {};
  const { adicionarGasto } = useGastos();
  const navigate = useNavigate();

  const [gasto, setGasto] = useState({
    name: "",
    date: "",
    category: "",
    amount: "",
  });
  // console.log(gasto);

  const handleChange = (e) => {
    setGasto({ ...gasto, [e.target.name]: e.target.value });
  };
  const dateObj = new Date(gasto.date+":00");
  dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
  const formatedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!gasto.name || !gasto.date || !gasto.amount) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    
    const novoGasto = {
      ...gasto,
      date: formatedDate,
      walletId:parseInt(walletId),
      amount: parseFloat(gasto.amount).toFixed(2),
    };

    createCost(novoGasto);
    navigate(`/gastos/${walletId}`, { state: { message: "Gasto adicionado com sucesso!" } });

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
              name="name"
              value={gasto.name}
              onChange={handleChange}
              required
            />

            <input
              type="datetime-local"
              name="date"
              value={gasto.date}
              onChange={handleChange}
              required
            />

            <label>Tipo do Gasto:</label>
            <select name="category"  defaultValue="default" onChange={handleChange}>
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
              name="amount"
              value={gasto.amount}
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
