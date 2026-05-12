import React from 'react';
import { Flex, Box, Text, Button, HStack, Spacer } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css'; // importacion del css de la navbar

const Navbar = () => {
  const navigate = useNavigate();

  // simulacion de rol para la logica de navegacion (futura integracion)
  const userRole = "Directiva"; 

  const handleHomeNavigation = () => {
    navigate('/home'); // funcion para redirigir al home al hacer clic en el logo o boton
  };

  const handleRolesNavigation = () => {
    // en el futuro esto va a depender del rol, por ahora redirigimos directo
    navigate('/asignacion_roles');
  };

  const handleLogout = () => {
    // aqui iria la logica para limpiar tokens/sesion
    console.log("Cerrando sesión...");
    navigate('/');
  };

  return (
    <Box className="navbar-floating" px={6} py={3}> {/* Contenedor principal con clase de diseño flotante */}
      <Flex align="center">
        <Box cursor="pointer" onClick={handleHomeNavigation}>
          <img src="/favicon.svg" alt="SIGA Logo" className="navbar-logo" /> {/* logo SIGA */}
        </Box>

        <Spacer />

        {/* botones de la navbar */}
        <HStack spacing={4}>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleHomeNavigation}
            colorPalette="gray"
          >
            Home
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/perfil')}
            colorPalette="gray"
          >
            Ver perfil
          </Button>

          <Button 
            colorPalette="red" 
            variant="subtle" 
            size="sm" 
            onClick={handleLogout}
            borderRadius="full"
          >
            Cerrar sesión
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;