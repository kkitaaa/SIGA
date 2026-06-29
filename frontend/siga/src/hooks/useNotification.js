import { useToast } from '@chakra-ui/react';

export const useNotification = () => {
  const toast = useToast();

  /**
   * Facade para notificaciones de éxito
   * @param {string} message - Mensaje a mostrar
   */
  const showSuccess = (message) => {
    toast({
      title: 'Operación exitosa',
      description: message,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  /**
   * Facade para notificaciones de error
   * @param {string} message - Mensaje a mostrar
   */
  const showError = (message) => {
    toast({
      title: 'Ha ocurrido un error',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return { showSuccess, showError };
};