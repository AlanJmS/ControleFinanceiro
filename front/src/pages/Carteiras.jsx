import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Carteiras.css";
import { FaPencilAlt, FaTrashAlt, FaPlusCircle, FaUserEdit } from "react-icons/fa";
import { createWallet, deleteWallet, editWallet, getWallets, addUserToWallet, removeUserFromWallet, getWallet } from "../api/api";

export default function Carteiras() {
  const navigate = useNavigate();
  const [carteiras, setCarteiras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' ou 'edit'
  const [currentWallet, setCurrentWallet] = useState(null);
  const [novaCarteira, setNovaCarteira] = useState({ 
    name: "", 
    balance: 0,
    userEmails: [] 
  });
  const [emailParticipante, setEmailParticipante] = useState("");
  const [walletUsers, setWalletUsers] = useState([]);

  const fetchCarteiras = async () => {
    try {
      const response = await getWallets();
      setCarteiras(response.data);
    } catch (error) {
      console.error("Erro ao buscar carteiras:", error);
      alert("Erro ao buscar carteiras. Por favor, tente novamente.");
    }
  };

  const openCreateModal = () => {
    setModalType('create');
    setNovaCarteira({ name: "", balance: 0, userEmails: [] });
    setShowModal(true);
  };

  const openEditModal = async (walletId) => {
    try {
      setModalType('edit');
      const response = await getWallet(walletId);
      const wallet = response.data;
      setCurrentWallet(wallet);
      
      // Extrai os emails dos usuários associados
      const users = wallet.usersWallet.map(uw => uw.user.email);
      setWalletUsers(users);
      setShowModal(true);
    } catch (error) {
      console.error("Erro ao buscar carteira:", error);
      alert("Erro ao buscar informações da carteira.");
    }
  };

  const handleEditar = (id) => {
    setCarteiras(prevCarteiras =>
      prevCarteiras.map(carteira =>
        carteira.id === id ? { ...carteira, editando: true } : carteira
      )
    );
  };

  const handleSalvar = async (id, novoNome) => {
    try {
      await editWallet(id, { name: novoNome });
      setCarteiras(prevCarteiras =>
        prevCarteiras.map(carteira =>
          carteira.id === id ? { ...carteira, name: novoNome, editando: false } : carteira
        )
      );
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      alert(error.response?.data?.message || "Erro ao salvar alterações.");
    }
  };

  const handleApagar = async (id) => {
    try {
      await deleteWallet(id);
      setCarteiras(prevCarteiras => prevCarteiras.filter(carteira => carteira.id !== id));
      alert("Carteira apagada com sucesso!");
    } catch (error) {
      console.error("Erro ao apagar carteira:", error);
      alert(error.response?.data?.message || "Erro ao apagar carteira.");
    }
  };

  const handleCriarCarteira = async () => {
    try {
      await createWallet({
        name: novaCarteira.name,
        balance: novaCarteira.balance,
        userEmails: novaCarteira.userEmails
      });
      fetchCarteiras();
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao criar carteira:", error);
      alert(error.response?.data?.message || "Erro ao criar carteira.");
    }
  };

  const handleAdicionarParticipante = async () => {
    if (!emailParticipante.trim()) return;
    
    try {
      if (modalType === 'create') {
        if (!novaCarteira.userEmails.includes(emailParticipante.trim())) {
          setNovaCarteira(prev => ({
            ...prev,
            userEmails: [...prev.userEmails, emailParticipante.trim()]
          }));
        }
      } else if (modalType === 'edit') {
      await addUserToWallet(currentWallet.id, emailParticipante.trim());
            setWalletUsers(prev => [...prev, emailParticipante.trim()]);      }
      setEmailParticipante("");
    } catch (error) {
      console.error("Erro ao adicionar participante:", error);
      alert(error.response?.data?.message || "Erro ao adicionar participante.");
    }
  };

  const handleRemoverParticipante = async (email) => {
    try {
      if (modalType === 'create') {
        setNovaCarteira(prev => ({
          ...prev,
          userEmails: prev.userEmails.filter(e => e !== email)
        }));
      } else if (modalType === 'edit') {
        await removeUserFromWallet(currentWallet.id, email);
        setWalletUsers(prev => prev.filter(e => e !== email));
      }
    } catch (error) {
      console.error("Erro ao remover participante:", error);
      alert(error.response?.data?.message || "Erro ao remover participante.");
    }
  };

  useEffect(() => {
    fetchCarteiras();
  }, []);

  return (
    <section id="section-carteiras">
      <div className="header">
        <h1>Minhas Carteiras</h1>
        <button className="btn-criar-carteira" onClick={openCreateModal}>
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
                  className="btn-edit-users" 
                  onClick={() => openEditModal(carteira.id)}
                  title="Gerenciar participantes"
                >
                  <FaUserEdit />
                </button>
                <button 
                  className="btn-edit" 
                  onClick={() => handleEditar(carteira.id)}
                  title="Editar nome"
                >
                  <FaPencilAlt />
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleApagar(carteira.id)}
                  title="Excluir carteira"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <p>Valor: R$ {carteira.balance ? carteira.balance.toFixed(2) : "0.00"}</p>
            <button
              className="btn-detalhes"
              onClick={() => navigate(`/Gastos/${carteira.id}`)}
            >
              Ver mais detalhes <span className="icn"><FaPlusCircle /></span>
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{modalType === 'create' ? 'Criar Nova Carteira' : 'Gerenciar Participantes'}</h2>
            
            {modalType === 'create' && (
              <label>
                Nome da Carteira:
                <input
                  type="text"
                  value={novaCarteira.name}
                  onChange={(e) => setNovaCarteira({...novaCarteira, name: e.target.value})}
                  required
                />
              </label>
            )}

            <label>
              {modalType === 'create' ? 'Adicionar Participantes' : 'Adicionar Participante'}
              <div className="add-participant">
                <input
                  type="email"
                  value={emailParticipante}
                  onChange={(e) => setEmailParticipante(e.target.value)}
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
              <h4>Participantes:</h4>
              {(modalType === 'create' ? novaCarteira.userEmails : walletUsers).map((email, index) => (
                <div key={index} className="participant-item">
                  <p>{email}</p>
                  <button
                    className="btn-delete-participant"
                    onClick={() => handleRemoverParticipante(email)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-save"
                onClick={modalType === 'create' ? handleCriarCarteira : () => setShowModal(false)}
              >
                {modalType === 'create' ? 'Criar' : 'Concluir'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}