import { useState, useEffect } from "react";
import Button from "../components/Button";
import Message from "../components/Message";
import { useGastos } from "../context/GastosContext";
import "./Perfil.css";

export default function Perfil() {
  const { user, updateUser } = useGastos();
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({
    message: "",
    type: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    salary: 0,
    rendasExtras: []
  });
  const [novaRenda, setNovaRenda] = useState({ descricao: "", valor: "" });

  useEffect(() => {
    if (!user.isLoading) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        salary: user.salary || 0,
        rendasExtras: []
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const result = await updateUser({
        name: formData.name,
        email: formData.email,
        salary: parseFloat(formData.salary) || 0
      });

      if (result.success) {
        setEditMode(false);
        setMessage({
          message: "Usuário atualizado com sucesso!",
          type: "success"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      setMessage({
        message: error.message || "Erro ao atualizar usuário",
        type: "error"
      });
    }
  };

  const handleAddRenda = () => {
    if (!novaRenda.descricao || !novaRenda.valor) return;
    setFormData((prev) => ({
      ...prev,
      rendasExtras: [...prev.rendasExtras, novaRenda],
    }));
    setMessage({
      message: "Renda extra adicionada com sucesso!",
      type: "success"
    });
    setNovaRenda({ descricao: "", valor: "" });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Informações Pessoais</h2>
        {message.message && <Message message={message.message} type={message.type} />}
        {user.isLoading && <p>Carregando...</p>}
        {!user.isLoading && (
          !editMode ? (
            <div className="info-view">
              <div className="info-item">
                <span>Nome:</span>
                <span>{formData.name}</span>
              </div>
              <div className="info-item">
                <span>Email:</span>
                <span>{formData.email}</span>
              </div>
              <div className="info-item">
                <span>Salário:</span>
                <span> R$ {parseFloat(formData.salary).toFixed(2)}</span>
              </div>

              <div className="rendas-extras">
                <h3>Minhas Rendas</h3>

                {formData.rendasExtras.map((renda, index) => (
                  <div key={index} className="renda-item">
                    <span>{renda.descricao}</span>
                    <span> R$ {parseFloat(renda.valor).toFixed(2)}</span>
                  </div>
                ))}
                {formData.rendasExtras.length === 0 && (
                  <p className="empty">Nenhuma renda extra cadastrada</p>
                )}
              </div>

              <Button
                text="Editar Configurações"
                onClick={() => setEditMode(true)}
                customClass="primary"
              />
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSave}>
              <div className="form-section">
                <div className="form-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Meu salário:</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        salary: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Minhas Rendas</h3>
                <div className="nova-renda">
                  <input
                    className="input-edit"
                    placeholder="Nova descrição"
                    value={novaRenda.descricao}
                    onChange={(e) =>
                      setNovaRenda((prev) => ({
                        ...prev,
                        descricao: e.target.value,
                      }))
                    }
                  />
                  <input
                    className="input-edit"
                    type="number"
                    step="0.01"
                    placeholder="Novo valor"
                    value={novaRenda.valor}
                    onChange={(e) =>
                      setNovaRenda((prev) => ({
                        ...prev,
                        valor: e.target.value,
                      }))
                    }
                  />
                  <Button
                    text="Adicionar"
                    type="button"
                    onClick={handleAddRenda}
                    customClass="secondary"
                  />
                </div>

                {formData.rendasExtras.map((renda, index) => (
                  <div key={index} className="renda-edit-item">
                    <input
                      className="input-edit"
                      placeholder="Descrição"
                      value={renda.descricao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rendasExtras: prev.rendasExtras.map((item, i) =>
                            i === index
                              ? { ...item, descricao: e.target.value }
                              : item
                          ),
                        }))
                      }
                      required
                    />
                    <input
                      className="input-edit"
                      type="number"
                      placeholder="Valor"
                      value={renda.valor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rendasExtras: prev.rendasExtras.map((item, i) =>
                            i === index
                              ? { ...item, valor: e.target.value }
                              : item
                          ),
                        }))
                      }
                      required
                    />
                    <Button
                      className="input-edit"
                      text="Remover"
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          rendasExtras: prev.rendasExtras.filter(
                            (_, i) => i !== index
                          ),
                        }))
                      }
                      customClass="danger"
                    />
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <Button
                  text="Cancelar"
                  type="button"
                  onClick={() => setEditMode(false)}
                  customClass="secondary"
                />
                <Button
                  text="Salvar Alterações"
                  type="submit"
                  customClass="primary"
                />
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
