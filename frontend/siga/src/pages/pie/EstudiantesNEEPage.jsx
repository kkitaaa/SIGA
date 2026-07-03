import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types'; 
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Select, VStack, HStack } from '@chakra-ui/react';
import api from '../../services/api';
import { EstudiantesPIETable } from '../../components/pie/EstudiantesPIETable';
import { useNotification } from '../../hooks/useNotification';
import ProfileMenu from '../../components/dashboard/ProfileMenu';
import LogoSIGA from '../../assets/Logo SIGA.svg';
import "../../styles/home.css";
import "../../styles/usuarios.css";

const cruzarDatosEstudiantes = (estsData, asigsData, funcsData) => {
  return estsData.map((est) => {
    const misAsignaciones = asigsData.filter((a) => a.id_estudiante === est.id_estudiante);

    const profesionales = misAsignaciones
      .map((a) => {
        const func = funcsData.find((f) => f.id_funcionario === a.id_funcionario);
        return func ? { nombre: func.nombre, especialidad: func.tipo_profesional } : null;
      })
      .filter(Boolean);

    return {
      ...est,
      nombre_completo: `${est.primer_nombre} ${est.primer_apellido}`,
      funcionarios_asignados: profesionales,
      nombre_curso: est.id_curso ? `Curso ID: ${est.id_curso}` : 'Sin curso',
    };
  });
};

export default function EstudiantesNEEPage({ user }) {
  const navigate = useNavigate();
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para los filtros
  const [busqueda, setBusqueda] = useState('');
  const [cursoFiltro, setCursoFiltro] = useState('');
  const [profesionalFiltro, setProfesionalFiltro] = useState('');

  const { showError } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estsRes, asigsRes, funcsRes] = await Promise.all([
          api.get('/estudiantes/nee'),
          api.get('/asignacion-pie'),
          api.get('/funcionarios')
        ]);

        const estsData = estsRes.data.estudiantes || [];
        const asigsData = asigsRes.data.asignaciones || [];
        const funcsData = funcsRes.data || []; 

        const dataCruzada = cruzarDatosEstudiantes(estsData, asigsData, funcsData); // Usamos tu función externa!

        setEstudiantes(dataCruzada);

      } catch (error) {
        console.error("Error al cargar la data:", error);
        showError(
          "Error de conexión",
          "No se pudieron cargar los datos de los estudiantes.",
          { duration: 5000 }
        );
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [showError]);

  const cursosDisponibles = useMemo(() => {
    const cursos = estudiantes.map(e => e.nombre_curso).filter(Boolean);
    return [...new Set(cursos)];
  }, [estudiantes]);

  const profesionalesDisponibles = useMemo(() => {
    const profes = estudiantes.flatMap(e => (e.funcionarios_asignados || []).map(f => f.nombre));
    return [...new Set(profes)];
  }, [estudiantes]);

  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter(est => {
      const nombre = est.nombre_completo?.toLowerCase() || '';
      const rut = est.rut || '';
      
      const coincideBusqueda = nombre.includes(busqueda.toLowerCase()) || rut.includes(busqueda);
      
      const coincideCurso = cursoFiltro ? est.nombre_curso === cursoFiltro : true;
      
      const coincideProfesional = profesionalFiltro 
        ? (est.funcionarios_asignados || []).some(f => f.nombre === profesionalFiltro) 
        : true;

      return coincideBusqueda && coincideCurso && coincideProfesional;
    });
  }, [estudiantes, busqueda, cursoFiltro, profesionalFiltro]);

  const totalPages = Math.max(1, Math.ceil(estudiantesFiltrados.length / PAGE_SIZE));

  React.useEffect(() => {
    setPage(1);
  }, [busqueda, cursoFiltro, profesionalFiltro]);

  const paginatedEstudiantes = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return estudiantesFiltrados.slice(start, start + PAGE_SIZE);
  }, [estudiantesFiltrados, page]);

  const handleVerDetalle = (estudiante) => {
    navigate(`/estudiantes/${estudiante.id_estudiante}`);
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
          <span className="home-role-badge">{user?.rol || 'Coordinador PIE'}</span>
          <ProfileMenu user={user} />
        </div>
      </header>

      <button type="button" className="usuarios-back-link" onClick={() => navigate('/pie')}>← Volver</button>

      <div className="usuarios-header">
        <div>
          <p className="usuarios-eyebrow">Gestión</p>
          <h1>Estudiantes PIE</h1>
          <p className="usuarios-subtitle">Listado y gestión de estudiantes PIE. Selecciona un estudiante para ver el detalle.</p>
        </div>
        <div className="usuarios-header-actions" />
      </div>

      <div className="usuarios-content">
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          <VStack spacing={4} align="stretch" mb={6}>
            <HStack spacing={4}>
              <Input 
                placeholder="Buscar por Nombre o RUT..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                flex={2}
              />
              
              <Select 
                placeholder="Todos los cursos" 
                value={cursoFiltro}
                onChange={(e) => setCursoFiltro(e.target.value)}
                flex={1}
              >
                {cursosDisponibles.map(curso => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </Select>

              <Select 
                placeholder="Todos los profesionales" 
                value={profesionalFiltro}
                onChange={(e) => setProfesionalFiltro(e.target.value)}
                flex={1}
              >
                {profesionalesDisponibles.map(profe => (
                  <option key={profe} value={profe}>{profe}</option>
                ))}
              </Select>
            </HStack>
          </VStack>

          {cargando ? (
            <Box textAlign="center" py={10} color="gray.500">Cargando datos...</Box>
          ) : (
            <>
              <EstudiantesPIETable 
                estudiantes={paginatedEstudiantes} 
                onVerDetalle={handleVerDetalle} 
              />

              <div className="usuarios-pagination" style={{ marginTop: '1rem' }}>
                <button type="button" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</button>
              </div>
            </>
          )}
        </Box>
      </div>
    </div>
  );
}

EstudiantesNEEPage.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    rol: PropTypes.string,
  }),
};