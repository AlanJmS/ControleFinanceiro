import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar";
import Container from "./components/Container";
import HomePage from "./pages/Home";
import MainPage from "./pages/MainPage";
import Gastos from "./pages/Gastos";
import CadastroGastos from "./pages/CadastroGastos";
import Footer from "./components/Footer";
import { GastosProvider } from "../src/context/GastosContext";
import "./App.css";
import Metas from "./pages/Metas";
import Perfil from "./pages/Perfil";
import Carteiras from './pages/Carteiras'

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/HomePage";

  return (
    <>
      {!isHomePage && <Navbar />}
      <Container customClass={!isHomePage ? "min-height" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/HomePage" />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Perfil" element={<Perfil/>}/>
          <Route path="/MainPage" element={<MainPage />} />
          <Route path="/Gastos" element={<Gastos />} />
          <Route path="/Carteiras" element={<Carteiras/>}/>
          <Route path="/CadastroGastos" element={<CadastroGastos />} />{" "}
          <Route path="/Metas" element={<Metas />} />
        </Routes>
        <Footer />
      </Container>
    </>
  );
}

function App() {
  return (
    <GastosProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </GastosProvider>
  );
}

export default App;
