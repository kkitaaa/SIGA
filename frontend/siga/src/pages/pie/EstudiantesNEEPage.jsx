import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types'; 
import { Box, Heading, Input, Select, VStack, HStack } from '@chakra-ui/react';
import api from '../../services/api';
import { EstudiantesPIETable } from '../../components/pie/EstudiantesPIETable';
import { useNotification } from '../../hooks/useNotification';
import "../../styles/home.css";

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
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);

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

        const dataCruzada = cruzarDatosEstudiantes(estsData, asigsData, funcsData);

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
    const cursos = estudiantes.map((e) => e.nombre_curso).filter(Boolean);
    return [...new Set(cursos)];
  }, [estudiantes]);

  const profesionalesDisponibles = useMemo(() => {
    const profes = estudiantes.flatMap((e) => (e.funcionarios_asignados || []).map((f) => f.nombre));
    return [...new Set(profes)];
  }, [estudiantes]);

  const estudiantesFiltrados = useMemo(() => {
    return estudiantes.filter((est) => {
      const nombre = est.nombre_completo?.toLowerCase() || '';
      const rut = est.rut || '';

      const coincideBusqueda = nombre.includes(busqueda.toLowerCase()) || rut.includes(busqueda);

      const coincideCurso = cursoFiltro ? est.nombre_curso === cursoFiltro : true;

      const coincideProfesional = profesionalFiltro
        ? (est.funcionarios_asignados || []).some((f) => f.nombre === profesionalFiltro)
        : true;

      return coincideBusqueda && coincideCurso && coincideProfesional;
    });
  }, [estudiantes, busqueda, cursoFiltro, profesionalFiltro]);

  const handleVerDetalle = (estudiante) => {
    console.log("Ver detalle del estudiante:", estudiante);
    alert(`Próximamente: Detalle de ${estudiante.nombre_completo}`);
  };

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="lg" mb={6} color="gray.700">Listado Estudiantes PIE</Heading>
          
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
            <EstudiantesPIETable 
              estudiantes={estudiantesFiltrados} 
              onVerDetalle={handleVerDetalle} 
            />
          )}

        </Box>
      </main>
    </div>
  );
}

EstudiantesNEEPage.propTypes = {
  user: PropTypes.shape({
    nombre: PropTypes.string,
    rol: PropTypes.string,
  }),
};