import "./Header.css";
import { Bell, Menu, UserRound } from "lucide-react";

interface Props {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: Props) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          type="button"
          aria-label="Alternar menu lateral"
        >
          <Menu size={21} strokeWidth={2.5} aria-hidden="true" />
        </button>

        <div>
          <span className="header-kicker">Visão geral</span>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="header-right">
        <button className="notification" type="button" aria-label="Notificações">
          <Bell size={20} strokeWidth={2.35} aria-hidden="true" />
          <span className="badge">3</span>
        </button>

        <div className="user">
          <div className="user-info">
            <strong>Thales Carrion</strong>
            <small>Administrador</small>
          </div>

          <div className="avatar">
            <UserRound size={19} strokeWidth={2.35} aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  );
}
