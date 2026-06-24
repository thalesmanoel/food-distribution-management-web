import "./Header.css";

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
          <span />
          <span />
          <span />
        </button>

        <div>
          <span className="header-kicker">Visão geral</span>
          <strong>Dashboard</strong>
        </div>
      </div>

      <div className="header-right">
        <button className="notification" type="button" aria-label="Notificações">
          <span className="notification-icon" aria-hidden="true" />
          <span className="badge">3</span>
        </button>

        <div className="user">
          <div className="user-info">
            <strong>Ana Souza</strong>
            <small>Administrador</small>
          </div>

          <div className="avatar">
            AS
          </div>
        </div>
      </div>
    </header>
  );
}
