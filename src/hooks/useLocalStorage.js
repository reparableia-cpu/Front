import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar localStorage
 * @param {string} key - Clave del localStorage
 * @param {*} initialValue - Valor inicial
 * @returns {[*, function]} - [valor, setter]
 */
export function useLocalStorage(key, initialValue) {
  // Obtener valor del localStorage o usar valor inicial
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función para actualizar el estado y localStorage
  const setValue = (value) => {
    try {
      // Permitir que value sea una función como useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook para manejar múltiples valores de localStorage
 * @param {Object} initialValues - Objeto con claves y valores iniciales
 */
export function useLocalStorageState(initialValues) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const stored = {};
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        stored[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        stored[key] = initialValues[key];
      }
    });
    return stored;
  });

  const updateValue = (key, value) => {
    setState(prev => {
      const newState = { ...prev, [key]: value };
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
      return newState;
    });
  };

  return [state, updateValue];
}
