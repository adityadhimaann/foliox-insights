/**
 * Central API configuration — resolves the backend URL from the
 * VITE_API_URL env variable so deployed builds hit the Render backend
 * while local dev still hits localhost.
 */
export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';
