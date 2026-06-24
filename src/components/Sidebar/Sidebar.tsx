import "./Sidebar.css";

interface Props {
  open: boolean;
}

export function Sidebar({ open }: Props) {
  const menuItems = [
    { label: "Dashboard", icon: "D", active: true },
    { label: "Pedidos", icon: "P" },
    { label: "Clientes", icon: "C" },
    { label: "Produtos", icon: "PR" },
    { label: "Relatórios", icon: "R" },
    { label: "Configurações", icon: "CO" },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">TS</div>
        <div className="sidebar-brand">
          <span>Sistema</span>
          <small>Tem Sabor</small>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Menu principal">
        {menuItems.map((item) => (
          <a
            className={item.active ? "active" : ""}
            aria-current={item.active ? "page" : undefined}
            key={item.label}
          >
            <span className="sidebar-menu-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="sidebar-menu-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-menu-icon" aria-hidden="true">
          S
        </span>
        <span className="sidebar-menu-label">Sair</span>
      </div>
    </aside>
  );
}
