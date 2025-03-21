import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Card from "../components/Card";
import Button from "../components/Button";

export default function MainPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("nome");
  const { gastos, salario, orcamentoTotal } = useGastos(); // Usando orcamentoTotal do contexto

  const [mostrarGraficoPizza, setMostrarGraficoPizza] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const alternarGrafico = () => {
    setMostrarGraficoPizza((prev) => !prev);
    setSelectedMonth(null);
  };

  // Agrupa gastos por categoria
  const categorias = gastos.reduce((acc, gasto) => {
    const valor = parseFloat(gasto.valor) || 0;
    const categoria = gasto.tipo || "Outros";
    acc[categoria] = (acc[categoria] || 0) + valor;
    return acc;
  }, {});

  // Prepara os dados para o gráfico de pizza
  const dataPizza = Object.entries(categorias).map(([categoria, total]) => ({
    name: categoria,
    value: parseFloat(((total / orcamentoTotal) * 100).toFixed(2)),
    total: total.toFixed(2),
  }));

  // Calcula o total de gastos
  const totalGastos = Object.values(categorias).reduce((a, b) => a + b, 0);
  const salarioRestante = orcamentoTotal - totalGastos;

  // Adiciona o salário restante ao gráfico de pizza
  if (salarioRestante > 0) {
    dataPizza.push({
      name: "Salário Restante",
      value: parseFloat(((salarioRestante / orcamentoTotal) * 100).toFixed(2)),
      total: salarioRestante.toFixed(2),
    });
  }

  // Agrupa gastos por mês para o gráfico de linhas
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

  // Tooltip customizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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

  // Dados para o gráfico de linhas (visão mensal ou diária)
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

  // Título do gráfico
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
      <div id="cards">
        <Card
          text="👋 Olá, "
          span={`${userName}!`}
          value={`R$ ${orcamentoTotal.toFixed(2)}`} // Exibe o orçamento total
        />
        <Card text="Total Gastos" value={`R$ ${totalGastos.toFixed(2)}`} />
      </div>

      <div id="chart__container">

        {mostrarGraficoPizza ? (
          <div className="chart__">
            <h2>Distribuição de Gastos</h2>
            <ResponsiveContainer width="100%" height="100%" id="pie">
              <PieChart>
                <Pie
                  data={dataPizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
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
          <div className="chart__">
            <h2>{tituloGrafico}</h2>
            {selectedMonth && (
              <button onClick={() => setSelectedMonth(null)} className="back-btn">
                Voltar à visão mensal
              </button>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={xAxisDataKey}
                  stroke="#f0f0f0"
                  tickFormatter={tickFormatter}
                />
                <YAxis stroke="#f0f0f0" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="valor"
                  stroke="#007AFF"
                  name="Valor total"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="button-container">
          <Button
            onClick={alternarGrafico}
            text={mostrarGraficoPizza ? "Ver gráfico de linhas" : "Ver gráfico de consumo"}
          />
          <Button
            text="Novo gasto"
            onClick={() => navigate("/CadastroGastos")}
          />
        </div>
      </div>
    </section>
  );
}