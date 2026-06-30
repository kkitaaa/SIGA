import React from 'react';
import { Box, Text, Button, VStack } from '@chakra-ui/react';

export const DocumentoCard = ({ documento }) => {
  const handleDownload = () => {
    // Abre el enlace del documento en una nueva pestaña para descargarlo
    if (documento.url) {
      window.open(documento.url, '_blank');
    } else {
      alert("La URL del documento no está disponible.");
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="sm" bg="white" transition="all 0.2s" _hover={{ shadow: 'md' }}>
      <VStack align="start" spacing={3}>
        {/* Usamos el nombre del documento, o el ID si no tiene nombre */}
        <Text fontWeight="bold" noOfLines={2} color="blue.700">
          {documento.nombre || `Documento #${documento.id_documento}`}
        </Text>
        
        <Text fontSize="sm" color="gray.500">
          Subido el: {new Date(documento.fecha_subida || Date.now()).toLocaleDateString()}
        </Text>
        
        <Button size="sm" colorScheme="blue" onClick={handleDownload} width="full" variant="outline">
          Descargar Documento
        </Button>
      </VStack>
    </Box>
  );
};