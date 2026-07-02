import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  Spinner, 
  Center,
  Text,
  Badge,
  Flex
} from '@chakra-ui/react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import "../../styles/home.css";

export default function CursoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCursoDetalle = async () => {
      try {
        const res = await api.get(`/cursos/${id}`);
        // Asumimos que el backend envía los datos del curso junto con un array 'estudiantes'
        const datosCurso = res.data.curso || res.data.data || res.data;
        setCurso(datosCurso);
      } catch (error) {
        console.error("Error al cargar el curso:", error);
        showError('Error', 'No se pudo cargar la información del curso.');
      } finally {
        setCargando(false);
      }
    };

    fetchCursoDetalle();
  }, [id, showError]);

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '1000px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Button 
          onClick={() => navigate(-1)} 
          mb={4} 
          variant="outline" 
          bg="white" 
          size="sm"
        >
          &larr; Volver a Cursos
        </Button>

        {cargando ? (
          <Center py={20}>
            <Spinner size="xl" color="blue.500" />
          </Center>
        ) : !curso ? (
          <Center py={20}>
            <Text color="red.500" fontWeight="bold">Curso no encontrado.</Text>
          </Center>
        ) : (
          <>
            {/* ENCABEZADO DEL CURSO */}
            <Box bg="blue.50" p={6} borderRadius="lg" shadow="sm" borderWidth="1px" borderColor="blue.100" mb={6}>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Heading size="lg" color="blue.800">
                    {curso.nivel_curso} "{curso.letra}"
                  </Heading>
                  <Text color="blue.600" mt={1}>{curso.nivel_educativo}</Text>
                </Box>
                <Badge colorScheme="blue" p={2} borderRadius="md" fontSize="md">
                  Total Alumnos: {curso.estudiantes?.length || 0}
                </Badge>
              </Flex>
            </Box>

            {/* TABLA DE ESTUDIANTES */}
            <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={4} color="gray.700">Nómina de Estudiantes</Heading>

              {(!curso.estudiantes || curso.estudiantes.length === 0) ? (
                <Text color="gray.500" textAlign="center" py={6}>
                  No hay estudiantes matriculados en este curso aún.
                </Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>RUT</Th>
                      <Th>Nombre Completo</Th>
                      <Th>PIE</Th>
                      <Th textAlign="center">Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {curso.estudiantes.map((est) => (
                      <Tr key={est.id_estudiante}>
                        <Td fontWeight="medium">{est.rut}</Td>
                        <Td>{est.primer_nombre} {est.primer_apellido}</Td>
                        <Td>
                          {est.es_nee ? (
                            <Badge colorScheme="purple">Pertenece a PIE</Badge>
                          ) : (
                            <Badge colorScheme="gray">Regular</Badge>
                          )}
                        </Td>
                        <Td textAlign="center">
                          <Button 
                            colorScheme="blue" 
                            variant="outline"
                            size="xs" 
                            // Esta ruta debe coincidir con la que creamos antes para el perfil del estudiante
                            onClick={() => navigate(`/estudiantes/${est.id_estudiante}`)}
                          >
                            Ver Perfil
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </>
        )}
      </main>
    </div>
  );
}