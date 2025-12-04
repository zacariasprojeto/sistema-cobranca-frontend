import "../styles/cards.css";

export default function CardInfo({ title, value }) {
  return (
    <div className="card-info">
      <h3>{title}</h3>
      <span>{value}</span>
    </div>
  );
}
