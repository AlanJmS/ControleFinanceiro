import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Pegando os dados passados
import Card from '../components/Card';  // Importando o componente de Card

function Gastos() {
  const { state } = useLocation();
  const { gastos: gastosFromState = [], salario } = state || {}; // Recebe os dados de gastos e salário
  const [gastos, setGastos] = useState(gastosFromState);

  const handleDelete = (index) => {
    const updatedGastos = gastos.filter((_, i) => i !== index);
    setGastos(updatedGastos);
  };

  const handleEdit = (index) => {
    // Lógica para edição do gasto
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
    <div style={{padding: '10px'}}>
      <h2>Lista de Gastos</h2>
      <div style={{
            display: "flex",
            gap: '20px',
            padding: '10px'
          }}>
        {gastos.length > 0 ? (
          gastos.map((gasto, index) => (
            <div key={index} >
              <Card
                title={gasto.nome}
                date={gasto.data}
                categoria={gasto.tipo}
                valor={`R$ ${gasto.valor}`}
                onDelete={() => handleDelete(index)}
                onEdit={() => handleEdit(index)}
                color={categoryColors[gasto.tipo] || "#ffffff"}
              />
            </div>
          ))
        ) : (
          <p>Nenhum gasto cadastrado.</p>
        )}
      </div>
    </div>
  );
}

export default Gastos;
