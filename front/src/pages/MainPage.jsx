import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGastos } from "../context/GastosContext";
import { getWallets, getCosts } from "../api/api";
import "./MainPage.css";
import Card from "../components/Card";
import Button from "../components/Button";
import DataProcessor from "../components/DataProcessor";
import PieChartComponent from "../components/charts/PieChartComponent";
import LineChartComponent from "../components/charts/LineChartComponent";

export default function MainPage() {
  const navigate = useNavigate();
  const { user, orcamentoTotal } = useGastos();

  const [mostrarGraficoPizza, setMostrarGraficoPizza] = useState(true);
  const [carteiras, setCarteiras] = useState([]);
  const [carteiraSelecionada, setCarteiraSelecionada] = useState(null);
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    setCarteiras([]);
    setGastos([]);
    setCarteiraSelecionada(null);

    const fetchCarteiras = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token não encontrado. Redirecionando para login.");
          navigate("/login");
          return;
        }

        const response = await getWallets();
        const data = response.data;

        setCarteiras(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar carteiras:", error);
        alert("Erro ao carregar carteiras. Tente novamente.");
      }
    };

    fetchCarteiras();
  }, []);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        if (!carteiraSelecionada) {
          console.log("Nenhuma carteira selecionada.");
          setGastos([]);
          return;
        }

        const data = await getCosts(carteiraSelecionada);
        setGastos(Array.isArray(data) ? data : []);
        console.log("Gastos:", gastos);
      } catch (error) {
        console.error("Erro ao buscar gastos:", error);
        alert("Erro ao carregar os gastos. Tente novamente.");
        setGastos([]);
      }
    };

    fetchGastos();
  }, [carteiraSelecionada, navigate]);

  const alternarGrafico = () => {
    setMostrarGraficoPizza((prev) => !prev);
  };

  return (
    <DataProcessor
      carteiras={carteiras}
      gastos={gastos}
      carteiraSelecionada={carteiraSelecionada}
    >
      {({ dataPizza, dataLinha, totalGastos }) => (
        <section id="section-main">
          <div id="cards">
            <Card
              text="👋 Olá, "
              span={`${user.name}!`}
              value={`R$ ${orcamentoTotal.toFixed(2)}`}
            />
            <Card text="Total de gastos" value={`R$ ${totalGastos.toFixed(2)}`} />
          </div>

          <div id="chart__container">
            {mostrarGraficoPizza ? (
              <PieChartComponent
                data={dataPizza}
                carteiras={carteiras}
                carteiraSelecionada={carteiraSelecionada}
                setCarteiraSelecionada={setCarteiraSelecionada}
              />
            ) : (
              <LineChartComponent data={dataLinha} />
            )}
            <div className="button-container">
              <Button
                onClick={alternarGrafico}
                text={
                  mostrarGraficoPizza
                    ? "Ver gráfico de linhas"
                    : "Ver gráfico de consumo"
                }
              />
              <Button
                text="Novo gasto"
                onClick={() => navigate("/CadastroGastos")}
              />
            </div>
          </div>
        </section>
      )}
    </DataProcessor>
  );
}
