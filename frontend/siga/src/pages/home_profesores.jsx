import React from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

function ProfesorHome() {
  return (
    <Box
      minH="100vh"
      p={6}
      bgImage="url('/img/FondoSIGA.svg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      {/* Topbar */}
      <Flex
        justify="space-between"
        align="center"
        p={6}
        borderRadius="16px"
        bg="#2ec4b6"
        color="white"
        boxShadow="0 16px 40px rgba(0,0,0,0.08)"
      >
        <Text fontSize="1.4rem" fontWeight="700">
          SIGA Profesores
        </Text>

        <Button
          bg="rgba(255,255,255,0.2)"
          color="white"
          _hover={{
            bg: "rgba(255,255,255,0.3)",
          }}
        >
          Ver perfil
        </Button>
      </Flex>

      {/* Contenido */}
      <Grid templateColumns={{ base: "1fr", lg: "1.5fr 0.8fr" }} gap={6} mt={6}>
        {/* Panel principal */}
        <Box
          bg="white"
          borderRadius="24px"
          p={8}
          boxShadow="0 20px 35px rgba(0,0,0,0.08)"
        >
          <Heading size="2xl" color="gray.800" mb={3}>
            Portal Docente
          </Heading>

          <Text color="gray.600" mb={8} maxW="55ch">
            Gestiona cursos, estudiantes, evaluaciones y seguimiento académico
            desde un único lugar.
          </Text>

          <VStack gap={5} align="stretch">
            <Button
              h="70px"
              borderRadius="16px"
              colorScheme="teal"
              variant="outline"
            >
              Mis cursos
            </Button>

            <Button
              h="70px"
              borderRadius="16px"
              colorScheme="teal"
              variant="outline"
            >
              Horario
            </Button>

            <Button
              h="70px"
              borderRadius="16px"
              colorScheme="teal"
              variant="outline"
            >
              Mis estudiantes NEE
            </Button>
          </VStack>
        </Box>

        {/* Panel documentos */}
        <Box
          bg="white"
          borderRadius="24px"
          p={6}
          boxShadow="0 20px 35px rgba(0,0,0,0.08)"
        >
          <Heading size="md" mb={5} color="gray.800">
            Documentos
          </Heading>

          <VStack gap={4} align="stretch">
            <Box h="16px" bg="gray.200" borderRadius="999px" />

            <Box h="16px" bg="gray.200" borderRadius="999px" w="70%" />

            <Box h="16px" bg="gray.200" borderRadius="999px" />

            <Box h="16px" bg="gray.200" borderRadius="999px" w="85%" />

            <Box h="16px" bg="gray.200" borderRadius="999px" />
          </VStack>

          <Button mt={8} w="100%" colorScheme="teal">
            Ver más
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}

export default ProfesorHome;
