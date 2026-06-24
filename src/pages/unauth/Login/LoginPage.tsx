import { useState } from "react";
import "./LoginPage.css";
import { Input } from "../../../components/Input/Input";
import { Button } from "../../../components/Button/Button";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    navigate("/dashboard");
  }

  return (
    <div className="login-container">
      <section className="login-left" aria-label="Apresentação do sistema">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">
            TS
          </span>
          <span>Sistema Tem Sabor</span>
        </div>

        <div className="left-content">
          <span className="login-eyebrow">Gestão com sabor</span>
          <h1>
            Sistema Tem Sabor
          </h1>
          <p>
            Tecnologia, organização e eficiência para transformar a gestão do seu negócio.
            Uma experiência moderna, segura e intuitiva.
          </p>
        </div>

        <div className="login-visual" aria-hidden="true">
          <span className="login-visual-tile login-visual-tile-primary" />
          <span className="login-visual-tile login-visual-tile-white" />
          <span className="login-visual-tile login-visual-tile-dark" />
          <span className="login-visual-tile login-visual-tile-red" />
        </div>
      </section>

      <section className="login-right" aria-label="Acesso ao sistema">
        <div className="form-container">
          <div className="form-header">
            <span className="form-eyebrow">Acesso ao sistema</span>
            <h2>Entrar</h2>
            <p>Bem-vindo de volta.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="login-links">
              <a href="#">Esqueceu a senha?</a>
              <a href="#">Suporte</a>
            </div>

            <Button type="submit">Entrar</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
