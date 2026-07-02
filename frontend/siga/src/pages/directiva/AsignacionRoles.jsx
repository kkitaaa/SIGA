import React, { useState, useEffect } from "react";
import api from "../../services/api";
import "../../styles/home.css"; 
import "../../styles/asignacion_roles.css";

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
  Select
} from "@chakra-ui/react";
import { useNotification } from "../../hooks/useNotification";

function AsignacionRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tiposFuncionario, setTiposFuncionario] = useState([]); 
  const [fetchError, setFetchError] = useState(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedTipo, setSelectedTipo] = useState(""); 

  const { showSuccess, showWarning } = useNotification();
  const userRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        if (!token) {
          setFetchError("No hay un token válido. Inicia sesión de nuevo.");
          return;
        }

        const [usersRes, rolesRes, tiposRes] = await Promise.all([
          api.get("/asignacion/usuarios-sin-rol"),
          api.get("/asignacion/roles"),
          api.get("/tipos-funcionarios/funcionarios") 
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
    setSelectedTipo(""); 
    setIsOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;

    const roleObj = roles.find((r) => r.id_rol === Number(selectedRole));
    const isFuncionario = roleObj?.nombre_rol?.toLowerCase() === "funcionario";

    if (isFuncionario && !selectedTipo) {
      showWarning(
        "Falta el tipo de funcionario",
        "Debes seleccionar una especialidad para el funcionario.",
        { duration: 3000 }
      );
      return;
    }

    try {
      await api.post("/asignacion/asignacion", {
        idUsuarioDestino: selectedUser.id_usuario,
        idRolAsignado: Number(selectedRole),
        idTipoFuncionario: isFuncionario ? Number(selectedTipo) : null, 
      });

      setUsers((prevUsers) =>
        prevUsers.filter(
          (user) => user.id_usuario !== selectedUser.id_usuario
        )
      );

      showSuccess("Rol asignado exitosamente", undefined, { duration: 2000 });

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

  const roleObjToAssign = roles.find((r) => r.id_rol === Number(selectedRole));
  const isFuncionarioSelected = roleObjToAssign?.nombre_rol?.toLowerCase() === "funcionario";

  if (!token || userRole !== "Directiva") {
    return (
      <div className="home-page">
        <main className="home-main" style={{ display: 'block', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px" textAlign="center">
            <Text color="red.500" fontSize="lg" fontWeight="bold">
              {!token ? "No estás autenticado. Inicia sesión para acceder a esta página." : "Acceso denegado. Solo la Directiva puede ver esta página."}
            </Text>
          </Box>
        </main>
      </div>
    );
  }

  return (
    <div className="home-page">
      <main className="home-main" style={{ display: 'block', maxWidth: '800px', margin: '0 auto', paddingTop: '20px' }}>
        
        <Box bg="white" p={8} borderRadius="lg" shadow="sm" borderWidth="1px">
          <Heading as="h2" size="lg" mb={6} color="gray.700" borderBottom="2px solid #eee" paddingBottom="10px">
            Asignación de Roles
          </Heading>

          {fetchError && (
            <Box mb={6} p={4} bg="red.50" borderRadius="md" borderLeft="4px solid" borderColor="red.500">
              <Text color="red.700">{fetchError}</Text>
            </Box>
          )}

          <VStack spacing={4} align="stretch">
            {users.length > 0 ? (
              users.map((user) => (
                <Flex key={user.id_usuario} p={4} borderWidth="1px" borderRadius="md" align="center" gap={4} bg="gray.50" _hover={{ bg: "gray.100" }} transition="background 0.2s">
                  <Box>
                    <Text fontWeight="bold" color="gray.800">
                      {user.primer_nombre} {user.primer_apellido}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {user.cuenta?.email}
                    </Text>
                  </Box>

                  <Spacer />

                  <Select
                    value={user.assignedRole || ""}
                    onChange={(e) => handleRoleChange(user.id_usuario, e.target.value)}
                    placeholder="Seleccionar Rol..."
                    bg="white"
                    maxW="200px"
                  >
                    {roles.map((role) => (
                      <option key={role.id_rol} value={role.id_rol}>
                        {role.nombre_rol}
                      </option>
                    ))}
                  </Select>

                  <Button
                    colorScheme="blue"
                    onClick={() => handleConfirmClick(user)}
                    isDisabled={!user.assignedRole}
                    px={6}
                  >
                    Asignar
                  </Button>
                </Flex>
              ))
            ) : (
              <Box textAlign="center" py={10}>
                <Text color="gray.500" fontSize="lg">
                  No hay usuarios pendientes de asignación de rol.
                </Text>
              </Box>
            )}
          </VStack>

          {/* MODAL DE CONFIRMACIÓN */}
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmar Asignación de Rol</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <Text mb={4}>
                  ¿Estás seguro de asignar el rol de <strong>{roleObjToAssign?.nombre_rol}</strong> a <strong>{selectedUser?.primer_nombre} {selectedUser?.primer_apellido}</strong>?
                </Text>

                {isFuncionarioSelected && (
                  <Box mt={4} p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                    <Text fontWeight="bold" mb={2}>Especialidad requerida:</Text>
                    <Select
                      placeholder="Selecciona la especialidad..."
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
      </main>
    </div>
  );
}

export default AsignacionRoles;