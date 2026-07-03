import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Text
} from '@chakra-ui/react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import "../../styles/home.css";

export default function MisCursosPage() {
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await api.get('/cursos/mis-cursos'); 
        setCursos(res.data || []);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        showError('Error', 'No se pudieron cargar tus cursos.');
      } finally {
        setCargando(false);
      }
    };

    fetchCursos();
  }, [showError]);

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '1000px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Button 
          onClick={() => navigate('/home')} 
          mb={4} 
          variant="outline" 
          bg="white" 
          size="sm"
        >
          &larr; Volver al Dashboard
        </Button>

        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="lg" mb={6} color="gray.700" borderBottom="2px solid #eee" paddingBottom="10px">
            Mis Cursos
          </Heading>

          {cargando ? (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : cursos.length > 0 ? (
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>ID</Th>
                  <Th>Nivel Educativo</Th>
                  <Th>Curso</Th>
                  <Th>Letra</Th>
                  <Th textAlign="center">Estudiantes</Th>
                  <Th textAlign="center">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cursos.map((curso) => (
                  <Tr key={curso.id_curso}>
                    <Td fontWeight="bold" color="gray.600">#{curso.id_curso}</Td>
                    <Td>{curso.nivel_educativo}</Td>
                    <Td>{curso.nivel_curso}</Td>
                    <Td fontWeight="bold">{curso.letra}</Td>
                    <Td textAlign="center">{curso._count?.estudiantes ?? curso.estudiantes?.length ?? "-"}</Td>
                    <Td textAlign="center">
                      <Button 
                        colorScheme="blue" 
                        size="sm" 
                        onClick={() => navigate(`/cursos/${curso.id_curso}`)}
                      >
                        Ver Curso
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Center py={10}>
              <Text color="gray.500">No tienes cursos asignados.</Text>
            </Center>
          )}
        </Box>
      </main>
    </div>
  );
}
