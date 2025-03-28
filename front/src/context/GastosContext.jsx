import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../api/api";

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    salary: 0,
    isLoading: true,
    error: null
  });

  const [gastos, setGastos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingGastos, setIsLoadingGastos] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

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
        id: response.data.id,
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

  const updateUser = async (userData) => {
    try {
      setUser(prev => ({ ...prev, isLoading: true }));

      await api.updateUser({
        name: userData.name,
        email: userData.email,
        salary: userData.salary
      });

      setUser({
        ...user,
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

  const fetchGastos = async (walletId) => {
    if (isLoadingGastos || !walletId) return [];

    try {
      setIsLoadingGastos(true);
      setIsLoading(true);
      setError(null);

      const response = await api.getAllCosts(walletId);

      if (response && response.data) {
        setGastos(response.data);
        return response.data;
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error('Erro ao buscar gastos:', error);
      setError(error.response?.data?.message || "Erro ao carregar gastos");
      return [];
    } finally {
      setIsLoading(false);
      setIsLoadingGastos(false);
    }
  };

  const criarGasto = async (gastoData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.createCost(gastoData);

      if (gastoData.walletId) {
        await fetchGastos(gastoData.walletId);
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar gasto:', error);
      setError(error.response?.data?.message || "Erro ao criar gasto");
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao criar gasto"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const editarGasto = async (gastoId, gastoData) => {
    try {
      setIsLoading(true);
      setError(null);

      const formattedData = {
        name: gastoData.name,
        amount: parseFloat(gastoData.amount),
        category: gastoData.category,
        date: gastoData.date,
        walletId: Number(gastoData.walletId)
      };

      const response = await api.editCost(gastoId, formattedData);

      if (gastoData.walletId) {
        await fetchGastos(gastoData.walletId);
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao editar gasto:', error);
      setError(error.response?.data?.message || "Erro ao editar gasto");
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao editar gasto"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deletarGasto = async (gastoId, walletId) => {
    if (!gastoId) {
      console.error('ID do gasto inválido');
      return {
        success: false,
        error: "ID do gasto inválido"
      };
    }

    try {
      setIsLoading(true);
      setError(null);

      await api.deleteCost(gastoId);

      if (walletId) {
        await fetchGastos(walletId);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar gasto:', error);
      setError(error.response?.data?.message || "Erro ao deletar gasto");
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar gasto"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deletarMultiplosGastos = async (gastosIds, walletId) => {
    if (!gastosIds || !Array.isArray(gastosIds) || gastosIds.length === 0) {
      console.error('Lista de IDs de gastos inválida');
      return {
        success: false,
        error: "Lista de IDs de gastos inválida"
      };
    }

    try {
      setIsLoading(true);
      setError(null);

      const deletePromises = gastosIds.map(gastoId => api.deleteCost(gastoId));
      await Promise.all(deletePromises);

      if (walletId) {
        await fetchGastos(walletId);
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar gastos:', error);
      setError(error.response?.data?.message || "Erro ao deletar gastos");
      return {
        success: false,
        error: error.response?.data?.message || "Erro ao deletar gastos"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser({
      id: null,
      name: '',
      email: '',
      salary: 0,
      isLoading: false,
      error: null
    });
    setGastos([]);
  };

  return (
    <GastosContext.Provider
      value={{
        fetchUserData,
        user,
        updateUser,
        orcamentoTotal: user.salary,
        gastos,
        isLoading,
        error,
        fetchGastos,
        criarGasto,
        editarGasto,
        deletarGasto,
        deletarMultiplosGastos,
        logout
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
