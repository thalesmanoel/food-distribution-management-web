import "./StatCard.css";

interface Props {
  title: string;
  value: string;
}

export function StatCard({ title, value }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <span className="stat-card-marker" aria-hidden="true" />
      </div>

      <strong>{value}</strong>
    </div>
  );
}
