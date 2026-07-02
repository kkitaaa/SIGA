import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Button,
} from '@chakra-ui/react';

import { EstadoPIEBadge } from './EstadoPIEBadge';

const BaseTable = ({ columns, data, renderRow }) => (
  <Box overflowX="auto" bg="white" shadow="sm" borderRadius="md" borderWidth="1px">
    <Table variant="simple">
      <Thead bg="gray.50">
        <Tr>
          {columns.map((col) => (
            <Th key={col}>{col}</Th>
          ))}
        </Tr>
      </Thead>

      <Tbody>
        {data.length > 0 ? (
          data.map((item) => renderRow(item))
        ) : (
          <Tr>
            <Td colSpan={columns.length} textAlign="center" py={4} color="gray.500">
              No se encontraron resultados
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  </Box>
);

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRow: PropTypes.func.isRequired,
};

export const EstudiantesPIETable = ({ estudiantes, onVerDetalle }) => {
  const columnas = ['RUT', 'Estudiante', 'Curso', 'Apoyo PIE', 'Estado', 'Acciones'];

  return (
    <BaseTable
      columns={columnas}
      data={estudiantes}
      renderRow={(est) => (
        <Tr key={est.id_estudiante}>
          <Td>{est.rut}</Td>
          <Td fontWeight="bold">{est.nombre_completo}</Td>
          <Td>{est.curso?.nombre_curso || 'Sin curso asignado'}</Td>

          <Td>
            {est.funcionarios_asignados?.length > 0 ? (
              est.funcionarios_asignados.map((f) => (
                <Text key={f.id_funcionario} fontSize="sm">
                  • {f.nombre}{' '}
                  <Text as="span" color="gray.500">({f.especialidad})</Text>
                </Text>
              ))
            ) : (
              <Text color="gray.400" fontSize="sm">Sin profesionales asignados</Text>
            )}
          </Td>

          <Td>
            <EstadoPIEBadge esNee={est.es_nee} />
          </Td>

          <Td>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => onVerDetalle(est)}
            >
              Ver detalle
            </Button>
          </Td>
        </Tr>
      )}
    />
  );
};

EstudiantesPIETable.propTypes = {
  estudiantes: PropTypes.arrayOf(PropTypes.shape({
    id_estudiante: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rut: PropTypes.string,
    nombre_completo: PropTypes.string,
    curso: PropTypes.shape({
      nombre_curso: PropTypes.string,
    }),
    funcionarios_asignados: PropTypes.arrayOf(PropTypes.shape({
      id_funcionario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string,
      especialidad: PropTypes.string,
    })),
    es_nee: PropTypes.bool,
  })).isRequired,
  onVerDetalle: PropTypes.func.isRequired,
};

