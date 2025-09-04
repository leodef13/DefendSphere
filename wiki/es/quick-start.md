# Guía de Inicio Rápido

Esta guía te ayudará a poner en marcha DefendSphere rápidamente.

## 🚀 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** 18.0 o superior
- **Redis** 6.0 o superior
- **Docker** (opcional, para despliegue contenedorizado)
- **Git** (para clonar el repositorio)

## 📦 Métodos de Instalación

### Método 1: Docker (Recomendado)

La forma más fácil de comenzar es usando Docker:

```bash
# Clonar el repositorio
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Construir e iniciar todos los servicios
make build
make up

# Verificar que los servicios estén ejecutándose
docker ps
```

### Método 2: Instalación Manual

Si prefieres instalar manualmente:

```bash
# Clonar el repositorio
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Instalar dependencias del frontend
cd frontend
npm install

# Instalar dependencias del backend
cd ../backend
npm install

# Iniciar Redis (si no está ejecutándose)
docker run -d -p 6379:6379 redis:alpine
# O instalar Redis localmente y ejecutar: redis-server

# Iniciar el servidor backend
npm start

# En una nueva terminal, iniciar el frontend
cd frontend
npm run dev
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en el directorio backend:

```env
PORT=5000
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

Crea un archivo `.env` en el directorio frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DefendSphere
```

## 🎯 Primer Inicio de Sesión

1. **Acceder a la Aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

2. **Cuentas de Usuario por Defecto**
   - **Administrador**: `admin` / `admin`
   - **Usuario 1**: `user1` / `user1`
   - **Usuario 2**: `user2` / `user2`

3. **Proceso de Inicio de Sesión**
   - Navega a la página de inicio de sesión
   - Ingresa tus credenciales
   - Haz clic en "Iniciar Sesión"

## 🏠 Resumen del Panel

Después de iniciar sesión, verás el panel principal con:

- **Salud de Seguridad**: Estado general de seguridad del sistema
- **Monitoreo de Activos**: Estado de activos en tiempo real (124 activos)
- **Seguimiento de Problemas**: Críticos (5), Altos (12), Medios (28), Bajos (43) problemas
- **Tendencias de Salud**: Salud de seguridad histórica a lo largo del tiempo
- **Niveles de Criticidad**: Desglose visual por elementos

## 🔍 Características Clave a Explorar

### 1. Gestión de Activos
- Navega a **Activos** en la barra lateral
- Ve y gestiona activos IT
- Agrega nuevos activos
- Ejecuta escaneos de seguridad

### 2. Seguimiento de Cumplimiento
- Ve a la sección **Cumplimiento**
- Rastrea cumplimiento regulatorio
- Ve el estado de cumplimiento
- Genera reportes de cumplimiento

### 3. Asistente IA
- Haz clic en el ícono de chat en la esquina inferior derecha
- Haz preguntas sobre seguridad
- Obtén recomendaciones
- Busca información

### 4. Reportes
- Visita la sección **Reportes**
- Genera reportes de seguridad
- Exporta datos en formato PDF/Excel
- Ve análisis

## 🌍 Configuración de Idioma

DefendSphere soporta múltiples idiomas:

1. Haz clic en tu perfil en la esquina inferior izquierda
2. Ve a **Configuraciones**
3. Selecciona tu idioma preferido:
   - English (en)
   - Русский (ru)
   - Español (es)

## 🛠️ Solución de Problemas

### Problemas Comunes

**Puerto Ya en Uso**
```bash
# Matar proceso usando puerto 5000
lsof -ti:5000 | xargs kill -9

# Matar proceso usando puerto 5173
lsof -ti:5173 | xargs kill -9
```

**Problemas de Conexión Redis**
```bash
# Verificar si Redis está ejecutándose
redis-cli ping

# Debería retornar: PONG
```

**Problemas de Construcción Frontend**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Obtener Ayuda

Si encuentras problemas:

1. Revisa la página de [Problemas Comunes](common-issues.md)
2. Consulta la [Guía de Solución de Problemas](troubleshooting.md)
3. Busca [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
4. Crea un nuevo issue con detalles sobre tu problema

## 📚 Próximos Pasos

Ahora que tienes DefendSphere ejecutándose:

1. **Explora el Panel**: Familiarízate con la interfaz
2. **Configura Ajustes**: Configura tus preferencias e idioma
3. **Agrega Activos**: Comienza a gestionar tus activos IT
4. **Configura Cumplimiento**: Configura estándares de cumplimiento
5. **Lee la Documentación Completa**: Explora otras páginas de la wiki

## 🔗 Recursos Adicionales

- [Guía de Instalación](installation.md) - Instrucciones detalladas de instalación
- [Guía de Configuración](configuration.md) - Opciones avanzadas de configuración
- [Manual del Usuario](user-management.md) - Documentación completa del usuario
- [Referencia API](api-reference.md) - Documentación API
- [Mejores Prácticas de Seguridad](security-best-practices.md) - Pautas de seguridad

---

**Versión**: 1.0.0  
**Última Actualización**: Septiembre 2025  
**Autor**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"