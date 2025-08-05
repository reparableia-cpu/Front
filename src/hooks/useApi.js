import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configuración por defecto de axios
const defaultAxiosConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Instancia de axios
const apiClient = axios.create(defaultAxiosConfig);

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Hook para realizar peticiones API con estado
 * @param {string} url - URL de la API
 * @param {Object} options - Opciones de configuración
 */
export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    body = null,
    immediate = true,
    onSuccess,
    onError,
    ...axiosOptions
  } = options;

  const execute = useCallback(async (customBody = body) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method,
        url,
        ...(customBody && { data: customBody }),
        ...axiosOptions,
      };

      const response = await apiClient(config);
      const result = response.data;
      
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, body, onSuccess, onError, axiosOptions]);

  useEffect(() => {
    if (immediate && method === 'GET') {
      execute();
    }
  }, [execute, immediate, method]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
}

/**
 * Hook para peticiones POST/PUT/DELETE simplificadas
 */
export function useMutation(url, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (data, customOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method: 'POST',
        url,
        data,
        ...options,
        ...customOptions,
      };

      const response = await apiClient(config);
      const result = response.data;

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return {
    mutate,
    loading,
    error,
  };
}

/**
 * Hook para subir archivos
 */
export function useFileUpload(url, options = {}) {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const config = {
        method: 'POST',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        ...options,
      };

      const response = await apiClient(config);
      const result = response.data;

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }

      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [url, options]);

  return {
    upload,
    progress,
    loading,
    error,
  };
}

/**
 * Hook para paginación de datos
 */
export function usePagination(url, options = {}) {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { pageSize = 20, ...axiosOptions } = options;

  const fetchPage = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get(url, {
        params: {
          page,
          per_page: pageSize,
          ...axiosOptions.params,
        },
        ...axiosOptions,
      });

      const result = response.data;
      setData(result.data || result.items || []);
      setTotalPages(result.pages || Math.ceil(result.total / pageSize));
      setCurrentPage(page);

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, pageSize, axiosOptions]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      fetchPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchPage(page);
    }
  };

  return {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchPage(currentPage),
  };
}

export { apiClient };
