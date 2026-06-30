import React from 'react';
import PropTypes from 'prop-types';
import { HStack, Input, Select, Button } from '@chakra-ui/react';

export const DocumentoFilters = ({ busqueda, onSearch, filtroFecha, onFilterChange, onClear }) => {
  return (
    <HStack spacing={4} mb={6} flexWrap="wrap">
      <Input
        placeholder="Buscar por nombre o ID..."
        value={busqueda}
        onChange={(e) => onSearch(e.target.value)}
        bg="white"
        flex={2}
        minW="200px"
      />
      
      <Select 
        value={filtroFecha}
        onChange={(e) => onFilterChange(e.target.value)} 
        bg="white" 
        flex={1}
        minW="150px"
      >
        <option value="recientes">Más recientes primero</option>
        <option value="antiguos">Más antiguos primero</option>
      </Select>
      
      <Button onClick={onClear} colorScheme="gray" variant="ghost">
        Limpiar Filtros
      </Button>
    </HStack>
  );
};

DocumentoFilters.propTypes = {
  busqueda: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  filtroFecha: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};