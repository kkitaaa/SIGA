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
  Select, // Importamos Select de Chakra UI
  useToast // Añadimos toast para validaciones
} from "@chakra-ui/react";

function AsignacionRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tiposFuncionario, setTiposFuncionario] = useState([]); // Nuevo estado
  const [fetchError, setFetchError] = useState(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTipo, setSelectedTipo] = useState(""); // Nuevo estado para el tipo

  const toast = useToast();
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (!token) {
          setFetchError("No hay un token válido. Inicia sesión de nuevo.");
          return;
        }

        // Ejecutamos las peticiones en paralelo para mayor rapidez
        const [usersRes, rolesRes, tiposRes] = await Promise.all([
          api.get("/asignacion/usuarios-sin-rol"),
          api.get("/asignacion/roles"),
          api.get("/tipos-funcionarios/funcionarios") // Endpoint que creamos antes
        ]);

        setUsers(usersRes.data.usuarios || []);
        setRoles(rolesRes.data.roles || []);
        setTiposFuncionario(tiposRes.data || []);
      } catch (err) {
        setFetchError(
          err.response?.data?.mensaje ||
            err.response?.data?.error ||
            err.message
        );
      }
    };

    fetchDatos();
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
    setSelectedTipo(""); // Limpiamos la selección anterior
    setIsOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    const roleObj = roles.find((r) => r.id_rol === Number(selectedRole));
    const isFuncionario = roleObj?.nombre_rol?.toLowerCase() === "funcionario";

    // Validación extra: si es funcionario, DEBE tener un tipo seleccionado
    if (isFuncionario && !selectedTipo) {
      toast({
        title: "Falta el tipo de funcionario",
        description: "Debes seleccionar una especialidad para el funcionario.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await api.post("/asignacion/asignacion", {
        idUsuarioDestino: selectedUser.id_usuario,
        idRolAsignado: Number(selectedRole),
        // Si es funcionario enviamos el idTipoFuncionario, si no, null
        idTipoFuncionario: isFuncionario ? Number(selectedTipo) : null, 
      });

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.id_usuario !== selectedUser.id_usuario
        )
      );

      toast({
        title: "Rol asignado",
        status: "success",
        duration: 2000,
      });

      setSelectedUser(null);
      setSelectedRole("");
      setSelectedTipo("");
      setIsOpen(false);
    } catch (err) {
      setFetchError(
        err.response?.data?.mensaje ||
          err.response?.data?.error ||
          err.message
      );
    }
  };

  // Verificamos si el rol a asignar es "Funcionario"
  const roleObjToAssign = roles.find((r) => r.id_rol === Number(selectedRole));
  const isFuncionarioSelected = roleObjToAssign?.nombre_rol?.toLowerCase() === "funcionario";

  if (!token) {
    return <Text color="red.500">No estás autenticado. Inicia sesión para acceder a esta página.</Text>;
  }

  if (userRole !== "Directiva") {
    return <Text color="red.500">Acceso denegado. Solo personal autorizado puede ver esta página.</Text>;
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
              <Flex key={user.id_usuario} p={3} borderWidth="1px" borderRadius="md" align="center" gap={3}>
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
                  onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                  className="role-select"
                >
                  <option value="" disabled>Rol...</option>
                  {roles.map((role) => (
                    <option key={role.id_rol} value={role.id_rol}>
                      {role.nombre_rol}
                    </option>
                  ))}
                </select>

                <Button
                  colorScheme="blue"
                  onClick={() => handleConfirmClick(user)}
                  isDisabled={!user.assignedRole}
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
              <Text mb={4}>
                ¿Estás seguro de asignar el rol de <strong>{roleObjToAssign?.nombre_rol}</strong> a <strong>{selectedUser?.primer_nombre} {selectedUser?.primer_apellido}</strong>?
              </Text>

              {/* Mostrar Select secundario SI el rol es Funcionario */}
              {isFuncionarioSelected && (
                <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                  <Text fontWeight="bold" mb={2}>Especialidad requerida:</Text>
                  <Select
                    placeholder="Selecciona el tipo de funcionario..."
                    value={selectedTipo}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    bg="white"
                  >
                    {tiposFuncionario.map((tipo) => (
                      <option key={tipo.id_tipo_funcionario} value={tipo.id_tipo_funcionario}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
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