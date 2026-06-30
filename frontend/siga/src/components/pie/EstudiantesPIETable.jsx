import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Text, Button } from '@chakra-ui/react';
import { EstadoPIEBadge } from './EstadoPIEBadge';

const BaseTable = ({ columns, data, renderRow }) => (
  <Box overflowX="auto" bg="white" shadow="sm" borderRadius="md" borderWidth="1px">
    <Table variant="simple">
      <Thead bg="gray.50">
        <Tr>
          {columns.map((col, index) => (
            <Th key={index}>{col}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.length > 0 ? (
          data.map((item, index) => renderRow(item, index))
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

export const EstudiantesPIETable = ({ estudiantes, onVerDetalle }) => {
  const columnas = ["RUT", "Estudiante", "Curso", "Apoyo PIE", "Estado", "Acciones"];

  return (
    <BaseTable
      columns={columnas}
      data={estudiantes}
      renderRow={(est) => (
        <Tr key={est.id_estudiante}>
          <Td>{est.rut}</Td>
          <Td fontWeight="bold">{est.nombre_completo}</Td>
          <Td>{est.curso?.nombre_curso || "Sin curso asignado"}</Td>
          <Td>
            {est.funcionarios_asignados?.length > 0 ? (
              est.funcionarios_asignados.map(f => (
                <Text key={f.id_funcionario} fontSize="sm">
                  • {f.nombre} <Text as="span" color="gray.500">({f.especialidad})</Text>
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
            <Button size="sm" colorScheme="blue" variant="outline" onClick={() => onVerDetalle(est)}>
              Ver detalle
            </Button>
          </Td>
        </Tr>
      )}
    />
  );
};