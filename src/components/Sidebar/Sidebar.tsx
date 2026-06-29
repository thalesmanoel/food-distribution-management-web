import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
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

interface MenuItem {
  label: string;
  icon: LucideIcon;
  to?: string;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Pedidos", icon: ClipboardList, to: "/pedidos" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Produtos", icon: Package, to: "/produtos" },
  { label: "Movimentações", icon: ArrowLeftRight, to: "/movimentacoes" },
  { label: "Configurações", icon: Settings },
];

export function Sidebar({ open }: Props) {
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
          const content = (
            <>
              <span className="sidebar-menu-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={2.35} />
              </span>
              <span className="sidebar-menu-label">{item.label}</span>
            </>
          );

          if (item.to) {
            return (
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to={item.to}
                key={item.label}
              >
                {content}
              </NavLink>
            );
          }

          return (
            <a aria-disabled="true" key={item.label}>
              {content}
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
