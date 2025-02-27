import { useState, useEffect } from "react";
import { useGastos } from "../context/GastosContext";
import Button from "../components/Button";
import "./Perfil.css";

export default function Perfil() {
  const { salario, setSalario } = useGastos();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    base: salario.base,
    rendasExtras: salario.rendasExtras,
    nome: localStorage.getItem("nome") || "Usuário",
    email: localStorage.getItem("email") || "email@exemplo.com",
  });
  const [novaRenda, setNovaRenda] = useState({ descricao: "", valor: "" });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      base: salario.base,
      rendasExtras: salario.rendasExtras,
    }));
  }, [salario]);

  const handleSave = (e) => {
    e.preventDefault();

    const updatedSalario = {
      base: parseFloat(formData.base) || 0,
      rendasExtras: formData.rendasExtras.map((renda) => ({
        descricao: renda.descricao,
        valor: parseFloat(renda.valor) || 0,
      })),
    };
    setSalario(updatedSalario);

    localStorage.setItem("nome", formData.nome);
    localStorage.setItem("email", formData.email);

    setEditMode(false);
  };

  const handleAddRenda = () => {
    if (!novaRenda.descricao || !novaRenda.valor) return;
    setFormData((prev) => ({
      ...prev,
      rendasExtras: [...prev.rendasExtras, novaRenda],
    }));
    setNovaRenda({ descricao: "", valor: "" });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>Informações Pessoais</h2>

        {!editMode ? (
          <div className="info-view">
            <div className="info-item">
              <span>Nome:</span>
              <span>{formData.nome}</span>
            </div>
            <div className="info-item">
              <span>Email:</span>
              <span>{formData.email}</span>
            </div>
            <div className="info-item">
              <span>Salário:</span>
              <span> R$ {salario.base.toFixed(2)}</span>
            </div>

            <div className="rendas-extras">
              <h3>Minhas Rendas</h3>

              {salario.rendasExtras.map((renda, index) => (
                <div key={index} className="renda-item">
                  <span>{renda.descricao}</span>
                  <span> R$ {renda.valor.toFixed(2)}</span>
                </div>
              ))}
              {salario.rendasExtras.length === 0 && (
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
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nome: e.target.value,
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
                  value={formData.base}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      base: e.target.value,
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
        )}
      </div>
    </div>
  );
}
