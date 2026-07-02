import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EstudianteFilters from "../../components/estudiantes/EstudianteFilters";
import EstudiantesTable from "../../components/estudiantes/EstudiantesTable";
import EstudianteForm from "../../components/estudiantes/EstudianteForm";
import EstudianteCard from "../../components/estudiantes/EstudianteCard";
import { estudianteService } from "../../services/estudiante.service";
import { useAuth } from "../../hooks/useAuth";
import ProfileMenu from "../../components/dashboard/ProfileMenu";
import LogoSIGA from "../../assets/Logo SIGA.svg";
import "../../styles/usuarios.css";

const PAGE_SIZE = 8;

function EstudiantesPage() {
  const navigate = useNavigate();
  const { rol, usuario } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [search, setSearch] = useState("");
  const [cursoFilter, setCursoFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [feedbackType, setFeedbackType] = useState("success");

  const loadData = async () => {
    try {
      setLoading(true);
      const estudiantesData = await estudianteService.listarEstudiantes();
      setEstudiantes(estudiantesData || []);
      setCursos((estudiantesData || []).map((estudiante) => ({ id_curso: estudiante.id_curso, nombre_curso: estudiante.curso?.nombre_curso || `Curso ${estudiante.id_curso}` })).filter((curso, index, self) => self.findIndex((item) => item.id_curso === curso.id_curso) === index));
    } catch (error) {
      console.error("No se pudieron cargar estudiantes", error);
      setFeedback("No se pudieron cargar los estudiantes.");
      setFeedbackType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEstudiantes = useMemo(() => {
    const query = search.toLowerCase();
    return (estudiantes || []).filter((estudiante) => {
      const fullName = `${estudiante.primer_nombre || ""} ${estudiante.primer_apellido || ""} ${estudiante.rut || ""}`.toLowerCase();
      const matchesSearch = !query || fullName.includes(query);
      const matchesCurso = !cursoFilter || String(estudiante.id_curso) === String(cursoFilter);
      const matchesEstado = !estadoFilter || (estadoFilter === "activo" ? estudiante.activo !== false : estudiante.activo === false);
      return matchesSearch && matchesCurso && matchesEstado;
    });
  }, [estudiantes, search, cursoFilter, estadoFilter]);

  const paginatedEstudiantes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEstudiantes.slice(start, start + PAGE_SIZE);
  }, [filteredEstudiantes, page]);

  useEffect(() => {
    setPage(1);
  }, [search, cursoFilter, estadoFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEstudiantes.length / PAGE_SIZE));

  const handleCreate = async (payload) => {
    try {
      await estudianteService.crearEstudiante(payload);
      setFeedback("Estudiante creado correctamente.");
      setFeedbackType("success");
      setMode("list");
      await loadData();
    } catch (error) {
      console.error("No se pudo crear el estudiante", error);
      setFeedback(error?.response?.data?.error || "No se pudo crear el estudiante.");
      setFeedbackType("error");
    }
  };

  const handleEdit = async (payload) => {
    try {
      await estudianteService.actualizarEstudiante(selectedStudent.id_estudiante, payload);
      setFeedback("Estudiante actualizado correctamente.");
      setFeedbackType("success");
      setMode("list");
      setSelectedStudent(null);
      await loadData();
    } catch (error) {
      console.error("No se pudo actualizar el estudiante", error);
      setFeedback(error?.response?.data?.error || "No se pudo actualizar el estudiante.");
      setFeedbackType("error");
    }
  };

  const handleDeactivate = async (estudiante) => {
    try {
      setEstudiantes((current) =>
        current.map((item) =>
          item.id_estudiante === estudiante.id_estudiante ? { ...item, activo: false } : item,
        ),
      );

      await estudianteService.desactivarEstudiante(estudiante.id_estudiante);
      setFeedback("Estudiante desactivado correctamente.");
      setFeedbackType("success");
    } catch (error) {
      setEstudiantes((current) =>
        current.map((item) =>
          item.id_estudiante === estudiante.id_estudiante ? { ...item, activo: item.activo } : item,
        ),
      );
      console.error("No se pudo desactivar el estudiante", error);
      setFeedback(error?.response?.data?.error || "No se pudo desactivar el estudiante.");
      setFeedbackType("error");
    }
  };

  const startCreate = () => {
    setSelectedStudent(null);
    setMode("create");
  };

  const startEdit = (estudiante) => {
    setSelectedStudent(estudiante);
    setMode("edit");
  };

  const showDetail = (estudiante) => {
    setSelectedStudent(estudiante);
    setMode("detail");
  };

  const backToList = () => {
    setSelectedStudent(null);
    setMode("list");
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
            <button type="button" className="home-nav-button" onClick={() => navigate("/home")}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate("/home")} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            <button type="button" className="home-nav-button" onClick={() => navigate("/admin/usuarios")}>Asignar roles</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{rol || "Administrativo"}</span>
          <ProfileMenu user={{ nombre: usuario?.nombre || "Usuario", rol: rol || "Administrativo", email: usuario?.correo || "usuario@ejemplo.com" }} />
        </div>
      </header>

      <button type="button" className="usuarios-back-link" onClick={() => navigate("/home")}>← Volver</button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">Gestión</p>
          <h1>Estudiantes</h1>
          <p className="usuarios-subtitle">Gestiona estudiantes, filtra por curso o estado y crea o edita registros desde aquí.</p>
        </div>
        <div className="usuarios-header-actions">
          <button
            type="button"
            className={`usuarios-action ${mode === "list" ? "is-active" : ""}`}
            onClick={mode === "list" ? startCreate : backToList}
          >
            {mode === "list" ? "Registrar estudiante" : "Gestionar estudiantes"}
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`usuarios-feedback ${feedbackType === "error" ? "is-error" : "is-success"}`} role="status">
          {feedback}
        </div>
      )}

      {mode === "list" ? (
        <>
          <EstudianteFilters
            search={search}
            onSearchChange={setSearch}
            cursoFilter={cursoFilter}
            onCursoFilterChange={setCursoFilter}
            estadoFilter={estadoFilter}
            onEstadoFilterChange={setEstadoFilter}
            cursos={cursos}
          />

          {loading ? (
            <div className="usuarios-loading" role="status" aria-live="polite">
              <div className="usuarios-spinner" />
              <span>Cargando estudiantes...</span>
            </div>
          ) : (
            <>
              <EstudiantesTable
                estudiantes={paginatedEstudiantes}
                onVerDetalle={showDetail}
                onEditar={startEdit}
                onDesactivar={handleDeactivate}
              />
              <div className="usuarios-pagination">
                <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Siguiente</button>
              </div>
            </>
          )}
        </>
      ) : mode === "create" ? (
        <>
          <h2 style={{ color: "#0f172a" }}>Registrar estudiante</h2>
          <EstudianteForm initialValues={null} onSubmit={handleCreate} onCancel={backToList} submitLabel="Crear estudiante" cursos={cursos} />
        </>
      ) : mode === "edit" ? (
        <>
          <h2 style={{ color: "#0f172a" }}>Editar estudiante</h2>
          <EstudianteForm initialValues={selectedStudent} onSubmit={handleEdit} onCancel={backToList} submitLabel="Guardar cambios" cursos={cursos} />
        </>
      ) : (
        <>
          <EstudianteCard estudiante={selectedStudent} onBack={backToList} />
        </>
      )}
    </div>
  );
}

export default EstudiantesPage;
