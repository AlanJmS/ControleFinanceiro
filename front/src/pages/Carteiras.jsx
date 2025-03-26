import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Carteiras.css";
import { FaPencilAlt, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import { createWallet, deleteWallet, editWallet, getWallets } from "../api/api";

export default function Carteiras() {
  const navigate = useNavigate();

  const [carteiras, setCarteiras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaCarteira, setNovaCarteira] = useState({ nome: "", participantes: "" });
  const [participantes, setParticipantes] = useState([]);
  const [editandoParticipante, setEditandoParticipante] = useState(null);


  const fetchCarteiras = async () => {
    try {
      const response = await getWallets();
      const allWallets = response.data.map(wallet => ({
        ...wallet,
        editando: false
      })) ;
      setCarteiras(allWallets);
    } catch (error) {
      console.error("Erro ao buscar carteiras:", error);
      alert("Erro ao buscar carteiras. Por favor, tente novamente.");
    }
  };

  const handleEditar = (id) => {
    setCarteiras((prevCarteiras) =>
      prevCarteiras.map((carteira) =>
        carteira.id === id ? { ...carteira, editando: true } : carteira
      )
    );
  };

  const handleSalvar = async (id, novoNome) => {
    try {
      const response = await editWallet(id, { name: novoNome });

      setCarteiras((prevCarteiras) => {
        return prevCarteiras.map((carteira) =>
          carteira.id === id
            ? { ...carteira, name: novoNome, editando: false }
            : carteira
        );
      });
      
    } catch (error) {
      console.error("Erro ao salvar alterações:", error.response?.data || error);
      alert(error.response?.data?.message || "Erro ao salvar alterações. Tente novamente.");
    }
  };

  const handleApagar = async (id) => {
    try {
      const response = await deleteWallet(id);

      setCarteiras((prevCarteiras) =>
        prevCarteiras.filter((carteira) => carteira.id !== id)
      );
      alert("Carteira apagada com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar carteira:", error.response?.data || error);
      alert(error.response?.data?.message || "Erro ao apagar carteira. Tente novamente.");
    }
  };

  const handleCriarCarteira = async () => {
    try {
      const response = await createWallet({
        name: novaCarteira.nome,
        balance: 0,
        users: participantes.map((participante) => ({ name: participante })),
      });

      const newWallet = {
        ...response.data,
        editando: false
      };

      setCarteiras((prevCarteiras) => [...prevCarteiras, newWallet]);
      setShowModal(false);
      setNovaCarteira({ nome: "", participantes: "" });
      setParticipantes([]);
    } catch (error) {
      console.error("Erro ao criar carteira:", error.response?.data || error);
      alert(error.response?.data?.message || "Erro ao criar carteira. Tente novamente.");
    }
  };

  const handleAdicionarParticipante = () => {
    if (novaCarteira.participantes.trim() !== "") {
      setParticipantes((prevParticipantes) => [
        ...prevParticipantes,
        novaCarteira.participantes.trim(),
      ]);
      setNovaCarteira({ ...novaCarteira, participantes: "" });
    }
  };

  const handleRemoverParticipante = (index) => {
    setParticipantes((prevParticipantes) =>
      prevParticipantes.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    fetchCarteiras();
  }, []);

  return (
    <section id="section-carteiras">
      <div className="header">
        <h1>Minhas Carteiras</h1>
        <button
          className="btn-criar-carteira"
          onClick={() => setShowModal(true)}
        >
          Criar Carteira
        </button>
      </div>

      <div className="carteiras-container">
        {carteiras.map((carteira) => (
          <div key={carteira.id} className="carteira-card">
            <div className="card-header">
              {carteira.editando ? (
                <input
                  type="text"
                  defaultValue={carteira.name}
                  onBlur={(e) => handleSalvar(carteira.id, e.target.value)}
                  autoFocus
                />
              ) : (
                <h2>{carteira.name}</h2>
              )}
              <div className="card-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditar(carteira.id)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleApagar(carteira.id)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <p>Valor: R$ {carteira.balance ? carteira.balance.toFixed(2) : "0.00"}</p>
            <button
              className="btn-detalhes"
              onClick={() => navigate(`/GastosCarteira/${carteira.id}`)}
            >
              Ver mais detalhes <span className="icn"><FaPlusCircle /></span>
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Criar Nova Carteira</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCriarCarteira();
              }}
            >
              <label>
                Nome da Carteira:
                <input
                  type="text"
                  value={novaCarteira.nome}
                  onChange={(e) =>
                    setNovaCarteira({ ...novaCarteira, nome: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Outros Participantes:
                <div className="add-participant">
                  <input
                    type="text"
                    value={novaCarteira.participantes}
                    onChange={(e) =>
                      setNovaCarteira({
                        ...novaCarteira,
                        participantes: e.target.value,
                      })
                    }
                    placeholder="Digite o e-mail do participante"
                  />
                  <button
                    type="button"
                    className="btn-add-participant"
                    onClick={handleAdicionarParticipante}
                  >
                    <FaPlusCircle />
                  </button>
                </div>
              </label>
              <div className="participants-list">
                {participantes.map((participante, index) => (
                  <div key={index} className="participant-item">
                    <p>{participante}</p>
                    <button
                      className="btn-delete-participant"
                      onClick={() => handleRemoverParticipante(index)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-save">
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}