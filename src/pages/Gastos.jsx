import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import Card from "../components/Card";
import "./Gastos.css";

function Gastos() {
  const { gastos, editarGasto } = useGastos();
  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [editGasto, setEditGasto] = useState({ nome: "", valor: "", tipo: "" });

  const handleDelete = (index) => {
    const updatedGastos = gastos.filter((_, i) => i !== index);
    editarGasto(index, updatedGastos);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditGasto(gastos[index]);
  };

  const handleSaveEdit = (index) => {
    editarGasto(index, editGasto);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditGasto({ ...editGasto, [name]: value });
  };

  const categoryColors = {
    Alimentação: "#FFEEAA",
    Transporte: "#AACCFF",
    Saúde: "#FFCCCC",
    Entretenimento: "#CCFFCC",
    Geral: "#F0F0F0",
  };

  return (
    <div className="cards__container">
      <h2>Lista de Gastos</h2>
      <div className="cards">
        {gastos.length > 0 ? (
          gastos.map((gasto, index) => (
            <div key={index}>
              {editIndex === index ? (
                <div
                  className="edit-card"
                  style={{ backgroundColor: categoryColors[gasto.tipo] || "#ffffff" }}
                >
                  <input
                    type="text"
                    name="nome"
                    value={editGasto.nome}
                    onChange={handleChange}
                    className="edit-input"
                  />
                  <input
                    type="number"
                    name="valor"
                    value={editGasto.valor}
                    onChange={handleChange}
                    className="edit-input"
                  />
                  <select
                    name="tipo"
                    value={editGasto.tipo}
                    onChange={handleChange}
                    className="edit-input"
                  >
                    <option value="Alimentação">Alimentação</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Entretenimento">Entretenimento</option>
                    <option value="Geral">Geral</option>
                  </select>
                  <div className="edit-buttons">
                    <button onClick={() => handleSaveEdit(index)} className="save-btn">
                      Salvar
                    </button>
                    <button onClick={() => setEditIndex(null)} className="cancel-btn">
                      Cancelar
                    </button>
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
        <button onClick={() => navigate("/Resume")} className="update-graphs-btn">
          Atualizar Gráficos
        </button>
      )}
    </div>
  );
}

export default Gastos;