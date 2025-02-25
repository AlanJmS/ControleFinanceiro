import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import "./Gastos.css";
import { FaEdit, FaSave, FaTrash, FaWindowClose } from 'react-icons/fa';
import Button from "../components/Button";

function Gastos() {
  const { gastos, editarGasto, deletarGasto } = useGastos();
  const navigate = useNavigate();
  const [editIndex, setEditIndex] = useState(null);
  const [editGasto, setEditGasto] = useState({ nome: "", valor: "", tipo: "", data: "2025-02-24" });

  const handleDelete = (index) => {
    deletarGasto(index);
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
    Alimentação: "#388E3C",
    Transporte: "#42A5F5",
    Saúde: "#4FC3F7",
    Entretenimento: "#AB47BC",
    Geral: "#B0BEC5",
  };

  const formateDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="costs__container">
      <div className="costs__header">
        <h2>Lista de Gastos</h2>
        <Button
          text="Novo gasto"
          customClass="blue second__hover"
          onClick={() => navigate("/CadastroGastos")}
        />
      </div>
      <div className="table__container">
        <table>
          <thead>
            <tr>
              <th style={{width: "35%"}}>Gasto</th>
              <th style={{width: "25%"}}>Data</th>
              <th style={{width: "20%"}}>Categoria</th>
              <th style={{width: "20%"}}>Valor</th>
              <th colSpan={2}>Editar</th>
            </tr>
          </thead>

          <tbody>
            {gastos.length === 0 ? (
              <tr>
                <td colSpan={5}>Nenhum gasto cadastrado.</td>
              </tr>
            ) : (
              gastos.map((gasto, index) => (
                <tr key={index}>
                  {editIndex === index ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nome"
                          value={editGasto.nome}
                          onChange={handleChange}
                          className="edit-input"
                          placeholder="Gasto"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="data"
                          value={editGasto.data}
                          onChange={handleChange}
                          className="edit-input"
                          placeholder={formateDate(editGasto.data)}
                        />
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <input
                          type="number"
                          name="valor"
                          value={editGasto.valor}
                          onChange={handleChange}
                          className="edit-input"
                          placeholder={editGasto.valor}
                        />
                      </td>
                      <td>
                        <FaSave onClick={() => handleSaveEdit(index)} className="table__button" />
                      </td>
                      <td>
                        <FaWindowClose onClick={() => setEditIndex(null)} className="table__button trash" />
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{gasto.nome}</td>
                      <td>{formateDate(gasto.data)}</td>
                      <td style={{color: categoryColors[gasto.tipo] || "var(--textColor)"}}>{gasto.tipo}</td>
                      <td>{`R$ ${gasto.valor}`}</td>
                      <td>
                        <FaEdit className="table__button" onClick={() => handleEditClick(index)} />
                      </td>
                      <td>
                        <FaTrash className="table__button trash" onClick={() => handleDelete(index)} />
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Gastos;
