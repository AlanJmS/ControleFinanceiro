import { FaEdit, FaTrash } from 'react-icons/fa'
import './Card.css';

export default function Card({title, description}) {
    return (
        <div className="card__container">
            <div className="card__content">
                <h2 className="card__title">{title}</h2>
                <p className="card__description">{description}</p>

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