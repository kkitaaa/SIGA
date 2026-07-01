import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

export function useNotification() {
  const toast = useToast();

  const show = useCallback(
    (options) => {
      toast({
        position: 'top-right',
        duration: 4000,
        isClosable: true,
        ...options,
      });
    },
    [toast]
  );

  const showSuccess = useCallback(
    (title, description, options = {}) => {
      show({
        title,
        description,
        status: 'success',
        ...options,
      });
    },
    [show]
  );

  const showError = useCallback(
    (title, description, options = {}) => {
      show({
        title: title || 'Error',
        description,
        status: 'error',
        ...options,
      });
    },
    [show]
  );

  const showWarning = useCallback(
    (title, description, options = {}) => {
      show({
        title,
        description,
        status: 'warning',
        ...options,
      });
    },
    [show]
  );

  const showInfo = useCallback(
    (title, description, options = {}) => {
      show({
        title,
        description,
        status: 'info',
        ...options,
      });
    },
    [show]
  );

  return { show, showSuccess, showError, showWarning, showInfo };
}
