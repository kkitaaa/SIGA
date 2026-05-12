import React from 'react';
import { Box, Heading, Text, VStack, Container } from '@chakra-ui/react';
import '../styles/home.css'; // importacion del CSS de home

const Home = () => {
  return (
    <Box minH="100vh" bg="gray.50" pt="120px"> {/* contenedor con padding superior para no ser tapado por la navbar */}
      <Container maxW="container.md">
        <VStack spacing={8} align="center" className="home-fade-in"> {/* aplicacion de la animacion de entrada */}
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color="blue.600" letterSpacing="tight">
              Bienvenido/a a SIGA {/* titulo principal de la vista home */}
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Tu portal de información y gestión escolar eficiente.
            </Text>
          </Box>
          
          <Box p={10} bg="white" borderRadius="2xl" boxShadow="sm" w="full" textAlign="center" border="1px solid" borderColor="gray.100"> {/* Tarjeta de contenido minimalista */}
            <Text fontSize="md" color="gray.500">
              Home cargará información relevante según el rol seleccionado por el usuario. (¡PRÓXIMAMENTE!)
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;