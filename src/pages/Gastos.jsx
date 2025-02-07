import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Card from "../components/Card";
import "./Gastos.css";

function Gastos() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { gastos: gastosFromState = [], salario } = state || {};

  const [gastos, setGastos] = useState(gastosFromState);
  const [editIndex, setEditIndex] = useState(null);
  const [editGasto, setEditGasto] = useState({ nome: "", valor: "", tipo: "" });

  const handleDelete = (index) => {
    setGastos(gastos.filter((_, i) => i !== index));
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditGasto(gastos[index]);
  };

  const handleSaveEdit = (index) => {
    const updatedGastos = [...gastos];
    updatedGastos[index] = editGasto;
    setGastos(updatedGastos);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditGasto({ ...editGasto, [name]: name === "valor" ? parseFloat(value) : value });
  };

  const handleAtualizarGraficos = () => {
    navigate("/Resume", { state: { gastos, salario } });
  };

  const categoryColors = {
    alimentação: "#FFEEAA",
    Transporte: "#AACCFF",
    Saúde: "#FFCCCC",
    Entretenimento: "#CCFFCC",
    Geral: "#F0F0F0",
    "Categoria Indefinida": "#E0E0E0",
  };

  return (
    <div className="cards__container">
      <h2>Lista de Gastos</h2>
      <div className="cards">
        {gastos.length > 0 ? (
          gastos.map((gasto, index) => (
            <div key={index}>
              {editIndex === index ? (
                <div className="edit-card" style={{ backgroundColor: categoryColors[gasto.tipo] || "#ffffff" }}>
                  <input type="text" name="nome" value={editGasto.nome} onChange={handleChange} className="edit-input" />
                  <input type="number" name="valor" value={editGasto.valor} onChange={handleChange} className="edit-input" />
                  <select name="tipo" value={editGasto.tipo} onChange={handleChange} className="edit-input">
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Geral">Geral</option>
                  </select>
                  <div className="edit-buttons">
                    <button onClick={() => handleSaveEdit(index)} className="save-btn">Salvar</button>
                    <button onClick={() => setEditIndex(null)} className="cancel-btn">Cancelar</button>
                  </div>
                </div>
              ) : (
                <Card
                  title={gasto.nome}
                  date={gasto.data}
                  categoria={gasto.tipo}
                  valor={`R$ ${gasto.valor}`}
                  onDelete={() => handleDelete(index)}
                  onEdit={() => handleEditClick(index)}
                  color={categoryColors[gasto.tipo] || "#ffffff"}
                />
              )}
            </div>
          ))
        ) : (
          <p>Nenhum gasto cadastrado.</p>
        )}
      </div>

      {gastos.length > 0 && (
        <button onClick={handleAtualizarGraficos} className="update-graphs-btn">
          Atualizar Gráficos
        </button>
      )}
    </div>
  );
}

export default Gastos;
