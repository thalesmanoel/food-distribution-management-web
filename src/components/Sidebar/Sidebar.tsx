import "./Sidebar.css";
import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
  UtensilsCrossed,
} from "lucide-react";

interface Props {
  open: boolean;
}

export function Sidebar({ open }: Props) {
  const menuItems: { label: string; icon: LucideIcon; active?: boolean }[] = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Pedidos", icon: ClipboardList },
    { label: "Clientes", icon: Users },
    { label: "Produtos", icon: Package },
    { label: "Relatórios", icon: ChartColumn },
    { label: "Configurações", icon: Settings },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-logo">
        <div className="logo-icon" aria-hidden="true">
          <UtensilsCrossed size={20} strokeWidth={2.4} />
        </div>
        <div className="sidebar-brand">
          <span>Sistema</span>
          <small>Tem Sabor</small>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Menu principal">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              className={item.active ? "active" : ""}
              aria-current={item.active ? "page" : undefined}
              key={item.label}
            >
              <span className="sidebar-menu-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.35} />
              </span>
              <span className="sidebar-menu-label">{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-menu-icon" aria-hidden="true">
          <LogOut size={18} strokeWidth={2.35} />
        </span>
        <span className="sidebar-menu-label">Sair</span>
      </div>
    </aside>
  );
}
