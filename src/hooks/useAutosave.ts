import { useEffect, useRef, useCallback } from 'react';

interface UseAutosaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  interval?: number; // milliseconds
  enabled?: boolean;
}

/**
 * Hook para autoguardar datos periódicamente
 * @param options - Configuración del autoguardado
 */
export function useAutosave({ data, onSave, interval = 30000, enabled = true }: UseAutosaveOptions) {
  const savedDataRef = useRef<string>('');
  const timeoutRef = useRef<number | null>(null);

  const save = useCallback(async () => {
    const currentData = JSON.stringify(data);

    // Solo guardar si los datos han cambiado
    if (currentData !== savedDataRef.current && currentData !== '{}' && currentData !== '""') {
      try {
        await onSave(data);
        savedDataRef.current = currentData;
        console.log('[Autosave] Guardado exitoso:', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('[Autosave] Error:', error);
      }
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programar siguiente guardado
    timeoutRef.current = setTimeout(save, interval);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, save, interval, enabled]);

  return { save };
}
