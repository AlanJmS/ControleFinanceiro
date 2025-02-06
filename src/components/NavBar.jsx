import { Link } from "react-router-dom";

function Navbar() {
  return (
      <nav id="navBar">
        <div id="icone">
        <Link to="/" >
          <img src="icon.png" alt="simbolos relacionados a temática de orçamento" width={"60px"} height={"60px"} style={{}}  />
        </Link>
        </div>
        <Link to="/MainPage" className="link">
        Cadastrar gasto</Link>
        <Link to="/Gastos" className="link">
          Lista de gastos
        </Link>
        <Link to="/Resume" className="link">
          Gráfico
        </Link>
       
      </nav>
  );
}

export default Navbar;
