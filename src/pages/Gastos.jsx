import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Gastos() {
  const { state } = useLocation();
  // Recebe os gastos e salário do estado passado pela navegação
  const { gastos: gastosFromState = [], salario } = state || {};
  const navigate = useNavigate();

  // Inicializa um estado local para os gastos, para permitir edição e remoção
  const [gastos, setGastos] = useState(gastosFromState);
  // Estado para controlar qual gasto está em modo de edição (por índice)
  const [editIndex, setEditIndex] = useState(null);

  // Mapeamento de cores para cada categoria
  const categoryColors = {
    alimentação: "#FFEEAA",
    transporte: "#AACCFF",
    saúde: "#FFCCCC",
    entretenimento: "#CCFFCC",
    geral: "#F0F0F0",
    "Categoria Indefinida": "#E0E0E0",
  };

  // Função para converter valores para número
  const converterParaNumero = (valor) => {
    return parseFloat(valor.toString().replace(',', '.'));
  };

  // Atualiza um gasto em edição
  const handleEditChange = (index, field, newValue) => {
    const updatedGastos = [...gastos];
    updatedGastos[index] = { ...updatedGastos[index], [field]: newValue };
    setGastos(updatedGastos);
  };

  // Função para apagar um gasto
  const handleDelete = (index) => {
    const updatedGastos = gastos.filter((_, i) => i !== index);
    setGastos(updatedGastos);
  };

  // Prepara os dados para o gráfico (converte os valores para números)
  const prepararDadosParaGrafico = () => {
    const salarioNumero = converterParaNumero(salario);
    const gastosConvertidos = gastos.map((gasto) => ({
      ...gasto,
      valor: converterParaNumero(gasto.valor),
    }));
    return {
      gastos: gastosConvertidos,
      salario: salarioNumero,
    };
  };

  return (
    <div>
      <h1>Lista de Gastos</h1>
      {gastos.length > 0 ? (
        gastos.map((gasto, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px',
              backgroundColor: categoryColors[gasto.tipo] || "#ffffff",
            }}
          >
            {editIndex === index ? (
              // Modo de edição: inputs para editar os campos do gasto
              <div>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={gasto.nome}
                    onChange={(e) =>
                      handleEditChange(index, 'nome', e.target.value)
                    }
                  />
                </label>
                <br />
                <label>
                  Data:
                  <input
                    type="date"
                    value={gasto.data}
                    onChange={(e) =>
                      handleEditChange(index, 'data', e.target.value)
                    }
                  />
                </label>
                <br />
                <label>
                  Categoria:
                  <select
                    value={gasto.tipo}
                    onChange={(e) =>
                      handleEditChange(index, 'tipo', e.target.value)
                    }
                  >
                    <option value="alimentação">Alimentação</option>
                    <option value="transporte">Transporte</option>
                    <option value="saúde">Saúde</option>
                    <option value="entretenimento">Entretenimento</option>
                    <option value="geral">Gastos gerais</option>
                  </select>
                </label>
                <br />
                <label>
                  Valor:
                  <input
                    type="number"
                    value={gasto.valor}
                    onChange={(e) =>
                      handleEditChange(index, 'valor', e.target.value)
                    }
                  />
                </label>
                <br />
                <button onClick={() => setEditIndex(null)}>Salvar</button>
              </div>
            ) : (
              // Modo de exibição: mostra os dados e os botões para editar e apagar
              <div>
                <p><strong>Nome:</strong> {gasto.nome}</p>
                <p><strong>Data:</strong> {gasto.data}</p>
                <p><strong>Categoria:</strong> {gasto.tipo}</p>
                <p><strong>Valor:</strong> R$ {gasto.valor}</p>
                <button onClick={() => setEditIndex(index)}>Editar</button>
                <button onClick={() => handleDelete(index)}>Apagar</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Nenhum gasto cadastrado.</p>
      )}

      {/* Botão para ver o gráfico de gastos */}
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
  );
}

export default Gastos;
