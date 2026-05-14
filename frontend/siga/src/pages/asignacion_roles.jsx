import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/asignacion_roles.css';



import {
  Box,
  Flex,
  Text,
  Button,
  VStack,
  Heading,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT guardado en login
        const res = await axios.get('http://localhost:4000/usuarios-sin-rol', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.usuarios);
      } catch (err) {
        console.error('Error al cargar usuarios sin rol:', err);
      }
    };
    fetchUsers();
  }, []);


  const roles = [
    'Directiva',
    'Coordinador administrativo',
    'Coordinador PIE',
    'Profesor',
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  const handleRoleChange = (userId, role) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, assignedRole: role }
          : user
      )
    );
  };

  const handleConfirmClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.assignedRole || '');
    setIsOpen(true);
  };

  const handleAssignRole = async () => {
    if (selectedUser && selectedRole) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:4000/asignar-rol', {
          idUsuarioDestino: selectedUser.id,
          idRolAsignado: roles.indexOf(selectedRole) + 1 // ejemplo según tu BD
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Actualizar lista en frontend
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
        setSelectedUser(null);
        setSelectedRole('');
        setIsOpen(false);
      } catch (err) {
        console.error('Error al asignar rol:', err);
      }
    }
  };

  const userRole = localStorage.getItem('role'); // guardado en login

  if (userRole !== 'Administrativo') {
    return <Text color="red.500">Acceso denegado</Text>;
  }

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
        <Heading
          as="h2"
          size="lg"
          mb={6}
          textAlign="center"
          color="gray.700"
        >
          Asignación de Roles
        </Heading>

        <VStack spacing={4} align="stretch">
          {users.length > 0 ? (
            users.map((user) => (
              <Flex
                key={user.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                align="center"
                gap={3}
              >
                <Box>
                  <Text fontWeight="bold">
                    {user.name}
                  </Text>

                  <Text
                    fontSize="sm"
                    color="gray.600"
                  >
                    {user.email}
                  </Text>
                </Box>

                <Spacer />

                <select
                  value={user.assignedRole || ''}
                  onChange={(e) =>
                    handleRoleChange(
                      user.id,
                      e.target.value
                    )
                  }
                  className="role-select"
                >
                  <option value="" disabled>
                    Rol...
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>

                <Button
                  colorScheme="blue"
                  onClick={() =>
                    handleConfirmClick(user)
                  }
                  disabled={!user.assignedRole}
                >
                  Asignar
                </Button>
              </Flex>
            ))
          ) : (
            <Text
              textAlign="center"
              color="gray.500"
            >
              No hay usuarios pendientes de
              asignación de rol.
            </Text>
          )}
        </VStack>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          isCentered
        >
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>
              Confirmar Asignación de Rol
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <Text>
                ¿Estás seguro de asignar el rol
                de <strong>{selectedRole}</strong>{' '}
                a{' '}
                <strong>
                  {selectedUser?.name}
                </strong>
                ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>

              <Button
                colorScheme="blue"
                onClick={handleAssignRole}
              >
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );


export default AsignacionRoles;