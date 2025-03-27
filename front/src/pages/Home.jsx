import { useState } from "react";
import * as api from "../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import Button from "../components/Button";
import Message from "../components/Message";

function HomePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    {
      name: "",
      email: "",
      password: "",
      salary: ""
    }
  );
  const [form, setForm] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [messageToUser, setMessageToUser] = useState({
    message: "",
    type: ""
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessageToUser({
      message: "",
      type: ""
    });

    if (formData.senha !== formData.confirmarSenha) {
      setMessageToUser({
        message: "As senhas não coincidem.",
        type: "error",
      });
      return;
    }

    try {
      console.log(formData);
      const response = await api.registerUser(formData);
      console.log(response);
      if (response.status === 201) {
        setMessageToUser({
          message: "Usuário registrado com sucesso!",
          type: "success",
        });
        // setForm("login");
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      setMessageToUser({
        message: error.response.data.message,
        type: "error",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessageToUser({
      message: "",
      type: ""
    });

    try {
      console.log(loginData);
      const response = await api.loginUser(loginData);
      console.log(response);
      if (response.status === 200) {
        setMessageToUser({
          message: "Entrando...",
          type: "success",
        });
        setTimeout(() => {
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("token", response.data.token);          
          navigate("/MainPage");
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMessageToUser({
        message: error.response.data.message,
        type: "error",
      });
    }
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
          <form onSubmit={handleRegister} className="formulario">
            <h2>Cadastro - Assistente Orçamental</h2>

            {messageToUser.message &&
              <Message text={messageToUser.message} type={messageToUser.type} />}
            <div className="form-group">
              <input
                type="text"
                id="nome"
                placeholder="Nome de usuário"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senhaConfirmar"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
          <form onSubmit={handleLogin} className="formulario">
            <h2>Login - Assistente Orçamental</h2>

            {messageToUser.message && <Message text={messageToUser.message} type={messageToUser.type} />}
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="exemplo@exemplo.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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