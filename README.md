# Frontend - Unified AI Frontend

## Requisitos del Sistema

- **Node.js**: 18.19.0 (recomendado, ver .nvmrc)
- **Package Manager**: npm (compatible) o pnpm

## Instalación Local

```bash
# Usar versión correcta de Node.js (si tienes nvm)
nvm use

# Instalar dependencias
npm install --legacy-peer-deps

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Deployment / Producción

### Para plataformas como Render, Vercel, Netlify:

1. **Node.js Version**: 18.19.0
2. **Build Command**: `npm install --legacy-peer-deps && npm run build`
3. **Publish Directory**: `dist`

### Variables de Entorno

No se requieren variables de entorno específicas para el build.

## Solución de Problemas

### Error: "Cannot read properties of null (reading 'matches')"

**Solución**:
1. Usar Node.js 18.19.0
2. Ejecutar: `npm install --legacy-peer-deps`
3. Si persiste, eliminar node_modules y package-lock.json: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

### Error de Dependencies Conflict

El proyecto incluye `.npmrc` con configuraciones para resolver conflictos de peer dependencies.

## Tecnologías

- **React 19.1.0**
- **Vite 6.3.5**
- **TailwindCSS 4.1.7**
- **Radix UI Components**
- **React Router 7.6.1**

## Estructura

```
src/
├── components/ui/     # Componentes UI reutilizables
├── hooks/            # Custom hooks
├── lib/              # Utilidades
└── assets/           # Recursos estáticos
```
