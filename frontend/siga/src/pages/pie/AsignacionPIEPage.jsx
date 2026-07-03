import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { useNotification } from "../../hooks/useNotification";
import ProfileMenu from "../../components/dashboard/ProfileMenu"; 
import LogoSIGA from "../../assets/Logo SIGA.svg";
import "../../styles/home.css";
import "../../styles/usuarios.css";

const validateUser = (props, propName, componentName) => {
  const value = props[propName];

  if (value == null) {
    return null;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return new Error(`Prop ${propName} should be an object in ${componentName}.`);
  }

  if (value.rol != null && typeof value.rol !== "string") {
    return new Error(`Prop ${propName}.rol should be a string in ${componentName}.`);
  }

  return null;
};

export default function AsignacionPIEPage({ user }) {
  const navigate = useNavigate();
  const [estudiantes, setEstudiantes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [estudianteId, setEstudianteId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");

  const { showSuccess, showWarning, showError } = useNotification();

  const cargarDatos = async () => {
    try {
      const [asignacionesRes, estudiantesRes, funcionariosRes] = await Promise.all([
        api.get("/asignacion-pie"),
        api.get("/estudiantes/nee"),
        api.get("/funcionarios")
      ]);

      setAsignaciones(asignacionesRes.data.asignaciones || []);
      setEstudiantes(estudiantesRes.data.estudiantes || []);
      setFuncionarios(funcionariosRes.data || []);
      
    } catch (error) {
      console.error(error);
      showError(
        "Error cargando datos",
        "Hubo un problema al conectar con el servidor."
      );
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearAsignacion = async () => {
    if (!estudianteId || !funcionarioId) {
      showWarning(
        "Faltan datos",
        "Por favor selecciona un estudiante y un funcionario."
      );
      return;
    }

    try {
      await api.post("/asignacion-pie", {
        idEstudiante: Number(estudianteId),
        idFuncionario: Number(funcionarioId),
      });

      showSuccess("Asignación creada");

      setEstudianteId("");
      setFuncionarioId("");

      cargarDatos();
    } catch (error) {
      console.error(error);
      showError(
        "Error al crear asignación",
        error.response?.data?.mensaje || "Error interno del servidor"
      );
    }
  };

  return (
    <div className="usuarios-page">
      <header className="home-topbar usuarios-topbar">
        <div className="home-topbar-left">
          <div className="home-brand">
            <img src={LogoSIGA} alt="SIGA" className="site-logo" />
          </div>
        </div>

        <div className="home-topbar-center">
          <div className="home-topbar-nav" aria-label="Navegación principal">
            <button type="button" className="home-nav-button" onClick={() => navigate('/cursos')}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate('/home')} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate('/documentos')}>Documentos</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || 'PIE'}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <button type="button" className="usuarios-back-link" onClick={() => navigate('/pie')}>← Volver</button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">PIE</p>
          <h1>Asignación PIE</h1>
          <p className="usuarios-subtitle">Asigna funcionarios a estudiantes con Necesidades Educativas Especiales (PIE).</p>
        </div>
        <div className="usuarios-header-actions" />
      </div>

      <main className="home-main">
        <section className="home-panel home-welcome-panel">
          <div className="home-card">
            <h2>Registrar nueva asignación</h2>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Select
                  placeholder="Selecciona estudiante (Solo PIE)"
                  value={estudianteId}
                  onChange={(e) => setEstudianteId(e.target.value)}
                  bg="white"
                  style={{ minWidth: 240 }}
                >
                  {estudiantes.map((e) => (
                    <option key={e.id_estudiante} value={e.id_estudiante}>
                      {e.primer_nombre} {e.primer_apellido} ({e.rut})
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Selecciona funcionario"
                  value={funcionarioId}
                  onChange={(e) => setFuncionarioId(e.target.value)}
                  bg="white"
                  style={{ minWidth: 240 }}
                >
                  {funcionarios.map((f) => (
                    <option key={f.id_funcionario} value={f.id_funcionario}>
                      {f.nombre} - {f.tipo_profesional}
                    </option>
                  ))}
                </Select>

                <button type="button" className="usuarios-action is-active" onClick={crearAsignacion} style={{ height: 40 }}>
                  Registrar asignación
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="home-panel home-news-panel">
          <div className="home-aside-card">
            <h2>Asignaciones Activas</h2>

            <Box mt={4} maxH="400px" overflowY="auto">
              {asignaciones.length > 0 ? (
                asignaciones.map((a) => (
                  <Box
                    key={a.id_asignacion}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    mb={3}
                    shadow="sm"
                    bg="white"
                  >
                    <strong>ID Estudiante:</strong> {a.id_estudiante} <br/>
                    <strong>ID Funcionario:</strong> {a.id_funcionario}
                  </Box>
                ))
              ) : (
                <p style={{ color: "gray", fontSize: "14px" }}>
                  No hay asignaciones registradas.
                </p>
              )}
            </Box>
          </div>
        </aside>
      </main>
    </div>
  );
}

AsignacionPIEPage.propTypes = {
  user: validateUser,
};