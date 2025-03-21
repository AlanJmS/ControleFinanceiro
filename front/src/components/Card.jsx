import './Card.css';

export default function Card({ text, value, span }) {
  return (
    <div className='card__container'>
      <p id='card__text'>{text}<span>{span}</span></p>
      <p id='card__value'>{value}</p>
    </div>
  );
};
