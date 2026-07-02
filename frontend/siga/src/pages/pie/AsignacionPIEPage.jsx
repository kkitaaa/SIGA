import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Button,
  VStack,
} from "@chakra-ui/react";
import api from "../../services/api";
import { useNotification } from "../../hooks/useNotification";
import ProfileMenu from "../../components/dashboard/ProfileMenu"; 
import LogoSIGA from "../../assets/Logo SIGA.svg";
import "../../styles/home.css";

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
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <img src={LogoSIGA} alt="SIGA" className="site-logo" />
        </div>
        <div className="home-topbar-actions">
          <span className="home-role-badge">{user?.rol || "Administrativo"}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <main className="home-main">
        
        <section className="home-panel home-welcome-panel">
          <div className="home-welcome-title">Asignación PIE</div>
          <p className="home-welcome-subtitle">
            Asigna funcionarios a estudiantes con Necesidades Educativas Especiales (NEE).
          </p>

          <div className="home-card">
            <h2>Registrar nueva asignación</h2>
            
            <VStack spacing={4} align="stretch" mt={4}>
              <Select
                placeholder="Selecciona estudiante (Solo NEE)"
                value={estudianteId}
                onChange={(e) => setEstudianteId(e.target.value)}
                bg="white"
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
              >
                {funcionarios.map((f) => (
                  <option key={f.id_funcionario} value={f.id_funcionario}>
                    {f.nombre} - {f.tipo_profesional}
                  </option>
                ))}
              </Select>

              <Button colorScheme="blue" onClick={crearAsignacion}>
                Registrar asignación
              </Button>
            </VStack>
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