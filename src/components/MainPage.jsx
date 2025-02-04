import React from 'react';
import { useLocation } from 'react-router-dom';

function MainPage() {

  const { state } = useLocation();
  const { nome, salario } = state || {};
  
  return (
    <div id="pagPrincipal">
      <h1>Detalhes do Usuário</h1>
      {nome && salario ? (
        <div>
          <p>Bem-vindo, {nome}!</p>
          <p>Salário: R${salario}</p>
        </div>
      ) : (
        <p>Sem dados para exibir.</p>
      )}
    </div>
  );
}

export default MainPage;
