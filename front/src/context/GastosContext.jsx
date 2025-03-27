import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/api";

const GastosContext = createContext();

export function GastosProvider({ children }) {
  // Estado do usuário
  const [user, setUser] = useState({
    name: '',
    email: '',
    salary: 0,
    isLoading: true,
    error: null
  });

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(prev => ({
            ...prev,
            isLoading: false,
            error: "Não autenticado"
          }));
          return;
        }

        const response = await api.getUserInfo();
        setUser({
          name: response.data.name,
          email: response.data.email,
          salary: response.data.salary || 0,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setUser(prev => ({
          ...prev,
          isLoading: false,
          error: error.response?.data?.message || "Erro ao carregar dados do usuário"
        }));
      }
    };

    fetchUserData();
  }, []);

  // Função para atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      setUser(prev => ({ ...prev, isLoading: true }));

      await api.updateUser({
        name: userData.name,
        email: userData.email,
        salary: userData.salary
      });

      setUser({
        name: userData.name,
        email: userData.email,
        salary: userData.salary,
        isLoading: false,
        error: null
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setUser(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Erro ao atualizar dados"
      }));
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao atualizar dados"
      };
    }
  };

  return (
    <GastosContext.Provider
      value={{
        user,
        updateUser
      }}
    >
      {children}
    </GastosContext.Provider>
  );
}

export const useGastos = () => {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error('useGastos deve ser usado dentro de um GastosProvider');
  }
  return context;
};
