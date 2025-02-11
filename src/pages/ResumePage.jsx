import React from "react";
import { useGastos } from "../context/GastosContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "./Resume.css";

export default function ResumePage() {
  const { gastos, salario } = useGastos();
  const salarioNumero = parseFloat(salario) || 0;

  if (gastos.length === 0 || salarioNumero <= 0) {
    return (
      <div className="chart__container">
        <h1>Distribuição de Gastos em Relação ao Salário</h1>
        <p>Não há dados suficientes para exibir o gráfico.</p>
      </div>
    );
  }

  const categorias = gastos.reduce((acc, gasto) => {
    const valor = parseFloat(gasto.valor) || 0;
    const categoria = gasto.tipo || "Outros";
    if (!acc[categoria]) acc[categoria] = 0;
    acc[categoria] += valor;
    return acc;
  }, {});

  const data = Object.entries(categorias).map(([categoria, total]) => ({
    name: categoria,
    value: parseFloat(((total / salarioNumero) * 100).toFixed(2)),
    total: total.toFixed(2),
  }));

  const totalGastos = Object.values(categorias).reduce((a, b) => a + b, 0);
  const salarioRestante = salarioNumero - totalGastos;

  if (salarioRestante > 0) {
    data.push({
      name: "Salário Restante",
      value: parseFloat(((salarioRestante / salarioNumero) * 100).toFixed(2)),
      total: salarioRestante.toFixed(2),
    });
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, total } = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p>{name}: R$ {total}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart__container">
      <h1>Distribuição de Gastos em Relação ao Salário</h1>
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}