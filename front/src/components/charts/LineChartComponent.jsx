import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineChartComponent = ({ data }) => {
  return (
    <div className="chart__">
      <h2>Evolução de Gastos por Mês</h2>
      {data.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "var(--textColor)",
          }}
        >
          <p>Selecione uma carteira para visualizar os gastos por mês</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              stroke="#f0f0f0"
              tickFormatter={(mesAno) => {
                const [mes] = mesAno.split("/");
                return new Date(0, mes - 1).toLocaleString("pt-BR", {
                  month: "short",
                });
              }}
            />
            <YAxis
              stroke="#f0f0f0"
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--secondaryColor)",
                border: "1px solid var(--blue)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
              labelStyle={{
                color: "var(--textColor)",
                fontWeight: "bold",
                marginBottom: "5px",
                fontSize: "14px",
              }}
              itemStyle={{
                color: "var(--textColor)",
                padding: "2px 0",
              }}
              formatter={(value) => [`R$ ${value}`, "Total"]}
              labelFormatter={(mesAno) => {
                const [mes, ano] = mesAno.split("/");
                return `${new Date(0, mes - 1).toLocaleString("pt-BR", {
                  month: "long",
                })} de ${ano}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#007AFF"
              strokeWidth={2}
              name="Valor total"
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default LineChartComponent;
