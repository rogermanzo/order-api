# Order API

API de gestión de usuarios y órdenes con comunicación basada en eventos usando NATS.

## Requisitos

- Docker y Docker Compose
- Node.js 18+
- PostgreSQL 14+

## Instalación y Ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/rogermanzo/order-api.git
cd order-api
```

2. Inicia los servicios:
```bash
docker-compose up --build
```

> **Nota**: En algunas versiones de Docker, este comando puede fallar en el primer intento. Si esto ocurre, simplemente ejecuta el comando nuevamente y debería funcionar correctamente.

Los servicios estarán disponibles en:
- Users API: http://localhost:3001
  - Swagger: http://localhost:3001/api
- Orders API: http://localhost:3002
  - Swagger: http://localhost:3002/api
- NATS Monitoring: http://localhost:8222

## Monitoreo de Eventos

Para ver los eventos en tiempo real:

1. Inicia el contenedor de monitoreo:
```bash
docker run -it --network order-api_default natsio/nats-box
```

2. Suscríbete a los eventos:
```bash
nats sub ">" --server nats://nats:4222
```

Eventos disponibles:
- `user.created`: Creación de usuarios
- `order.created`: Creación de órdenes
- `order.status.updated`: Actualización de estado de órdenes

## Migraciones y Tests

### Migraciones
```bash
# Servicio de Usuarios
cd services/users
npm run prisma:migrate

# Servicio de Órdenes
cd services/orders
npm run prisma:migrate
```

### Tests
```bash
# Servicio de Usuarios
cd services/users
npm run test

# Servicio de Órdenes
cd services/orders
npm run test
```

## Estructura del Proyecto

```
order-api/
├── services/
│   ├── users/          # Servicio de usuarios
│   └── orders/         # Servicio de órdenes
├── docker-compose.yml  # Configuración de servicios
└── README.md
```

## Tecnologías

- NestJS
- Prisma
- PostgreSQL
- NATS
- Docker

## Variables de Entorno

```env
# Users Service
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/users_db
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h

# Orders Service
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/orders_db
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
``` 