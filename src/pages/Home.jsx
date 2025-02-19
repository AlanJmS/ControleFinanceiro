import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Button from "../components/Button";

function HomePage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState(localStorage.getItem("nome") || "");
  const [salario, setSalario] = useState(localStorage.getItem("salario") || "");
  const [form, setForm] = useState("login");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("nome", nome);
    localStorage.setItem("salario", salario);
    navigate("/MainPage");
  };

  const changeForm = () => {
    if (form === "login") {
      setForm("cadastro");
    } else {
      setForm("login");
    }
  };

  return (
    <main>
      <div id="div-esq"></div>
      <div id="div-form">
        {form === "cadastro" ? (
          <form onSubmit={handleSubmit} className="formulario">
            <h2>Cadastro - Assistente Orçamental</h2>

            <div className="form-group">
              <input
                type="text"
                id="nome"
                placeholder="Nome de usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="E-mail"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                min={1}
                id="salario"
                placeholder="Salário"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senhaConfirmar"
                placeholder="Confirmar Senha"
                required
              />
            </div>


            <Button
              text='Cadastrar'
              type="submit"
              customClass="blue"
            />
            <p id="tem-conta" onClick={changeForm}>Já possui uma conta?</p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="formulario">
            <h2>Login - Assistente Orçamental</h2>

            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="E-mail ou usuário"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                required
              />
              <p id="tem-conta">Esqueci minha senha</p>
            </div>

            <Button
              text='Entrar'
              type="submit"
              customClass="blue"
            />
            <p id="tem-conta" onClick={changeForm}>Não possui uma conta?</p>
          </form>
        )}
      </div>
    </main>
  );
}

export default HomePage;