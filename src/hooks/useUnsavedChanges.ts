import { useEffect } from 'react';

/**
 * Hook para advertir al usuario cuando hay cambios sin guardar
 * @param hasUnsavedChanges - Indica si hay cambios sin guardar
 * @param message - Mensaje personalizado
 */
export function useUnsavedChanges(
  hasUnsavedChanges: boolean,
  message: string = '¿Estás seguro de que quieres salir? Tienes cambios sin guardar.'
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges, message]);
}
