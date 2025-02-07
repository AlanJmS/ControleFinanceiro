import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import Card from "../components/Card";

function Gastos() {
  const { state } = useLocation();
  const { gastos: gastosFromState = [], salario } = state || {};

  const [gastos, setGastos] = useState(gastosFromState);

  const handleDelete = (index) => {
    const updatedGastos = gastos.filter((_, i) => i !== index);
    setGastos(updatedGastos);
  };

  const handleEdit = (index) => {
    const editedGasto = prompt("Editar o nome do gasto:", gastos[index].nome);
    if (editedGasto) {
      const updatedGastos = [...gastos];
      updatedGastos[index].nome = editedGasto;
      setGastos(updatedGastos);
    }
  };

  const categoryColors = {
    alimentação: "#FFEEAA",
    transporte: "#AACCFF",
    saúde: "#FFCCCC",
    entretenimento: "#CCFFCC",
    geral: "#F0F0F0",
    "Categoria Indefinida": "#E0E0E0",
  };

  return (
    <div>
      <h1>Lista de Gastos</h1>
      {gastos.length > 0 ? (
        gastos.map((gasto, index) => (
          <div
            key={index}
            style={{
              backgroundColor: categoryColors[gasto.tipo] || "#ffffff",
              padding: "10px",
              margin: "10px",
              border: "1px solid #ccc",
            }}
          >
            <Card
              title={gasto.nome}
              date={gasto.data}
              categoria={gasto.tipo}
              valor={`R$ ${gasto.valor}`}
              onDelete={() => handleDelete(index)}
              onEdit={() => handleEdit(index)}
            />
          </div>
        ))
      ) : (
        <p>Nenhum gasto cadastrado.</p>
      )}
    </div>
  );
}

export default Gastos;
