import { createContext, useContext, useState, useEffect } from "react";

const GastosContext = createContext();

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState(() => {
    const saved = localStorage.getItem("gastos");
    return saved ? JSON.parse(saved) : [];
  });

  const [salario, setSalario] = useState(
    localStorage.getItem("salario") || ""
  );

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("salario", salario);
  }, [salario]);

  const adicionarGasto = (gasto) => {
    setGastos((prev) => [...prev, gasto]);
  };

  const editarGasto = (index, novoGasto) => {
    setGastos((prev) => {
      const updated = [...prev];
      updated[index] = novoGasto;
      return updated;
    });
  };

  const deletarGasto = (index) => {
    setGastos((prev) => prev.filter((_, i) => i !== index));
  };

  const limparGastos = () => {
    setGastos([]);
  };

  return (
    <GastosContext.Provider
      value={{
        gastos,
        salario,
        setSalario,
        adicionarGasto,
        editarGasto,
        limparGastos,
        deletarGasto
      }}
    >
      {children}
    </GastosContext.Provider>
  );
}

export function useGastos() {
  return useContext(GastosContext);
}