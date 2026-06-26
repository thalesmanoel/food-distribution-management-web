import "./Header.css";
import { Bell, Menu, UserRound } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Props {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: Props) {
  const location = useLocation();
  const pageInfo =
    location.pathname === "/clientes"
      ? { kicker: "Cadastros", title: "Clientes" }
      : { kicker: "Visão geral", title: "Dashboard" };

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
          <span className="header-kicker">{pageInfo.kicker}</span>
          <strong>{pageInfo.title}</strong>
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
