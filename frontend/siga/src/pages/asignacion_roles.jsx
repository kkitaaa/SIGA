import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/asignacion_roles.css";

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
} from "@chakra-ui/react";

function AsignacionRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!token) {
          setFetchError("No hay un token válido. Inicia sesión de nuevo.");
          return;
        }

        const res = await api.get("/usuarios-sin-rol");

        setUsers(res.data.usuarios || []);
      } catch (err) {
        setFetchError(
          err.response?.data?.mensaje ||
            err.response?.data?.error ||
            err.message
        );
      }
    };

    const fetchRoles = async () => {
      try {
        if (!token) {
          setFetchError("No hay un token válido. Inicia sesión de nuevo.");
          return;
        }

        const res = await api.get("/roles");

        setRoles(res.data.roles || []);
      } catch (err) {
        setFetchError(
          err.response?.data?.mensaje ||
            err.response?.data?.error ||
            err.message
        );
      }
    };

    fetchUsers();
    fetchRoles();
  }, [token]);

  const handleRoleChange = (userId, roleId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id_usuario === userId
          ? { ...user, assignedRole: roleId }
          : user
      )
    );
  };

  const handleConfirmClick = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.assignedRole || "");
    setIsOpen(true);
  };

  const handleAssignRole = async () => {
    if (selectedUser && selectedRole) {
      try {
        await api.post("/asignar-rol", {
          idUsuarioDestino: selectedUser.id_usuario,
          idRolAsignado: Number(selectedRole),
        });

        setUsers((prevUsers) =>
          prevUsers.filter(
            (user) => user.id_usuario !== selectedUser.id_usuario
          )
        );

        setSelectedUser(null);
        setSelectedRole("");
        setIsOpen(false);
      } catch (err) {
        setFetchError(
          err.response?.data?.mensaje ||
            err.response?.data?.error ||
            err.message
        );
      }
    }
  };

  if (!token) {
    return (
      <Text color="red.500">
        No estás autenticado. Inicia sesión para acceder a esta página.
      </Text>
    );
  }

  if (userRole !== "Administrativo") {
    return (
      <Text color="red.500">
        Acceso denegado. Solo usuarios administrativos pueden ver esta página.
      </Text>
    );
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" maxW="xl" w="full">
        <Heading as="h2" size="lg" mb={6} textAlign="center" color="gray.700">
          Asignación de Roles
        </Heading>

        {fetchError && (
          <Text color="red.500" mb={4} textAlign="center">
            {fetchError}
          </Text>
        )}

        <VStack spacing={4} align="stretch">
          {users.length > 0 ? (
            users.map((user) => (
              <Flex
                key={user.id_usuario}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                align="center"
                gap={3}
              >
                <Box>
                  <Text fontWeight="bold">
                    {user.primer_nombre} {user.primer_apellido}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {user.cuenta?.email}
                  </Text>
                </Box>

                <Spacer />

                <select
                  value={user.assignedRole || ""}
                  onChange={(e) =>
                    handleRoleChange(user.id_usuario, e.target.value)
                  }
                  className="role-select"
                >
                  <option value="" disabled>
                    Rol...
                  </option>
                  {roles.map((role) => (
                    <option key={role.id_rol} value={role.id_rol}>
                      {role.nombre_rol}
                    </option>
                  ))}
                </select>

                <Button
                  colorScheme="blue"
                  onClick={() => handleConfirmClick(user)}
                  disabled={!user.assignedRole}
                >
                  Asignar
                </Button>
              </Flex>
            ))
          ) : (
            <Text textAlign="center" color="gray.500">
              No hay usuarios pendientes de asignación de rol.
            </Text>
          )}
        </VStack>

        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Asignación de Rol</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Text>
                ¿Estás seguro de asignar el rol de{" "}
                <strong>
                  {
                    roles.find((r) => r.id_rol === Number(selectedRole))
                      ?.nombre_rol
                  }
                </strong>{" "}
                a{" "}
                <strong>
                  {selectedUser?.primer_nombre} {selectedUser?.primer_apellido}
                </strong>
                ?
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={handleAssignRole}>
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
}

export default AsignacionRoles;