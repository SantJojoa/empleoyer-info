# Funcionalidad de Reportes - Employer Finder

## Descripción
Se ha implementado un sistema completo para la creación y gestión de reportes de empleados, permitiendo a los usuarios autenticados subir reportes con evidencia multimedia. El sistema incluye búsqueda automática de empleados por cédula y creación automática de empleados si no existen en la base de datos.

## Características Implementadas

### Frontend
- **Formulario de Reportes** (`ReportForm.tsx`):
  - Búsqueda automática de empleados por cédula con debounce
  - Autocompletado de datos del empleado si existe en la BD
  - Validación completa de campos requeridos
  - Subida de archivos con validación de tipo y tamaño
  - Interfaz intuitiva con mensajes de error en tiempo real
  - Soporte para imágenes (JPG, PNG, GIF) y PDFs
  - Indicador visual de búsqueda en progreso

- **Página de Reportes** (`Reports.tsx`):
  - Vista de reportes existentes
  - Formulario integrado para crear nuevos reportes
  - Estados de carga y mensajes de éxito/error
  - Diseño responsive

- **Servicio de API** (`reportService.ts`):
  - Abstracción de las llamadas HTTP
  - Búsqueda de empleados por cédula
  - Manejo centralizado de errores
  - Tipado TypeScript completo

- **Hook de Debounce** (`useDebounce.ts`):
  - Optimización de búsquedas automáticas
  - Evita llamadas excesivas a la API

### Backend
- **Middleware de Subida** (`upload.js`):
  - Configuración de Multer para manejo de archivos
  - Validación de tipos de archivo permitidos
  - Límite de tamaño de archivo (5MB)
  - Generación de nombres únicos para archivos

- **Rutas de Reportes** (`reports.js`):
  - Endpoint POST para crear reportes con archivos
  - Búsqueda automática o creación de empleados
  - Endpoint GET para listar reportes con asociaciones
  - Validación de datos y manejo de errores
  - Limpieza automática de archivos en caso de error

- **Rutas de Empleados** (`employees.js`):
  - Endpoint GET para buscar empleados por cédula
  - Endpoint POST para crear nuevos empleados
  - Endpoint GET para listar todos los empleados

- **Servidor** (`server.js`):
  - Servicio de archivos estáticos desde carpeta uploads
  - Configuración CORS para desarrollo

## Estructura de Datos

### Modelo Report
```javascript
{
  id: INTEGER (PK),
  userId: INTEGER (FK -> User),
  employeeId: INTEGER (FK -> Employee),
  description: TEXT,
  incidentDate: DATE,
  city: STRING,
  evidenceUrl: STRING,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Campos del Formulario
- **documentNumber**: Cédula del empleado (requerido, búsqueda automática)
- **firstName**: Nombre del empleado (autocompletado si existe)
- **lastName**: Apellido del empleado (autocompletado si existe)
- **industry**: Industria del empleado (requerido)
- **description**: Descripción del incidente (mínimo 10 caracteres)
- **incidentDate**: Fecha del incidente (no puede ser futura)
- **city**: Ciudad donde ocurrió el incidente (autocompletado si existe)
- **evidence**: Archivo de evidencia (JPG, PNG, GIF, PDF, máx 5MB)

## Validaciones

### Frontend
- Cédula del empleado es requerida (mínimo 8 dígitos para búsqueda)
- Nombre, apellido e industria del empleado son requeridos
- Descripción mínima de 10 caracteres
- Fecha de incidente no puede ser futura
- Archivo debe ser de tipo permitido
- Archivo no puede exceder 5MB
- Búsqueda automática con debounce de 500ms

### Backend
- Validación de autenticación (middleware auth)
- Validación de campos requeridos
- Búsqueda automática de empleados por cédula
- Creación automática de empleados si no existen
- Validación de archivo adjunto
- Validación de tipos de archivo permitidos
- Validación de tamaño de archivo

## Navegación
- Los usuarios autenticados pueden acceder a `/reports`
- Enlace disponible en el header de navegación
- Protección de ruta (requiere autenticación)

## Archivos Creados/Modificados

### Nuevos Archivos
- `frontend/src/components/ReportForm.tsx`
- `frontend/src/pages/Reports.tsx`
- `frontend/src/services/reportService.ts`
- `frontend/src/hooks/useDebounce.ts`
- `backend/middlewares/upload.js`

### Archivos Modificados
- `frontend/src/App.tsx` - Agregada ruta de reportes
- `backend/routes/reports.js` - Implementada subida de archivos y lógica de empleados
- `backend/routes/employees.js` - Agregada búsqueda por cédula
- `backend/server.js` - Configurado servicio de archivos estáticos

## Instalación y Configuración

### Dependencias Agregadas
```bash
# Backend
pnpm add multer
```

### Estructura de Carpetas
```
backend/
├── uploads/          # Carpeta para archivos subidos (se crea automáticamente)
└── middlewares/
    └── upload.js     # Configuración de Multer
```

## Uso

1. **Crear Reporte**:
   - Navegar a `/reports`
   - Ingresar la cédula del empleado (se buscará automáticamente)
   - Si el empleado existe, se autocompletarán los datos
   - Si no existe, completar manualmente los datos del empleado
   - Llenar el resto del formulario con los datos del incidente
   - Seleccionar archivo de evidencia
   - Hacer clic en "Crear Reporte"

2. **Búsqueda Automática**:
   - Al ingresar una cédula (mínimo 8 dígitos), se busca automáticamente
   - Indicador visual muestra el estado de la búsqueda
   - Si se encuentra el empleado, se autocompletan los campos
   - Si no se encuentra, se pueden completar manualmente

## Seguridad
- Autenticación requerida para todas las operaciones
- Validación de tipos de archivo en frontend y backend
- Límites de tamaño de archivo
- Nombres de archivo únicos para evitar conflictos
- Limpieza automática de archivos en caso de error

## Próximas Mejoras Sugeridas
- Paginación para listas grandes de reportes
- Filtros y búsqueda de reportes
- Notificaciones en tiempo real
- Compresión automática de imágenes
- Almacenamiento en la nube (AWS S3, etc.)
- Sistema de estados de reportes (pendiente, revisado, etc.)
