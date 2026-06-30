import React, { useState, useEffect, useMemo } from 'react';
import { Box, Heading, Input, Select, VStack, HStack, useToast } from '@chakra-ui/react';
import api from '../../services/api';
import { EstudiantesPIETable } from '../../components/pie/EstudiantesPIETable';
import "../../styles/home.css";

// TODO: PARA CUANDO TENGAS EL HOOK DE NOTIFICACIONES, DESCOMENTA ESTO:
// import { useNotification } from '../../hooks/useNotification';

export default function EstudiantesNEEPage({ user }) {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para los filtros
  const [busqueda, setBusqueda] = useState('');
  const [cursoFiltro, setCursoFiltro] = useState('');
  const [profesionalFiltro, setProfesionalFiltro] = useState('');

  const toast = useToast();
  
  // TODO: PARA CUANDO TENGAS EL HOOK, DESCOMENTA ESTO:
  // const { showError } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. LLAMAMOS A LOS 3 ENDPOINTS QUE YA EXISTEN EN TU BACKEND
        const [estsRes, asigsRes, funcsRes] = await Promise.all([
          api.get('/estudiantes/nee'),
          api.get('/asignacion-pie'),
          api.get('/funcionarios')
        ]);

        // 2. EXTRAEMOS LA DATA SEGÚN LA ESTRUCTURA DE TU BACKEND
        const estsData = estsRes.data.estudiantes || [];
        const asigsData = asigsRes.data.asignaciones || [];
        // Recordando tu otro componente, funcionarios viene directo en data
        const funcsData = funcsRes.data || []; 

        // 3. CRUZAMOS LA INFORMACIÓN AQUÍ EN EL FRONTEND
        const dataCruzada = estsData.map(est => {
          
          // Buscamos las asignaciones de este estudiante en específico
          const misAsignaciones = asigsData.filter(a => a.id_estudiante === est.id_estudiante);
          
          // Mapeamos los ID de esas asignaciones para traer el nombre del funcionario
          const profesionales = misAsignaciones.map(a => {
            const func = funcsData.find(f => f.id_funcionario === a.id_funcionario);
            return func ? { nombre: func.nombre, especialidad: func.tipo_profesional } : null;
          }).filter(Boolean); // filter(Boolean) elimina los nulos por si acaso

          return {
            ...est,
            nombre_completo: `${est.primer_nombre} ${est.primer_apellido}`,
            // Guardamos la lista de profesionales armadita para la tabla
            funcionarios_asignados: profesionales,
            // Si el backend no te trae el nombre del curso, mostramos el ID por ahora
            nombre_curso: est.id_curso ? `Curso ID: ${est.id_curso}` : 'Sin curso' 
          };
        });

        setEstudiantes(dataCruzada);

      } catch (error) {
        console.error("Error al cargar la data:", error);
        toast({
          title: "Error de conexión",
          description: "No se pudieron cargar los datos de los estudiantes.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [toast]);

  // Extraer listas únicas para los selectores de filtros protegiendo contra nulos (?)
  const cursosDisponibles = useMemo(() => {
    const cursos = estudiantes.map(e => e.nombre_curso).filter(Boolean);
    return [...new Set(cursos)];
  }, [estudiantes]);

  const profesionalesDisponibles = useMemo(() => {
    const profes = estudiantes.flatMap(e => (e.funcionarios_asignados || []).map(f => f.nombre));
    return [...new Set(profes)];
  }, [estudiantes]);

  // Lógica de filtrado cruzado protegiendo contra nulos
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

  const handleVerDetalle = (estudiante) => {
    console.log("Ver detalle del estudiante:", estudiante);
    alert(`Próximamente: Detalle de ${estudiante.nombre_completo}`);
  };

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="lg" mb={6} color="gray.700">Listado Estudiantes PIE</Heading>
          
          {/* BARRA DE FILTROS */}
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

          {/* TABLA DE RESULTADOS */}
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