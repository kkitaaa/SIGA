import React, { useState } from 'react';
import '../styles/roles.css';
import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Heading,
  Spacer,
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogBackdrop,
  DialogTitle,
  DialogCloseTrigger,
} from '@chakra-ui/react';

function Roles() {
  // usuarios (simulados sin backend)
  const [users, setUsers] = useState([
    { id: 'user1', name: 'Ruben Doblas', email: 'ruben.doblas@example.com', assignedRole: null },
    { id: 'user2', name: 'Roman Rojas', email: 'roman.rojas@example.com', assignedRole: null },
    { id: 'user3', name: 'Tulio Triviño', email: 'tulio.trivino@example.com', assignedRole: null },
    { id: 'user4', name: 'Kike Morande', email: 'kike.morande@example.com', assignedRole: null },
  ]);

  const roles = ['Directiva', 'Coordinador administrativo', 'Coordinador PIE', 'Profesor'];

  // estado para el modal de confirmacion
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (userId, role) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, assignedRole: role } : user
      )
    );
  };

  const handleConfirmClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.assignedRole || '');  // cargar el rol actual del usuario
    setIsOpen(true);
  };

  const handleAssignRole = () => {
    if (selectedUser && selectedRole) {
      // solo una simulacion de asignacion de rol (sin backend)
      console.log(`Asignando rol "${selectedRole}" a ${selectedUser.name}`);

      // elimina al usuario de la lista una vez asignado el rol
      setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));

      setSelectedUser(null);
      setSelectedRole('');
      setIsOpen(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="xl"
        w="full"
      >
        <Heading as="h2" size="lg" mb={6} textAlign="center" color="gray.700">
          Asignación de Roles
        </Heading>

        <VStack spacing={4} align="stretch">
          {users.length > 0 ? (
            users.map(user => (
              <Flex key={user.id} p={3} borderWidth="1px" borderRadius="md" align="center">
                <Box>
                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="sm" color="gray.600">{user.email}</Text>
                </Box>
                <Spacer />
                {/* use un select estandar con estilo minimalista para evitar errores de v3 */}
                <select
                  value={user.assignedRole || ''}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="role-select"
                >
                  <option value="" disabled>Rol...</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                
                <Button
                  colorPalette="blue"
                  onClick={() => handleConfirmClick(user)}
                  isDisabled={!user.assignedRole}
                >
                  Asignar
                </Button>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" color="gray.500">No hay usuarios pendientes de asignación de rol.</Text>
          )}
        </VStack>

        {/* modal de confirmacion para estructura v3 */}
        <DialogRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
          <DialogBackdrop />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Asignación de Rol</DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <Text>¿Estás seguro de asignar el rol de <strong>{selectedRole}</strong> a <strong>{selectedUser?.name}</strong>?</Text>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>Cancelar</Button>
              </DialogActionTrigger>
              <Button colorPalette="blue" onClick={handleAssignRole}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Box>
    </Flex>
  );
}

export default Roles;