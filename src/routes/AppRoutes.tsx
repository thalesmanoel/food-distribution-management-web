import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/unauth/Login/LoginPage";
import { Dashboard } from "../pages/auth/Dashboard/Dashboard";
import { Customers } from "../pages/auth/Customers/Customers";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  );
}
