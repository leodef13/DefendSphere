# DefendSphere Dashboard

**DefendSphere — Seguro Más Inteligente, Cumple Más Rápido**

Una plataforma integral de gestión de ciberseguridad y cumplimiento construida con React, Node.js y Redis.

## 🌟 Características

### Panel Principal
- **Monitoreo de Seguridad en Tiempo Real**: Detección de amenazas en vivo y monitoreo del estado del sistema
- **Gráficos Interactivos**: Gráficos SVG personalizados para métricas de seguridad y estado de cumplimiento
- **Soporte Multiidioma**: Localización en inglés, ruso y español
- **Diseño Responsivo**: Enfoque mobile-first con TailwindCSS

### Gestión de Seguridad
- **Gestión de Activos**: Rastrear y monitorear activos IT, servidores, recursos en la nube y dispositivos IoT
- **Seguimiento de Cumplimiento**: Monitoreo de cumplimiento GDPR, NIS2, ISO 27001, SOC2, PCI DSS y DORA
- **Confianza del Cliente**: Gestionar relaciones con clientes y socios con seguimiento de cumplimiento
- **Gestión de Proveedores**: Monitorear proveedores terceros y su cumplimiento de seguridad

### Características Avanzadas
- **Asistente con IA**: Asistente inteligente de seguridad con procesamiento de lenguaje natural
- **Guía de Inicio**: Cuestionario interactivo para evaluación de seguridad
- **Generación de Reportes**: Reportes integrales de seguridad y cumplimiento
- **Control de Acceso Basado en Roles**: Roles de administrador y usuario con permisos granulares

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- Redis 6+
- Docker (opcional)

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere
```

2. **Instalar dependencias**
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

3. **Iniciar Redis**
```bash
# Usando Docker
docker run -d -p 6380:6379 redis:alpine

# O instalar Redis localmente
redis-server
```

4. **Iniciar la aplicación**
```bash
# Backend (desde directorio backend)
npm start

# Frontend (desde directorio frontend)
npm run dev
```

### Despliegue con Docker

```bash
# Construir e iniciar todos los servicios
make build
make up

# Detener servicios
make down
```

## 🏗️ Arquitectura

### Frontend (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **Herramienta de Construcción**: Vite
- **Estilos**: TailwindCSS
- **Gestión de Estado**: Context API
- **Enrutamiento**: React Router v6
- **Gráficos**: SVG personalizados + Recharts
- **Iconos**: Lucide React

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Base de Datos**: Redis (almacén de datos principal)
- **Autenticación**: Tokens JWT
- **Seguridad**: Helmet, CORS, Limitación de velocidad
- **Validación**: Express-validator

### Base de Datos (Redis)
- **Gestión de Usuarios**: Cuentas de usuario, roles y permisos
- **Datos de Seguridad**: Incidentes, alertas, métricas del sistema
- **Cumplimiento**: Estándares, evaluaciones, reportes
- **Activos**: Activos IT, configuraciones, escaneos
- **Logs**: Trails de auditoría y logs del sistema

## 📊 Secciones del Panel

### 1. Panel Principal
- **Salud de Seguridad**: Estado general de seguridad del sistema
- **Monitoreo de Activos**: Estado de activos en tiempo real (124 activos)
- **Seguimiento de Problemas**: Críticos (5), Altos (12), Medios (28), Bajos (43) problemas
- **Tendencias de Salud**: Salud de seguridad histórica a lo largo del tiempo
- **Niveles de Criticidad**: Desglose visual por elementos

### 2. Gestión de Activos
- **Tipos de Activos**: Servidores, Recursos en la Nube, Dispositivos de Red, Aplicaciones, Bases de Datos, IoT
- **Entornos**: Producción, Staging, Desarrollo, Prueba
- **Estándares de Cumplimiento**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS
- **Evaluación de Riesgos**: Alto, Medio, Bajo, No Evaluado
- **Escaneo**: Escaneo automatizado de vulnerabilidades y evaluación

### 3. Gestión de Cumplimiento
- **Estándares**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **Seguimiento de Estado**: Conforme, Parcial, No Conforme, No Evaluado
- **Departamentos**: IT, Seguridad, Operaciones, Finanzas, Gestión de Riesgos
- **Evaluaciones**: Evaluaciones de cumplimiento programadas y ad-hoc
- **Reportes**: Reportes integrales de cumplimiento y resúmenes

### 4. Confianza del Cliente
- **Gestión de Clientes**: Rastrear relaciones con clientes y cumplimiento
- **Relaciones de Socios**: Monitorear estándares de seguridad de socios
- **Sectores**: Salud, Farmacéutico, Automotriz, Petrolero, Construcción, Ingeniería, Financiero
- **Estándares**: Seguimiento de cumplimiento NIS2, SOC v2, GDPR, DORA
- **Evaluaciones**: Evaluaciones regulares de seguridad y cumplimiento

### 5. Gestión de Proveedores
- **Tipos de Proveedores**: Software, Hardware, Servicios, Administrativos
- **Niveles de Acceso**: Acceso a infraestructura/datos, Servicios básicos
- **Monitoreo de Cumplimiento**: Evaluaciones regulares de seguridad de proveedores
- **Estándares**: Cumplimiento NIS2, SOC v2, GDPR, DORA
- **Gestión de Riesgos**: Evaluación y mitigación de riesgos de proveedores

### 6. Reportes y Análisis
- **Tipos de Reportes**: Evaluación de Seguridad, Auditoría de Cumplimiento, Escaneo de Vulnerabilidades, Reporte de Incidente
- **Formatos de Exportación**: Exportación PDF, Excel con filtros actuales
- **Análisis**: Métricas integrales de seguridad y tendencias
- **Programación**: Generación automatizada de reportes
- **Distribución**: Acceso a reportes basado en roles

### 7. Guía de Inicio
- **Cuestionario Interactivo**: Evaluación de seguridad de 14 preguntas
- **Análisis de Sector**: Requisitos de seguridad específicos de la industria
- **Mapeo de Cumplimiento**: Evaluación de relevancia de estándares
- **Recomendaciones**: Recomendaciones de seguridad personalizadas
- **Exportación**: Resultados de evaluación y recomendaciones

## 🔐 Características de Seguridad

### Autenticación y Autorización
- **Autenticación JWT**: Autenticación segura basada en tokens
- **Control de Acceso Basado en Roles**: Roles de administrador y usuario con permisos granulares
- **Gestión de Sesiones**: Manejo seguro de sesiones con Redis
- **Seguridad de Contraseñas**: Hashing bcrypt con sal

### Protección de Datos
- **Validación de Entrada**: Sanitización integral de entrada
- **Limitación de Velocidad**: Limitación de velocidad API para prevenir abuso
- **Protección CORS**: Seguridad de solicitudes cross-origin
- **Seguridad Helmet**: Headers de seguridad HTTP

### Auditoría y Logging
- **Trails de Auditoría**: Logging completo de acciones de usuario
- **Eventos de Seguridad**: Seguimiento de incidentes y alertas
- **Logs del Sistema**: Monitoreo de aplicaciones y sistema
- **Logs de Cumplimiento**: Seguimiento de cumplimiento regulatorio

## 🌍 Internacionalización

### Idiomas Soportados
- **Inglés (en)**: Idioma por defecto
- **Ruso (ru)**: Полная поддержка русского языка
- **Español (es)**: Soporte completo en español

### Características de Idioma
- **Cambio Dinámico**: Cambio de idioma en tiempo real
- **Selección Persistente**: Preferencia de idioma guardada en localStorage
- **Cobertura Completa**: Todos los elementos UI traducidos
- **Contexto Consciente**: Las traducciones consideran el contexto de uso

## 🛠️ Desarrollo

### Estructura del Proyecto
```
DefendSphere/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/          # Componentes de página
│   │   ├── contexts/       # Contextos React
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── layouts/        # Componentes de layout
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # Rutas API
│   ├── middleware/         # Express middleware
│   ├── utils/              # Funciones utilitarias
│   └── package.json
├── docs/                   # Documentación
│   ├── en/                 # Documentación en inglés
│   ├── ru/                 # Documentación en ruso
│   └── es/                 # Documentación en español
├── wiki/                   # Documentación wiki
│   ├── en/                 # Wiki en inglés
│   ├── ru/                 # Wiki en ruso
│   └── es/                 # Wiki en español
└── README.md               # Documentación principal
```

### Endpoints API

#### Autenticación
- `POST /api/auth/login` - Inicio de sesión de usuario
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/logout` - Cierre de sesión de usuario

#### Datos del Panel
- `GET /api/dashboard` - Métricas del panel
- `GET /api/incidents` - Incidentes de seguridad
- `GET /api/alerts` - Alertas de seguridad

#### Gestión de Activos
- `GET /api/assets` - Obtener todos los activos
- `POST /api/assets` - Crear nuevo activo
- `PUT /api/assets/:id` - Actualizar activo
- `DELETE /api/assets/:id` - Eliminar activo
- `POST /api/assets/:id/scan` - Escanear activo

#### Gestión de Cumplimiento
- `GET /api/compliance` - Obtener registros de cumplimiento
- `POST /api/compliance` - Crear registro de cumplimiento
- `PUT /api/compliance/:id` - Actualizar registro de cumplimiento
- `DELETE /api/compliance/:id` - Eliminar registro de cumplimiento
- `GET /api/compliance/summary` - Obtener resumen de cumplimiento

#### Confianza del Cliente
- `GET /api/customer-trust` - Obtener registros de confianza del cliente
- `POST /api/customer-trust` - Crear registro de confianza del cliente
- `PUT /api/customer-trust/:id` - Actualizar registro de confianza del cliente
- `DELETE /api/customer-trust/:id` - Eliminar registro de confianza del cliente

#### Reportes
- `GET /api/reports` - Obtener reportes
- `POST /api/reports` - Crear reporte
- `GET /api/reports/:id/export` - Exportar reporte

#### Asistente IA
- `POST /api/assistant` - Chatear con asistente IA

### Variables de Entorno

#### Backend (.env)
```env
PORT=5000
REDIS_URL=redis://localhost:6380
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DefendSphere
```

## 🧪 Pruebas

### Pruebas Frontend
```bash
cd frontend
npm run test
npm run test:coverage
```

### Pruebas Backend
```bash
cd backend
npm test
npm run test:coverage
```

### Pruebas de Integración
```bash
npm run test:integration
```

## 📦 Despliegue

### Construcción de Producción
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Producción
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Configuración de Entorno
- Establecer variables de entorno de producción
- Configurar Redis para producción
- Configurar certificados SSL
- Configurar proxy inverso (nginx)

## 🤝 Contribuir

1. Fork el repositorio
2. Crear una rama de característica (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

### Guías de Desarrollo
- Seguir mejores prácticas de TypeScript
- Escribir pruebas integrales
- Actualizar documentación
- Seguir el estilo de código existente
- Agregar traducciones para nuevas características

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación**: [Documentación Wiki](wiki/)
- **Issues**: [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/leodef13/DefendSphere/discussions)

## 🔗 Enlaces

- **Repositorio**: [DefendSphere en GitHub](https://github.com/leodef13/DefendSphere)
- **Demo en Vivo**: [DefendSphere Demo](https://defendsphere-demo.com)
- **Documentación**: [Documentación Completa](docs/)

---

**Versión**: 1.0.0  
**Última Actualización**: Septiembre 2025  
**Autor**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"