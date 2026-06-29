import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Select,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";

import api from "../services/api";

export default function AsignacionPIEPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [estudianteId, setEstudianteId] = useState("");
  const [funcionarioId, setFuncionarioId] = useState("");

  const toast = useToast();

  const cargarDatos = async () => {
    try {
      const [asignacionesRes, estudiantesRes, funcionariosRes] = await Promise.all([
        api.get("/asignacion-pie"),
        api.get("/estudiantes/nee"),
        api.get("/funcionarios")
      ]);

      setAsignaciones(asignacionesRes.data.asignaciones || []);
      setEstudiantes(estudiantesRes.data.estudiantes || []);
      setFuncionarios(funcionariosRes.data || []);
      
    } catch (error) {
      console.error(error);

      toast({
        title: "Error cargando datos",
        description: "Hubo un problema al conectar con el servidor.",
        status: "error",
      });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearAsignacion = async () => {
    if (!estudianteId || !funcionarioId) {
      toast({
        title: "Faltan datos",
        description: "Por favor selecciona un estudiante y un funcionario.",
        status: "warning",
      });
      return;
    }

    try {
      await api.post("/asignacion-pie", {
        idEstudiante: Number(estudianteId),
        idFuncionario: Number(funcionarioId),
      });

      toast({
        title: "Asignación creada",
        status: "success",
      });

      setEstudianteId("");
      setFuncionarioId("");

      cargarDatos();
    } catch (error) {
      console.error(error);

      toast({
        title: "Error al crear asignación",
        description: error.response?.data?.mensaje || "Error interno del servidor",
        status: "error",
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Asignación PIE</Heading>

      <VStack spacing={4} align="stretch">
        <Select
          placeholder="Selecciona estudiante (Solo NEE)"
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
        >
          {estudiantes.map((e) => (
            <option
              key={e.id_estudiante}
              value={e.id_estudiante}
            >
              {e.primer_nombre} {e.primer_apellido} ({e.rut})
            </option>
          ))}
        </Select>

        <Select
          placeholder="Selecciona funcionario"
          value={funcionarioId}
          onChange={(e) => setFuncionarioId(e.target.value)}
        >
          {funcionarios.map((f) => (
            <option
              key={f.id_funcionario}
              value={f.id_funcionario}
            >
              {f.nombre} - {f.tipo_profesional}
            </option>
          ))}
        </Select>

        <Button colorScheme="blue" onClick={crearAsignacion}>
          Registrar asignación
        </Button>
      </VStack>

      <Box mt={6}>
        <Heading size="md" mb={4}>Asignaciones Activas</Heading>

        {asignaciones.map((a) => (
          <Box
            key={a.id_asignacion}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            mt={2}
            shadow="sm"
          >
            <strong>ID Estudiante:</strong> {a.id_estudiante} | <strong>ID Funcionario:</strong> {a.id_funcionario}
          </Box>
        ))}
      </Box>
    </Box>
  );
}