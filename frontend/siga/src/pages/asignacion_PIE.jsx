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
  const [profesionales, setProfesionales] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [estudianteId, setEstudianteId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");

  const toast = useToast();

  const cargarDatos = async () => {
    try {
      const [e, p, a] = await Promise.all([
        api.get("/estudiantes"),
        api.get("/profesionales"),
        api.get("/pie/asignaciones"),
      ]);

      setEstudiantes(e.data);
      setProfesionales(p.data);
      setAsignaciones(a.data);
    } catch {
      toast({
        title: "Error cargando datos",
        status: "error",
      });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crearAsignacion = async () => {
    try {
      await api.post("/pie/asignaciones", {
        estudianteId,
        profesionalId,
      });

      toast({
        title: "Asignación creada",
        status: "success",
      });

      setEstudianteId("");
      setProfesionalId("");
      cargarDatos();
    } catch {
      toast({
        title: "Error al crear asignación",
        status: "error",
      });
    }
  };

  return (
    <Box p={6}>
      <Heading mb={4}>Asignación PIE</Heading>

      <VStack spacing={4} align="stretch">
        <Select
          placeholder="Selecciona estudiante"
          value={estudianteId}
          onChange={(e) => setEstudianteId(e.target.value)}
        >
          {estudiantes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </Select>

        <Select
          placeholder="Selecciona profesional"
          value={profesionalId}
          onChange={(e) => setProfesionalId(e.target.value)}
        >
          {profesionales.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </Select>

        <Button colorScheme="blue" onClick={crearAsignacion}>
          Registrar asignación
        </Button>
      </VStack>

      <Box mt={6}>
        <Heading size="md">Asignaciones</Heading>

        {asignaciones.map((a) => (
          <Box key={a.id} p={2} borderWidth="1px" mt={2}>
            {a.estudianteNombre} → {a.profesionalNombre}
          </Box>
        ))}
      </Box>
    </Box>
  );
}