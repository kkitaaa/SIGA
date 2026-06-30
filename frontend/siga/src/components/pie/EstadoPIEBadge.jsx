import React from 'react';
import { Badge } from '@chakra-ui/react';

export const EstadoPIEBadge = ({ esNee }) => {
  return (
    <Badge colorScheme={esNee ? 'green' : 'gray'} variant="subtle" px={2} py={1} borderRadius="md">
      {esNee ? 'Activo PIE' : 'Inactivo'}
    </Badge>
  );
};