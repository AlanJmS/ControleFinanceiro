import { FaEdit, FaTrash } from 'react-icons/fa';
import './Card.css';

export default function Card({ title, date, categoria, valor, onDelete, onEdit, color }) {
  return (
    <div className='card__container'>
      <h2 className='card__title' style={{backgroundColor: `${color}`}}>{title}</h2>
      <div className='info__group'>
        <div className='first__div'>
          <p><strong>Valor:</strong> {valor}</p>
          <p><strong>Categoria:</strong> {categoria}</p>
        </div>
        <div>
          <p><strong>Data:</strong> {date}</p>
        </div>
      </div>
      <div className='card__buttons'>
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
