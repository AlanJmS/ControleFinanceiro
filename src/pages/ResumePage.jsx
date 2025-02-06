import React from "react";
import { useLocation } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./Resume.css";

export default function ResumePage() {
  const { state } = useLocation();
  const { gastos = [], salario } = state || {};

  // Converte o salário para número
  const salarioNumero = parseFloat(salario) || 0;

  // Agrupa os gastos por categoria (usando a propriedade 'tipo')
  const categorias = gastos.reduce((acc, gasto) => {
    const valor = parseFloat(gasto.valor?.toString().replace(",", ".")) || 0;
    const categoria = gasto.tipo || "Categoria Indefinida";
    if (!acc[categoria]) acc[categoria] = 0;
    acc[categoria] += valor;
    return acc;
  }, {});

  // Cria os dados para o gráfico, incluindo a porcentagem e o total absoluto
  const data = Object.entries(categorias).map(([categoria, total]) => ({
    name: categoria,
    // Calcula a porcentagem com base no salário
    value:
      salarioNumero > 0
        ? parseFloat(((total / salarioNumero) * 100).toFixed(2))
        : 0,
    total: total.toFixed(2), // Armazena o total absoluto (com 2 casas decimais)
  }));

  // Calcula o total de gastos e o salário restante
  const totalGastos = Object.values(categorias).reduce((a, b) => a + b, 0);
  const salarioRestante = salarioNumero - totalGastos;

  if (salarioRestante > 0) {
    data.push({
      name: "Salário Restante",
      value: salarioNumero > 0
        ? parseFloat(((salarioRestante / salarioNumero) * 100).toFixed(2))
        : 0,
      total: salarioRestante.toFixed(2),
    });
  }

  // Define as cores para as fatias do gráfico
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  // Componente customizado para o Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { name, total } = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "5px 10px",
            border: "1px solid #ccc",
          }}
        >
          <p style={{ margin: 0 }}>
            {name}: R$ {total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart__container">
      <div className="chart">
        <h1>Distribuição de Gastos em Relação ao Salário</h1>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {data.map((entry, index) => (
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
        ) : (
          <p>Nenhum gasto cadastrado para exibir no gráfico.</p>
        )}
      </div>
    </div>
  );
}
