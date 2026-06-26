import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/unauth/Login/LoginPage";
import { Dashboard } from "../pages/auth/Dashboard/Dashboard";
import { Customers } from "../pages/auth/Customers/Customers";
import { Orders } from "../pages/auth/Orders/Orders";
import { Products } from "../pages/auth/Products/Products";
import { StockMovements } from "../pages/auth/StockMovements/StockMovements";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/clientes" element={<Customers />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/movimentacoes" element={<StockMovements />} />
      </Routes>
    </BrowserRouter>
  );
}
