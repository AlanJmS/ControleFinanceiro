import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import Container from './components/Container';
import HomePage from './pages/Home';
import Container from './components/Container';
import HomePage from './pages/Home';
import Footer from './components/Footer';
import MainPage from './Pages/MainPage';
import './App.css'
import ResumePage from './pages/ResumePage';
import Gastos from './pages/Gastos';

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/HomePage';

  return (
    <>
      {!isHomePage && <Navbar />}
      <Container customClass="min-height">
        <Routes>
          <Route path="/" element={<Navigate to="/HomePage" />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/MainPage" element={<MainPage />} />
          <Route path='/Resume' element={<ResumePage />} />
          <Route path='/Gastos' element={<Gastos/>} />
        </Routes>
      </Container>
      {!isHomePage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;