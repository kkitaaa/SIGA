import React, { useState, useEffect, useMemo } from 'react';
import { Box, Heading, useToast, Center, Spinner } from '@chakra-ui/react';
import api from '../../services/api';
import { DocumentoCard } from '../../components/documentos/DocumentoCard';
import { DocumentoFilters } from '../../components/documentos/DocumentoFilters';
import "../../styles/home.css"; // Reutilizamos tu layout

// ---------------------------------------------------------------------
// PATRÓN COMPOSITE: Este componente actúa como el "Composite" (Agrupador)
// Trata a todos sus hijos (los DocumentoCard u otras carpetas) de manera uniforme.
// ---------------------------------------------------------------------
const DocumentGallery = ({ children }) => (
  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={6}>
    {children}
  </Box>
);

export default function DocumentosPage({ user }) {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estados para buscar y filtrar
  const [busqueda, setBusqueda] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('recientes');
  
  const toast = useToast();

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        // Consumimos el endpoint paginado que armamos en el backend
        const response = await api.get('/documentos?page=1&limit=50');
        setDocumentos(response.data.documentos || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      } finally {
        setCargando(false);
      }
    };

    fetchDocumentos();
  }, [toast]);

  // Lógica de filtrado en memoria
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

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading size="lg" mb={6} color="gray.700">Repositorio de Documentos</Heading>
          
          <DocumentoFilters 
            busqueda={busqueda}
            onSearch={setBusqueda}
            filtroFecha={filtroFecha}
            onFilterChange={setFiltroFecha}
            onClear={handleClearFilters}
          />

          {cargando ? (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : documentosFiltrados.length > 0 ? (
            
            /* USAMOS EL COMPOSITE AQUÍ */
            <DocumentGallery>
              {documentosFiltrados.map((doc) => (
                <DocumentoCard key={doc.id_documento} documento={doc} />
              ))}
            </DocumentGallery>

          ) : (
            <Center py={10} color="gray.500">
              No se encontraron documentos que coincidan con tu búsqueda.
            </Center>
          )}

        </Box>
      </main>
    </div>
  );
}