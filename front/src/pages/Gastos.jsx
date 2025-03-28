import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import "./Gastos.css";
import { FaEdit, FaSave, FaTrash, FaWindowClose } from 'react-icons/fa';
import Button from "../components/Button";
import Message from "../components/Message";

function Gastos() {
  const { carteiraId } = useParams();
  const {
    gastos,
    fetchGastos,
    editarGasto,
    deletarGasto,
    deletarMultiplosGastos,
    isLoading,
    error
  } = useGastos();

  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [editGasto, setEditGasto] = useState({ name: "", amount: "", category: "", date: "" });
  const [editGasto, setEditGasto] = useState({ name: "", amount: "", category: "", date: "" });
  const [selected, setSelected] = useState([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [localLoading, setLocalLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const location = useLocation();
  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  const loadGastos = useCallback(async () => {
    if (!carteiraId || dataLoaded) return;

    try {
      setLocalLoading(true);
      await fetchGastos(carteiraId);
      setDataLoaded(true);
    } catch (error) {
      console.error("Erro ao buscar gastos:", error);
      setProjectMessage("Erro ao carregar gastos.");
      setMessageType("error");
    } finally {
      setLocalLoading(false);
    }
  }, [carteiraId, fetchGastos, dataLoaded]);

  useEffect(() => {
    loadGastos();
    const timer = setTimeout(() => {
      setProjectMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [loadGastos]);

  const handleDelete = async (gastoId) => {
    try {
      setLocalLoading(true);
      const result = await deletarGasto(gastoId, carteiraId);

      if (result.success) {
        setProjectMessage("Gasto deletado com sucesso!");
        setMessageType("success");
        setSelected([]);
      } else {
        setProjectMessage("Erro ao deletar gasto: " + (result.error || ""));
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro ao deletar gasto:", error);
      setProjectMessage("Erro ao deletar gasto: " + (error.message || ""));
      setMessageType("error");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;

    try {
      setLocalLoading(true);

      const selectedIds = selected.map(index => gastos[index].id);

      if (selectedIds.some(id => !id)) {
        throw new Error("Um ou mais gastos selecionados não possuem ID válido");
      }

      const result = await deletarMultiplosGastos(selectedIds, carteiraId);

      if (result.success) {
        setSelected([]);
        setProjectMessage(`${selectedIds.length} gasto(s) deletado(s) com sucesso!`);
        setMessageType("success");
      } else {
        setProjectMessage("Erro ao deletar gastos: " + (result.error || ""));
        setMessageType("error");
      }
    } catch (error) {
      console.error("Erro ao deletar múltiplos gastos:", error);
      setProjectMessage("Erro ao deletar gastos: " + (error.message || ""));
      setMessageType("error");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    const gasto = gastos[index];
    const date = new Date(gasto.date);
    const formattedDate = date.toISOString().split('T')[0];

    setEditGasto({
      id: gasto.id,
      name: gasto.name,
      amount: gasto.amount,
      category: gasto.category,
      date: formattedDate,
      walletId: Number(carteiraId)
    });
  };

  const handleSaveEdit = async (index) => {
    try {
      setLocalLoading(true);
      const gastoId = gastos[index].id;
      const result = await editarGasto(gastoId, editGasto);

      if (result.success) {
        setEditIndex(null);
        setProjectMessage("Gasto editado com sucesso!");
        setMessageType("success");
      } else {
        setProjectMessage("Erro ao editar gasto: " + (result.error || ""));
        setMessageType("error");
      }
    } finally {
      setLocalLoading(false);
    }
  };
  console.log(editGasto);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditGasto({ ...editGasto, [name]: value });
  };

  const categoryColors = {
    Alimentação: "#388E3C",
    Transporte: "#42A5F5",
    Saúde: "#4FC3F7",
    Entretenimento: "#AB47BC",
    Geral: "#B0BEC5",
  };

  const formateDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const renderContent = () => {
    if (localLoading && gastos.length === 0) {
      return <p className="loading-message">Carregando gastos...</p>;
    }

    return (
      <div className="table__container">
        <table>
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Gasto</th>
              <th style={{ width: "25%" }}>Data</th>
              <th style={{ width: "20%" }}>Categoria</th>
              <th style={{ width: "20%" }}>Valor</th>
              <th colSpan={2}>Ações</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {selected.length > 0 && (
              <tr>
                <td colSpan={6}></td>
                <td style={{ textAlign: "right" }}>
                  <FaTrash
                    className="table__button trash"
                    onClick={handleDeleteSelected}
                    title="Excluir selecionados"
                  />
                </td>
              </tr>
            )}

            {gastos.length === 0 ? (
              <tr>
                <td colSpan={7}>Nenhum gasto cadastrado.</td>
              </tr>
            ) : (
              gastos.map((gasto, index) => (
                <tr key={gasto.id || index}>
                  {editIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editGasto.name}
                          name="name"
                          value={editGasto.name}
                          onChange={handleChange}
                          className="edit-input"
                          placeholder="Gasto"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={editGasto.date}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <select
                          name="category"
                          value={editGasto.category}
                          name="category"
                          value={editGasto.category}
                          onChange={handleChange}
                          className="edit-input"
                        >
                          <option value="Alimentação">Alimentação</option>
                          <option value="Transporte">Transporte</option>
                          <option value="Saúde">Saúde</option>
                          <option value="Entretenimento">Entretenimento</option>
                          <option value="Geral">Geral</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="amount"
                          value={editGasto.amount}
                          name="amount"
                          value={editGasto.amount}
                          onChange={handleChange}
                          className="edit-input"
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td>
                        <FaSave
                          onClick={() => handleSaveEdit(index)}
                          className="table__button"
                          title="Salvar"
                        />
                      </td>
                      <td>
                        <FaWindowClose
                          onClick={() => setEditIndex(null)}
                          className="table__button trash"
                          title="Cancelar"
                        />
                      </td>
                      <td></td>
                    </>
                  ) : (
                    <>
                      <td>{gasto.name}</td>
                      <td>{formateDate(gasto.date)}</td>
                      <td style={{ color: categoryColors[gasto.category] || "var(--textColor)" }}>
                        {gasto.category}
                      </td>
                      <td>{`R$ ${parseFloat(gasto.amount).toFixed(2)}`}</td>
                      <td>
                        <FaEdit
                          className="table__button"
                          onClick={() => handleEditClick(index)}
                          title="Editar"
                        />
                      </td>
                      <td>
                        <FaTrash
                          className="table__button trash"
                          onClick={() => handleDelete(gasto.id)}
                          title="Excluir"
                        />
                      </td>
                      <td>
                        <input
                          style={{ cursor: "pointer" }}
                          type="checkbox"
                          checked={selected.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                          title="Selecionar"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="costs__container">
      <div className="costs__header">
        <h2>Lista de Gastos</h2>
        <Button
          text="Novo gasto"
          customClass="blue second__hover"
          onClick={() => navigate("/CadastroGastos", { state: { walletId: carteiraId } })}
        />
      </div>
      {message && <Message type="success" text={message} />}
      {projectMessage && <Message type={messageType} text={projectMessage} />}
      {error && !localLoading && <Message type="error" text={error} />}

      {renderContent()}
    </div>
  );
}

export default Gastos;
