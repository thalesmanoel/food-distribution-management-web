import "./StatCard.css";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <span className="stat-card-marker" aria-hidden="true">
          <Icon size={20} strokeWidth={2.35} />
        </span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}
