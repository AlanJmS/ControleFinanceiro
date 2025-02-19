import './Button.css';

export default function Button({text, onClick, type, customClass}) {
  return (
    <button className={`button ${[customClass]}`} onClick={onClick} type={type}>
      {text}
    </button>
  );
};