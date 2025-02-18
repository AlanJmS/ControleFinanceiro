import React, { useState } from "react";
import { useGastos } from "../context/GastosContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./MainPage.css";

export default function MainPage() {
  const { gastos, salario } = useGastos();
  const salarioNumero = parseFloat(salario) || 0;

  const [mostrarGraficoPizza, setMostrarGraficoPizza] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const alternarGrafico = () => {
    setMostrarGraficoPizza((prev) => !prev);
    setSelectedMonth(null);
  };

  const categorias = gastos.reduce((acc, gasto) => {
    const valor = parseFloat(gasto.valor) || 0;
    const categoria = gasto.tipo || "Outros";
    acc[categoria] = (acc[categoria] || 0) + valor;
    return acc;
  }, {});

  const dataPizza = Object.entries(categorias).map(([categoria, total]) => ({
    name: categoria,
    value: parseFloat(((total / salarioNumero) * 100).toFixed(2)),
    total: total.toFixed(2),
  }));

  const totalGastos = Object.values(categorias).reduce((a, b) => a + b, 0);
  const salarioRestante = salarioNumero - totalGastos;

  if (salarioRestante > 0) {
    dataPizza.push({
      name: "Salário Restante",
      value: parseFloat(((salarioRestante / salarioNumero) * 100).toFixed(2)),
      total: salarioRestante.toFixed(2),
    });
  }

  // Agrupando gastos por mês para o gráfico de linhas (visão mensal)
  const gastosPorMes = gastos.reduce((acc, gasto) => {
    const data = new Date(gasto.data);
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
    acc[mesAno] = (acc[mesAno] || 0) + parseFloat(gasto.valor);
    return acc;
  }, {});

  const dataLinha = Object.entries(gastosPorMes)
    .sort(([a], [b]) => new Date(`01/${a}`) - new Date(`01/${b}`))
    .map(([mesAno, valor]) => ({
      mes: mesAno,
      valor: parseFloat(valor.toFixed(2)),
    }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Tooltip customizado que adapta o conteúdo conforme o tipo de gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Se for o gráfico de pizza (exibe o nome e o total)
      if (payload[0].payload.name) {
        return (
          <div className="custom-tooltip">
            <p className="tooltip-label">{payload[0].payload.name}</p>
            <p className="tooltip-value">
              Valor: R$ {payload[0].payload.total}
            </p>
          </div>
        );
      }
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">Valor: R$ {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (gastos.length === 0 || salarioNumero <= 0) {
    return (
      <div className="chart__container">
        <h1>Distribuição de Gastos em Relação ao Salário</h1>
        <p>Não há dados suficientes para exibir os gráficos.</p>
      </div>
    );
  }

  let dataChart = dataLinha;
  let xAxisDataKey = "mes";
  let tickFormatter = (mesAno) => {
    const [mes] = mesAno.split("/");
    return new Date(0, mes - 1).toLocaleString("pt-BR", { month: "short" });
  };

  if (selectedMonth) {
    const gastosDoMes = gastos.filter((gasto) => {
      const data = new Date(gasto.data);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      return mesAno === selectedMonth;
    });

    const gastosPorDia = gastosDoMes.reduce((acc, gasto) => {
      const data = new Date(gasto.data);
      const dia = data.getDate();
      acc[dia] = (acc[dia] || 0) + parseFloat(gasto.valor);
      return acc;
    }, {});

    dataChart = Object.entries(gastosPorDia)
      .sort(([diaA], [diaB]) => Number(diaA) - Number(diaB))
      .map(([dia, valor]) => ({ dia, valor: parseFloat(valor.toFixed(2)) }));

    xAxisDataKey = "dia";
    tickFormatter = (dia) => `Dia ${dia}`;
  }

  const CustomMonthlyTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y + 10}
        fill="#f0f0f0"
        textAnchor="middle"
        style={{ cursor: "pointer" }}
        onClick={() => setSelectedMonth(payload.value)}
      >
        {new Date(0, Number(payload.value.split("/")[0]) - 1).toLocaleString(
          "pt-BR",
          {
            month: "short",
          }
        )}
      </text>
    );
  };

  let tituloGrafico = "Gastos Totais por Mês";
  if (selectedMonth) {
    const [mes, ano] = selectedMonth.split("/");
    const mesExtenso = new Date(ano, mes - 1, 1).toLocaleString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    tituloGrafico = `Gastos do Mês ${mesExtenso}`;
  }

  return (
    <section id="section-main">
      <div className="chart__container">
        <h1>Análise Financeira</h1>
        <div className="graficos-container">
          {mostrarGraficoPizza ? (
            <div className="grafico-card">
              <h2>Distribuição de Gastos</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={dataPizza}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={600}
                    animationEasing="ease-out"
                  >
                    {dataPizza.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="grafico-card">
              <h2>{tituloGrafico}</h2>
              {selectedMonth && (
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="back-btn"
                >
                  Voltar à visão mensal
                </button>
              )}
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dataChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={xAxisDataKey}
                    stroke="#f0f0f0"
                    tickFormatter={tickFormatter}
                    {...(!selectedMonth ? { tick: <CustomMonthlyTick /> } : {})}
                    interval={0}
                  />
                  <YAxis stroke="#f0f0f0" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="linear"
                    dataKey="valor"
                    stroke="#007AFF"
                    name="Valor total"
                    isAnimationActive={true}
                    animationBegin={200}
                    animationDuration={600}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="button-container">
          <button onClick={alternarGrafico} className="btn">
            {mostrarGraficoPizza
              ? "Ver gráfico de linhas"
              : "Ver gráfico de consumo"}
          </button>
        </div>
      </div>
    </section>
  );
}