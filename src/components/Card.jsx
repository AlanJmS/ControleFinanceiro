import { FaEdit, FaTrash } from 'react-icons/fa'
import './Card.css';

export default function Card({title, date, categoria, valor}) {
    return (
        <div className="card__container">
            <div className="card__content">
                <h2 className="card__title">{title}</h2>
                <p className="card__description">{date}</p>
                <p className="card__description">{categoria}</p>
                <p className="card__description">{valor}</p>
                <div className="card__buttons">
                    <button>
                        <FaEdit />
                        Editar
                    </button>
                    <button>
                        <FaTrash />
                        Apagar
                    </button>
                </div>
            </div>
        </div>
    );
};