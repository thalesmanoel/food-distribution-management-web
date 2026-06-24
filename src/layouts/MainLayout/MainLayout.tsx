import { useState } from "react";
import "./MainLayout.css";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Header } from "../../components/Header/Header";

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <div className="layout">
      <Sidebar open={sidebarOpen} />

      <div className="layout-main">
        <Header toggleSidebar={toggleSidebar} />

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}
