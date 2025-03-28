import React from "react";
import Select from "react-select";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, total, value } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>{name}</p>
        <p style={{ margin: 0, color: "#666" }}>
          Valor Total: <strong>R$ {total}</strong>
        </p>
        <p style={{ margin: 0, color: "#666" }}>
          Porcentagem: <strong>{value}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

const PieChartComponent = ({ data, carteiras, carteiraSelecionada, setCarteiraSelecionada }) => {
  const options = [
    { value: null, label: "Todas as Carteiras" },
    ...(Array.isArray(carteiras)
      ? carteiras.map(carteira => ({
          value: carteira.id,
          label: carteira.name
        }))
      : []
  )];

  // Estilos customizados para o react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--primaryColor)",
      borderColor: state.isFocused ? "var(--blue)" : "rgba(255, 255, 255, 0.15)",
      color: "var(--textColor)",
      minHeight: "40px",
      fontSize: "1.3rem",
      fontWeight: "500",
      cursor: "pointer",
      boxShadow: state.isFocused ? "0 0 0 1px var(--blue)" : "none",
      "&:hover": {
        borderColor: "var(--blue)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      marginTop: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: "200px",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "var(--blue) var(--secondaryColor)",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "var(--secondaryColor)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--blue)",
        borderRadius: "3px",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--blue)"
        : state.isFocused
        ? "rgba(0, 122, 255, 0.1)"
        : "transparent",
      color: state.isSelected ? "white" : "var(--primaryColor)",
      padding: "10px 15px",
      height: "3rem",
      fontSize: "1.3rem",
      "&:active": {
        backgroundColor: "var(--blue)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--textColor)",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--textColor)",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.5)",
      padding: "0 8px",
      "&:hover": {
        color: "var(--textColor)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="chart__">
      <div className="chart__header">
        <h2>Distribuição de Gastos</h2>
        <Select
          options={options}
          value={options.find(option => option.value === carteiraSelecionada)}
          onChange={(selected) => setCarteiraSelecionada(selected.value)}
          styles={customStyles}
          placeholder="Selecione uma carteira"
          isSearchable={false}
          classNamePrefix="select"
        />
      </div>
      
      {data.length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "var(--textColor)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <p>
            {carteiraSelecionada !== null
              ? "Não há dados para a carteira selecionada"
              : "Nenhum dado disponível"}
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%" id="pie">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              fill="#8884d8"
              paddingAngle={5 }
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
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieChartComponent;