import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav id="navBar">
        <div id="icone">
        <Link to="/" >
          <img src="icon.png" alt="simbolos relacionados a temática de orçamento" width={"85px"} height={"80px"}  />
        </Link>
        </div>
        <Link to="/Costs" className="link">
          Despesas
        </Link>
        <Link to="/Resume" className="link">
          Gráfico
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
