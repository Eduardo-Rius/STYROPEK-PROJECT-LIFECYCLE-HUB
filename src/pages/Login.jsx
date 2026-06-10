import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Server, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { register as authRegister, createUserDoc } from "../services/authService";
import { SEED_USERS } from "../data/seedData";
import styropekLogo from "../assets/styropek-logo.webp";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setLoginError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setLoading(true);
    setLoginError(null);
    try {
      await login(demoEmail, "password123");

    } catch (err) {
      console.warn("Login failed, attempting auto-provisioning...", err);
      const seedUser = SEED_USERS.find(u => u.email === demoEmail);
      if (seedUser) {
        try {
          const authRes = await authRegister(demoEmail, "password123");
          await createUserDoc(authRes.user.uid, {
            fullName: seedUser.fullName,
            email: seedUser.email,
            role: seedUser.role,
            department: seedUser.department || "",
            areaId: seedUser.areaId || "",
            plantId: seedUser.plantId || "",
            position: seedUser.position || "",
            isActive: true
          });
          await login(demoEmail, "password123");
          navigate("/", { replace: true });
        } catch (regErr) {
          console.error("Auto-provisioning failed:", regErr);
          setLoginError(`Error al iniciar sesión: ${regErr.message}`);
        }
      } else {
        setLoginError(`Error al iniciar sesión: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row bg-industrial-950 font-sans">
      {/* Branding Column */}
      <div className="md:w-1/2 flex flex-col justify-between p-12 bg-gradient-to-br from-brand-900 to-industrial-950 border-r border-industrial-900/60 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl"></div>
        
        <div className="flex items-center gap-2.5 z-10">
          <img src={styropekLogo} alt="Styropek Logo" className="h-10 object-contain brightness-0 invert" />
          <span className="font-bold text-lg text-white font-heading tracking-wider">
            Lifecycle Hub
          </span>
        </div>

        <div className="my-auto py-12 z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight font-heading">
            Project Lifecycle <br />
            <span className="text-brand-400">Hub</span>
          </h1>
          <p className="text-sm text-industrial-300 mt-4 leading-relaxed max-w-md">
            Digitalización del ciclo completo de vida de proyectos CAPEX. Expediente digital 360° para control de inversiones de capital, aprobaciones e ingeniería.
          </p>
        </div>

        <div className="text-xs text-industrial-500 z-10">
          © {new Date().getFullYear()} Styropek. Todos los derechos reservados.
        </div>
      </div>

      {/* Form Column */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-industrial-950">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl p-8 shadow-2xl flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading tracking-tight">
              Ingresar al Hub
            </h2>
            <p className="text-xs text-industrial-400 mt-1">
              Introduce tus credenciales para acceder a la plataforma corporativa.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-xs text-red-400">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-industrial-300 mb-1.5 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-industrial-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@styropek.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-industrial-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-smooth"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-300 mb-1.5 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-industrial-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-industrial-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-smooth"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-industrial-500 hover:text-industrial-300 transition-smooth focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-brand-600/15 transition-smooth text-sm mt-2"
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
          </form>

          {/* Quick Login Shortcuts */}
          <div className="border-t border-white/5 pt-5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-industrial-300 uppercase tracking-wider mb-3">
              <Server className="w-3.5 h-3.5 text-brand-400" />
              <span>Accesos Demo Rápidos (Contraseña: password123)</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin("director@styropek.com")}
                className="py-1.5 px-2.5 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 text-left transition-smooth"
              >
                Director CAPEX
              </button>
              <button
                onClick={() => handleQuickLogin("leader@styropek.com")}
                className="py-1.5 px-2.5 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 text-left transition-smooth"
              >
                Líder de Proyecto
              </button>
              <button
                onClick={() => handleQuickLogin("admin@styropek.com")}
                className="py-1.5 px-2.5 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 text-left transition-smooth"
              >
                Administrador
              </button>
              <button
                onClick={() => handleQuickLogin("solicitante@styropek.com")}
                className="py-1.5 px-2.5 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 text-left transition-smooth"
              >
                Solicitante
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
