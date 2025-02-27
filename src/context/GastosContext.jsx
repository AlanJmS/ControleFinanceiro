import { createContext, useContext, useState, useEffect } from "react";

const GastosContext = createContext();

const loadInitialState = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export function GastosProvider({ children }) {
  const [gastos, setGastos] = useState(() => loadInitialState("gastos", []));

  const [salario, setSalario] = useState(() => {
    const defaultSalario = { base: 0, rendasExtras: [] };
    const loaded = loadInitialState("salario", defaultSalario);

    return {
      base: Number(loaded.base) || 0,
      rendasExtras: Array.isArray(loaded.rendasExtras)
        ? loaded.rendasExtras.map((renda) => ({
            descricao: renda.descricao || "",
            valor: Number(renda.valor) || 0,
          }))
        : [],
    };
  });

  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos));
  }, [gastos]);

  useEffect(() => {
    localStorage.setItem("salario", JSON.stringify(salario));
  }, [salario]);

  const orcamentoTotal =
    salario.base +
    (salario.rendasExtras?.reduce((acc, renda) => acc + renda.valor, 0) || 0);

  return (
    <GastosContext.Provider
      value={{
        gastos,
        salario,
        orcamentoTotal,
        deletarGasto: (indexes) =>
          setGastos((prev) => prev.filter((_, i) => !indexes.includes(i))),
        setSalario: (novoSalario) =>
          setSalario((prev) => ({
            base: Number(novoSalario.base) || prev.base,
            rendasExtras: Array.isArray(novoSalario.rendasExtras)
              ? novoSalario.rendasExtras.map((renda) => ({
                  descricao: renda.descricao || "",
                  valor: Number(renda.valor) || 0,
                }))
              : prev.rendasExtras,
          })),
        adicionarGasto: (gasto) =>
          setGastos((prev) => [
            ...prev,
            {
              ...gasto,
              valor: Number(gasto.valor) || 0,
              data: new Date(gasto.data).toISOString(),
            },
          ]),
        editarGasto: (index, novoGasto) =>
          setGastos((prev) =>
            prev.map((g, i) =>
              i === index
                ? {
                    ...novoGasto,
                    valor: Number(novoGasto.valor) || 0,
                    data: new Date(novoGasto.data).toISOString(),
                  }
                : g
            )
          ),
      }}
    >
      {children}
    </GastosContext.Provider>
  );
}

export const useGastos = () => {
  const context = useContext(GastosContext);
  return context;
};
