import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar';
import HomePage from './components/Home';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import './App.css'

function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/HomePage';

  return (
    <>
      {!isHomePage && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/HomePage" />} /> 
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/MainPage" element={<MainPage />} />
      </Routes>
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
