import { createContext, useContext, useState } from "react";

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState([]);

  const adicionarGasto = (gasto) => {
    setGastos((prevGastos) => [...prevGastos, gasto]);
  };

  const limparGastos = () => {
    setGastos([]); // Reseta os gastos
  };

  return (
    <GastosContext.Provider value={{ gastos, setGastos, adicionarGasto, limparGastos }}>
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  return useContext(GastosContext);
}
