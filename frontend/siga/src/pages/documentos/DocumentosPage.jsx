import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Center, 
  Spinner, 
  Button, 
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import api from '../../services/api';
import { DocumentoCard } from '../../components/documentos/DocumentoCard';
import { useNotification } from '../../hooks/useNotification';
import { DocumentoFilters } from '../../components/documentos/DocumentoFilters';
import ProfileMenu from '../../components/dashboard/ProfileMenu';
import LogoSIGA from '../../assets/Logo SIGA.svg';
import { useAuth } from '../../hooks/useAuth';
import "../../styles/home.css";

const validateChildren = (props, propName, componentName) => {
  if (props[propName] == null) {
    return new Error(`Prop ${propName} is required in ${componentName}.`);
  }
  return null;
};

const validateUser = (props, propName, componentName) => {
  if (props[propName] != null && (typeof props[propName] !== 'object' || Array.isArray(props[propName]))) {
    return new Error(`Prop ${propName} should be an object in ${componentName}.`);
  }
  return null;
};

const DocumentGallery = ({ children }) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
    {children}
  </Box>
);

DocumentGallery.propTypes = {
  children: validateChildren,
};

export default function DocumentosPage({ user }) {
  const navigate = useNavigate();
  const { rol, usuario } = useAuth();

  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('recientes');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [nombreDocumento, setNombreDocumento] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const { showError, showSuccess } = useNotification();

  const fetchDocumentos = async () => {
    try {
      const response = await api.get('/documentos?page=1&limit=50');
      setDocumentos(response.data.documentos || []);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'No se pudieron cargar los documentos.';
      console.error('Error al cargar documentos', error);
      showError('Error', message, { duration: 5000 });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [showError]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivoSeleccionado(e.target.files[0]);
    }
  };

  const handleCloseModal = () => {
    setArchivoSeleccionado(null);
    setNombreDocumento('');
    onClose();
  };

  const handleUpload = async () => {
    if (!nombreDocumento.trim()) {
      showError('Advertencia', 'Por favor ingresa un nombre para el documento.', { duration: 3000 });
      return;
    }

    if (!archivoSeleccionado) {
      showError('Advertencia', 'Por favor selecciona un archivo primero.', { duration: 3000 });
      return;
    }

    try {
      setSubiendo(true);
      
      const formData = new FormData();
      formData.append('nombre', nombreDocumento.trim());
      formData.append('archivo', archivoSeleccionado); 

      await api.post('/documentos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('Éxito', 'Documento subido correctamente.');
      
      handleCloseModal();
      fetchDocumentos();

    } catch (error) {
      console.error('Error al subir documento', error);
      showError('Error', 'No se pudo subir el documento.', { duration: 5000 });
    } finally {
      setSubiendo(false);
    }
  };

  const documentosFiltrados = useMemo(() => {
    return documentos
      .filter(doc => {
        const nombreDoc = (doc.nombre || `Documento ${doc.id_documento}`).toLowerCase();
        return nombreDoc.includes(busqueda.toLowerCase());
      })
      .sort((a, b) => {
        const dateA = new Date(a.fecha_subida || 0);
        const dateB = new Date(b.fecha_subida || 0);
        return filtroFecha === 'antiguos' ? dateA - dateB : dateB - dateA;
      });
  }, [documentos, busqueda, filtroFecha]);

  const handleClearFilters = () => {
    setBusqueda('');
    setFiltroFecha('recientes');
  };

  let content;

  if (cargando) {
    content = (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  } else if (documentosFiltrados.length > 0) {
    content = (
      <DocumentGallery>
        {documentosFiltrados.map((doc) => (
          <DocumentoCard key={doc.id_documento} documento={doc} />
        ))}
      </DocumentGallery>
    );
  } else {
    content = (
      <Center py={10} color="gray.500">
        No se encontraron documentos que coincidan con tu búsqueda.
      </Center>
    );
  }

  return (
    <div className="home-page">
      <header className="home-topbar usuarios-topbar">
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
            <button type="button" className="home-nav-button" onClick={() => navigate('/admin/roles')}>Asignar roles</button>
          </div>
        </div>

        <div className="home-topbar-actions">
          <span className="home-role-badge">{rol || 'Administrativo'}</span>
          <ProfileMenu user={{ nombre: usuario?.nombre || user?.nombre || 'Usuario', rol: rol || user?.rol || 'Administrativo', email: usuario?.correo || user?.email || 'usuario@ejemplo.com' }} />
        </div>
      </header>

      <main className="home-main" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* Botón de Volver */}
        <Button 
          onClick={() => navigate(-1)} 
          mb={4} 
          variant="solid"
          bg="#0f766e"
          color="white"
          size="sm"
          borderRadius="999px"
          _hover={{ bg: '#0b5f5a' }}
        >
          &larr; Volver
        </Button>

        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          
          <HStack justifyContent="space-between" mb={6}>
            <Heading size="lg" color="gray.700">Repositorio de Documentos</Heading>
            <Button
              onClick={onOpen}
              bg="#2ec4b6"
              color="white"
              borderRadius="999px"
              _hover={{ bg: '#25a89b' }}
            >
              + Subir Documento
            </Button>
          </HStack>
          
          <DocumentoFilters 
            busqueda={busqueda}
            onSearch={setBusqueda}
            filtroFecha={filtroFecha}
            onFilterChange={setFiltroFecha}
            onClear={handleClearFilters}
          />

          {content}

        </Box>

        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Subir Nuevo Documento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired mb={4}>
                <FormLabel>Nombre del documento</FormLabel>
                <Input 
                  type="text" 
                  placeholder="Ej: Certificado de Alumno Regular"
                  value={nombreDocumento}
                  onChange={(e) => setNombreDocumento(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Selecciona un archivo de tu equipo</FormLabel>
                <Input 
                  type="file" 
                  onChange={handleFileChange} 
                  p={1} 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={handleCloseModal}
                isDisabled={subiendo}
                borderColor="#cbd5e1"
                color="#334155"
                borderRadius="999px"
                _hover={{ bg: '#f8fafc' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload}
                isLoading={subiendo}
                loadingText="Subiendo..."
                bg="#2ec4b6"
                color="white"
                borderRadius="999px"
                _hover={{ bg: '#25a89b' }}
              >
                Subir
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

      </main>
    </div>
  );
}

DocumentosPage.propTypes = {
  user: validateUser,
};