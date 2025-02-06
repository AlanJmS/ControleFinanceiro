import { FaEdit, FaTrash } from 'react-icons/fa';

export default function Card({ title, date, categoria, valor, onDelete, onEdit }) {
  return (
    <div>
      <h2>{title}</h2>
      <p><strong>Data:</strong> {date}</p>
      <p><strong>Categoria:</strong> {categoria}</p>
      <p><strong>Valor:</strong> {valor}</p>
      <div>
        <button onClick={onEdit}>
          <FaEdit />
          Editar
        </button>
        <button onClick={onDelete}>
          <FaTrash />
          Apagar
        </button>
      </div>
    </div>
  );
};
