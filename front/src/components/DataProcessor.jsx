import React from "react";
import { useGastos } from "../context/GastosContext";

const DataProcessor = ({ carteiras, gastos, carteiraSelecionada, children }) => {
  const { orcamentoTotal } = useGastos();

  const dataPizza = (() => {
    const data = [];

    if (!carteiraSelecionada) {
      if (Array.isArray(carteiras)) {
        const carteirasComSaldo = carteiras.filter(carteira => 
          parseFloat(carteira.balance || 0) > 0
        );
        
        data.push(
          ...carteirasComSaldo.map((carteira) => ({
            name: carteira.name,
            value:
              orcamentoTotal > 0
                ? parseFloat(
                    ((carteira.balance / orcamentoTotal) * 100).toFixed(2)
                  )
                : 0,
            total: carteira.balance.toFixed(2),
          }))
        );
      }

      const totalGastos = Array.isArray(carteiras)
        ? carteiras.reduce(
            (acc, carteira) => acc + parseFloat(carteira.balance || 0),
            0
          )
        : 0;
      const salarioRestante = orcamentoTotal - totalGastos;

      if (salarioRestante > 0) {
        data.push({
          name: "Salário Restante",
          value: parseFloat(
            ((salarioRestante / orcamentoTotal) * 100).toFixed(2)
          ),
          total: salarioRestante.toFixed(2),
        });
      }

      return data;
    }

    const gastosFiltrados = gastos.filter(
      (gasto) => Number(gasto.walletId) === Number(carteiraSelecionada)
    );

    if (gastosFiltrados.length > 0) {
      const categorias = gastosFiltrados.reduce((acc, gasto) => {
        const categoria = gasto.category || "Outros";
        const valor = parseFloat(gasto.amount || 0);
        acc[categoria] = (acc[categoria] || 0) + valor;
        return acc;
      }, {});

      const categoriasComValor = Object.entries(categorias)
        .filter(([_, total]) => total > 0)
        .map(([categoria, total]) => ({
          name: categoria,
          value:
            orcamentoTotal > 0
              ? parseFloat(((total / orcamentoTotal) * 100).toFixed(2))
              : 0,
          total: total.toFixed(2),
        }));

      data.push(...categoriasComValor);

      const totalGastos = gastosFiltrados.reduce(
        (acc, gasto) => acc + parseFloat(gasto.amount || 0),
        0
      );
      const salarioRestante = orcamentoTotal - totalGastos;

      if (salarioRestante > 0) {
        data.push({
          name: "Salário Restante",
          value: parseFloat(
            ((salarioRestante / orcamentoTotal) * 100).toFixed(2)
          ),
          total: salarioRestante.toFixed(2),
        });
      }
    }

    return data;
  })();

  const processDataLinha = (gastos) => {
    if (!gastos || gastos.length === 0) {
      return [];
    }

    const gastosMensais = gastos.reduce((acc, gasto) => {
      const data = new Date(gasto.date);
      if (isNaN(data.getTime())) {
        return acc;
      }

      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      acc[mesAno] = (acc[mesAno] || 0) + parseFloat(gasto.amount || 0);
      return acc;
    }, {});

    return Object.entries(gastosMensais)
      .sort(([a], [b]) => {
        const [mesA, anoA] = a.split("/");
        const [mesB, anoB] = b.split("/");
        return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
      })
      .map(([mesAno, valor]) => ({
        mes: mesAno,
        valor: parseFloat(valor.toFixed(2)),
      }));
  };

  const dataLinha = processDataLinha(gastos);

  const totalGastos = Array.isArray(carteiras)
    ? carteiras.reduce(
        (acc, carteira) => acc + parseFloat(carteira.balance || 0),
        0
      )
    : 0;

  return children({
    dataPizza,
    dataLinha,
    totalGastos,
  });
};

export default DataProcessor;