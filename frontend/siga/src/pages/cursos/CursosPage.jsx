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
  Text,
  HStack
} from '@chakra-ui/react';
import api from '../../services/api';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import ProfileMenu from '../../components/dashboard/ProfileMenu';
import LogoSIGA from '../../assets/Logo SIGA.svg';
import "../../styles/home.css";

export default function CursosPage() {
  const navigate = useNavigate();
  const { rol, usuario: usuarioAutenticado } = useAuth();
  const { showError } = useNotification();
  
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        // Ajusta la ruta según tu backend
        const res = await api.get('/cursos'); 
        // Asumimos que el backend devuelve { cursos: [...] } o directamente el array
        setCursos(res.data.cursos || res.data || []);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        showError('Error', 'No se pudieron cargar los cursos.');
      } finally {
        setCargando(false);
      }
    };

    fetchCursos();
  }, [showError]);

  return (
    <div className="home-page">
      <header className="home-topbar">
        <div className="home-topbar-left">
          <div className="home-brand">
            <img src={LogoSIGA} alt="SIGA" className="site-logo" />
          </div>
        </div>

        <div className="home-topbar-center">
          <div className="home-topbar-nav" aria-label="Navegación principal">
            <button type="button" className="home-nav-button" onClick={() => navigate('/home')}>Cursos</button>
            <button type="button" className="home-nav-button home-nav-button-home" onClick={() => navigate('/home')} aria-label="Ir al inicio">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.2 12 4l8 6.2V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </button>
            {(() => {
              const roleVal = String(rol || usuarioAutenticado?.rol || '').trim().toLowerCase();
              const canAssignRoles = [
                'directiva',
                'administrativo',
                'coordinador administrativo',
              ].includes(roleVal);
              return canAssignRoles ? (
                <button type="button" className="home-nav-button" onClick={() => navigate('/admin/usuarios')}>
                  Asignar roles
                </button>
              ) : (
                <button type="button" className="home-nav-button" onClick={() => navigate('/documentos')}>
                  Documentos
                </button>
              );
            })()}
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{rol || usuarioAutenticado?.rol || 'Sin rol'}</span>
          <ProfileMenu user={usuarioAutenticado} />
        </div>
      </header>

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
            Directorio de Cursos
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
              <Text color="gray.500">No hay cursos registrados en el sistema.</Text>
            </Center>
          )}
        </Box>
      </main>
    </div>
  );
}