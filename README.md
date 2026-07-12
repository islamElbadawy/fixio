# Fixio - Car Workshop & Spare Parts Management System

Fixio is an enterprise-grade, modular backend application for managing car workshop operations, spare parts inventory, customer relationships, and sales workflows. Built with NestJS, MikroORM, and PostgreSQL, the system is designed for scalability, maintainability, and extensibility.

**Production Ready** · **Domain-Driven Design** · **CQRS Pattern** · **Role-Based Access Control** · **RESTful API**

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Database Management](#database-management)
- [API Documentation](#api-documentation)
- [Frontend Integration](#frontend-integration)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Performance & Optimization](#performance--optimization)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)

---

## Overview

Fixio addresses the complex operational needs of modern car repair shops and spare parts dealers. The system provides:

- **Workshop Management**: Track work orders, part consumption, and technician assignments
- **Inventory Control**: Manage stock levels, reservations, and part specifications
- **Customer Relations**: Register customers, track vehicles, and maintain contact history
- **Sales Operations**: Create orders, generate invoices, and process payments
- **Role-Based Access**: Admin, Sales Employee, Inventory Manager, and Technician roles

The backend provides a comprehensive REST API suitable for web, mobile, and third-party integrations.

---

## Key Features

### Authentication & Authorization
- JWT-based authentication with 15-minute access tokens and 7-day refresh tokens
- Role-based access control (RBAC) with four role levels
- Secure password hashing using bcrypt
- Refresh token rotation for enhanced security

### Product Catalog
- Hierarchical category structure (parent-child relationships)
- Product templates with dynamic specification schemas
- Product variants with SKU-based tracking and pricing
- Flexible search by specifications or SKU

### Workshop Management
- Work order creation and lifecycle management (created → started → completed)
- Automatic part reservation when creating work orders
- Part consumption tracking with stock deduction
- Technician assignment and work order prioritization

### Inventory System
- Real-time stock tracking by product variant
- Stock reservation mechanism for work orders
- Inventory transaction history with audit trail
- Low stock alerts and reorder notifications
- Warehouse location tracking

### Customer Management
- Comprehensive customer profiles with contact information
- Vehicle registration linked to customers
- Order and work order history per customer
- Soft delete support for data retention

### Sales & Invoicing
- Sales order creation and management
- Automatic invoice generation
- Payment tracking and status updates
- Tax and discount calculations

### API & Documentation
- Full Swagger UI documentation
- Structured error handling with meaningful error messages
- CORS support for cross-origin requests
- Rate limiting (10 requests per 60 seconds)
- Request validation and sanitization

---

## Architecture

### Design Principles

Fixio follows **Domain-Driven Design (DDD)** principles, organizing code around business domains rather than layers:

```
Feature Module
├── domain/          (Business logic & entities)
├── application/     (CQRS command & query handlers)
├── infrastructure/  (Repositories & external services)
└── presentation/    (Controllers & DTOs)
```

### Pattern: CQRS (Command Query Responsibility Segregation)

- **Commands** (`/application/commands/`) - modify state, return results
- **Queries** (`/application/queries/`) - read state, no side effects
- **CommandBus & QueryBus** - dispatch handlers asynchronously
- **EventEmitter** - publish domain events for side effects

### Core Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 20+ |
| Framework | NestJS | 11.0+ |
| ORM | MikroORM | 7.1+ |
| Database | PostgreSQL | 12+ |
| Validation | class-validator | 0.15+ |
| Documentation | Swagger/OpenAPI | 11.4+ |
| Rate Limiting | @nestjs/throttler | 6.5+ |
| Security | bcrypt, JWT | Latest |

### Request/Response Flow

```
Client Request
    ↓
Controller (Validation & Guards)
    ↓
CommandBus / QueryBus
    ↓
Handler (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database (PostgreSQL)
    ↓
Response (DTO)
```

---

## Repository Structure

```
fixio/
├── src/
│   ├── main.ts                           # Application bootstrap
│   ├── app.module.ts                     # Root module
│   ├── config/
│   │   ├── app.config.ts                 # App configuration
│   │   └── mikro-orm.config.ts           # Database configuration
│   ├── modules/
│   │   ├── identity/                     # Authentication & authorization
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   ├── repositories/
│   │   │   │   └── role.enum.ts
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   └── dtos/
│   │   │   ├── infrastructure/
│   │   │   │   ├── guards/
│   │   │   │   ├── repositories/
│   │   │   │   └── strategies/
│   │   │   └── presentation/
│   │   │       └── auth.controller.ts
│   │   ├── catalog/                      # Product catalog
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   │   ├── commands/
│   │   │   │   ├── queries/
│   │   │   │   └── dtos/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   │       ├── category.controller.ts
│   │   │       ├── product-template.controller.ts
│   │   │       └── product-variant.controller.ts
│   │   ├── customers/                    # Customer management
│   │   ├── vehicles/                     # Vehicle management
│   │   ├── inventory/                    # Stock management
│   │   ├── sales/                        # Sales operations
│   │   ├── workshop/                     # Work orders
│   │   └── shared/
│   │       ├── infrastructure/
│   │       │   ├── filters/
│   │       │   └── guards/
│   │       └── domain/
│   └── database/
│       ├── migrations/                   # Database migrations
│       └── seeds/                        # Database seeds
├── test/
│   ├── app.e2e-spec.ts                   # End-to-end tests
│   └── jest-e2e.json                     # E2E Jest config
├── .env.example                          # Environment template
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.mjs
├── mikro-orm.config.ts                   # ORM configuration
├── nest-cli.json
└── README.md
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher (check with `node --version`)
- **PostgreSQL** 12 or higher (running locally or on a server)
- **pnpm** (preferred) or **npm** (check with `pnpm --version` or `npm --version`)
- **Git** for version control

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-org/fixio.git
cd fixio

# Install dependencies
pnpm install

# Or with npm
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a template:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Environment
NODE_ENV=development

# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
DB_NAME=fixio_db

# JWT Secrets (minimum 32 characters, use strong random strings)
JWT_ACCESS_SECRET=your_very_secure_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_very_secure_refresh_secret_min_32_chars

# JWT Expiry
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend
FRONTEND_ORIGIN=http://localhost:4200

# Application
APP_NAME=Fixio
```

### Step 3: Setup PostgreSQL Database

Ensure PostgreSQL is running and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fixio_db OWNER postgres;

# Exit
\q
```

### Step 4: Run Migrations

Apply all pending database migrations:

```bash
pnpm run migration:up
```

### Step 5: Seed Initial Data (Optional)

Populate the database with sample data:

```bash
# Seed all data
pnpm run seed:customers
pnpm run seed:catalog
pnpm run seed:inventory
pnpm run seed:workshop
```

### Step 6: Start the Development Server

```bash
pnpm run start:dev
```

You should see output like:

```
🔧 Fixio API → http://localhost:3000/api
```

### Step 7: Access the API

- **API Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/auth/me (returns 401 if not authenticated)

---

## Configuration

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Environment (development, production, test) |
| `PORT` | No | `3000` | Server port |
| `DB_HOST` | Yes | - | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_USERNAME` | Yes | - | PostgreSQL username |
| `DB_PASSWORD` | Yes | - | PostgreSQL password |
| `DB_NAME` | Yes | - | Database name |
| `JWT_ACCESS_SECRET` | Yes | - | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Yes | - | Refresh token secret (min 32 chars) |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token validity duration |
| `JWT_REFRESH_EXPIRES_IN` | No | `7d` | Refresh token validity duration |
| `FRONTEND_ORIGIN` | No | `http://localhost:4200` | Allowed CORS origin for frontend |
| `APP_NAME` | No | `Fixio` | Application display name |

### Generate Secure Secrets

```bash
# Generate a 32-character random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Configuration Files

- **`src/config/app.config.ts`** - Application-level settings
- **`src/config/mikro-orm.config.ts`** - Database connection settings
- **`mikro-orm.config.ts`** - CLI configuration for migrations

---

## Database Management

### Create a New Migration

```bash
pnpm run migration:create -- --name AddUserEmail
```

This creates a new migration file in `src/database/migrations/`.

### View Migration Status

```bash
# MikroORM CLI
npx mikro-orm migration:list
```

### Run Migrations

```bash
# Forward (up)
pnpm run migration:up

# Backward (down)
pnpm run migration:down
```

### Create Seeds

Seeds are located in `src/database/seeds/`. Example structure:

```typescript
export async function catalogSeed(em: EntityManager) {
  const category = em.create(CategoryEntity, {
    name: 'Engine Parts',
    slug: 'engine-parts',
  });
  await em.persistAndFlush(category);
}
```

### Data Model Overview

#### Users & Roles
- `UserEntity` - System users with roles (ADMIN, SALES_EMPLOYEE, INVENTORY_MANAGER)
- Roles enforce access control via `@Roles()` decorator

#### Catalog
- `CategoryEntity` - Hierarchical product categories
- `ProductTemplate` - Product blueprints with dynamic specs
- `ProductVariant` - Individual products with SKU, price, specs

#### Customers
- `CustomerEntity` - Customer profiles with contact info
- `VehicleEntity` - Customer vehicles (linked to work orders)

#### Workshop
- `WorkOrder` (Aggregate Root) - Work request lifecycle
- `WorkOrderLine` - Individual parts in a work order
- Tracks part consumption with audit trail

#### Inventory
- `InventoryTransactionEntity` - Stock movement history
- `StockReservationEntity` - Reserved stock for pending orders

#### Sales
- `SalesOrder` - Customer purchase orders
- `SalesOrderLine` - Individual line items
- `Invoice` - Generated invoices with payment tracking

---

## API Documentation

### Swagger UI

Access interactive API documentation at:

```
http://localhost:3000/api/docs
```

Features:
- Full endpoint documentation with request/response schemas
- Try-it-out functionality to test endpoints directly
- Authentication token management for protected endpoints
- Error response examples

### Postman Collection

Import the provided Postman collection:

```
Fixio_API_Collection.postman_collection.json
```

**Steps:**
1. Open Postman
2. Click "Import" → Select the JSON file
3. Set environment variables: `baseUrl`, `accessToken`, `refreshToken`
4. Start making API requests

### API Endpoints Summary

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (admin only)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

#### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get customer
- `PATCH /api/customers/:id` - Update customer

#### Catalog
- `GET /api/catalog/categories` - List categories
- `POST /api/catalog/categories` - Create category
- `GET /api/catalog/templates` - List templates
- `POST /api/catalog/templates` - Create template
- `GET /api/catalog/variants` - List variants
- `POST /api/catalog/variants` - Create variant
- `GET /api/catalog/variants/sku/:sku` - Get variant by SKU
- `POST /api/catalog/variants/search` - Search variants by specs

#### Workshop (See `FRONTEND_BRD.md` for complete endpoint list)
- `GET /api/workshop/work-orders` - List work orders
- `POST /api/workshop/work-orders` - Create work order

See `FRONTEND_INTEGRATION.md` for detailed endpoint documentation with examples.

---

## Frontend Integration

### Quick Start for Frontend Developers

1. **API Base URL**: `http://localhost:3000/api` (development)
2. **Authentication**: Include `Authorization: Bearer <token>` header
3. **CORS**: Frontend origin configured in `.env` (`FRONTEND_ORIGIN`)

### Key Integration Points

- Authentication: `/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`
- Token Management: Store access token, auto-refresh before expiry
- Error Handling: Handle 401 (unauthorized), 403 (forbidden), 429 (rate limited)
- Role-Based UI: Check user role from `/api/auth/me` to show/hide features

### Documentation

Comprehensive frontend integration guide available in:

- **`FRONTEND_INTEGRATION.md`** - API usage guide, auth flows, error handling
- **`FRONTEND_BRD.md`** - Complete frontend requirements document with UI flows

---

## Development Workflow

### Running the Application

```bash
# Development with hot reload
pnpm run start:dev

# Production build and run
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

### Code Quality

```bash
# Linting
pnpm run lint

# Format code
pnpm run format

# Check formatting without fixing
pnpm run format:check
```

### Project Structure Best Practices

When adding new features:

1. Create a new module in `src/modules/{feature}/`
2. Organize by layer: `domain/`, `application/`, `infrastructure/`, `presentation/`
3. Use CQRS pattern for application logic
4. Export module from `app.module.ts`
5. Add route prefix and guards to controller

Example controller:

```typescript
@ApiTags('MyFeature')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-feature')
export class MyFeatureController {
  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateDto) {
    return this.commandBus.execute(new CreateCommand(dto));
  }

  @Get()
  getAll() {
    return this.queryBus.execute(new GetAllQuery());
  }
}
```

---

## Testing

### Unit Tests

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage report
pnpm run test:cov
```

Test files should be co-located with source:

```
src/
├── services/
│   ├── user.service.ts
│   └── user.service.spec.ts
```

### End-to-End Tests

```bash
pnpm run test:e2e
```

E2E tests verify complete user flows including API calls.

### Test Coverage Goals

- Unit tests: 80%+ coverage
- Critical paths: E2E tests
- Before deployment: All tests passing

---

## Deployment

### Build for Production

```bash
# Build TypeScript
pnpm run build

# Output in ./dist/ directory
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DB_HOST=prod-db-host
DB_PORT=5432
DB_USERNAME=prod_user
DB_PASSWORD=strong_password_here
DB_NAME=fixio_prod
JWT_ACCESS_SECRET=generate_new_32_char_secret
JWT_REFRESH_SECRET=generate_new_32_char_secret
FRONTEND_ORIGIN=https://fixio.com
```

### Docker Deployment (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --prod
COPY dist ./dist
CMD ["node", "dist/main.js"]
```

### Systemd Service (Linux)

```ini
[Unit]
Description=Fixio API
After=network.target

[Service]
Type=simple
User=fixio
WorkingDirectory=/opt/fixio
ExecStart=/usr/bin/node /opt/fixio/dist/main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

---

## Troubleshooting

### Common Issues

#### "Connect ECONNREFUSED 127.0.0.1:5432"
**Problem**: PostgreSQL not running or connection details incorrect

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Test connection
psql -U postgres -h localhost
```

#### "Invalid JWT secret"
**Problem**: JWT_ACCESS_SECRET or JWT_REFRESH_SECRET too short

**Solution**: Generate 32+ character secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### "CORS error from frontend"
**Problem**: `FRONTEND_ORIGIN` doesn't match frontend URL

**Solution**: Update `.env`:
```env
FRONTEND_ORIGIN=http://localhost:4200
# or
FRONTEND_ORIGIN=https://fixio-app.com
```

#### "Port 3000 already in use"
**Problem**: Another process using the port

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### "Type error: Cannot read property 'constructor' of undefined"
**Problem**: Database not initialized or migrations not run

**Solution**:
```bash
pnpm run migration:up
pnpm run seed:customers  # Optional
```

### Enable Debug Logging

```env
NODE_ENV=development
# Will log all SQL queries and entity changes
```

### Database Backup & Restore

```bash
# Backup
pg_dump -U postgres fixio_db > backup.sql

# Restore
psql -U postgres fixio_db < backup.sql
```

---

## Performance & Optimization

### Caching Strategy

- **Entity Metadata**: Cached by MikroORM
- **Product Catalog**: Consider Redis for frequently accessed categories
- **JWT Tokens**: Verify without DB calls (stateless)

### Database Optimization

- **Indexes**: Applied on foreign keys, common filters
- **Query Optimization**: CQRS pattern allows query-specific optimization
- **Connection Pooling**: Configured in MikroORM
- **Pagination**: Always paginate large result sets

### API Response Performance

- **Global Compression**: Enabled by NestJS
- **Serialization**: ClassSerializerInterceptor excludes sensitive fields
- **Rate Limiting**: 10 requests per 60 seconds per IP

### Recommended Monitoring Tools

- **Error Tracking**: Sentry
- **Performance Monitoring**: New Relic or DataDog
- **Logging**: Winston, Pino
- **Metrics**: Prometheus, Grafana

---

## Security Considerations

### Authentication & Authorization

- ✅ JWT tokens with secure secrets (32+ characters)
- ✅ Refresh token rotation
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Role-based access control enforced on every endpoint

### API Security

- ✅ HTTPS required for production
- ✅ CORS configured for specific origins
- ✅ Input validation and sanitization
- ✅ Rate limiting on all endpoints
- ✅ Request body size limits

### Data Protection

- ✅ Soft deletes preserve data integrity
- ✅ Audit trail for sensitive operations
- ✅ No sensitive data in response bodies
- ✅ Password fields excluded from serialization

### Best Practices

- Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` regularly in production
- Never commit `.env` files to version control
- Use strong database passwords
- Enable HTTPS/TLS in production
- Monitor error logs for security exceptions
- Keep dependencies updated: `pnpm audit`

---

## Contributing

### Code Style

- TypeScript strict mode enabled
- ESLint configuration provided
- Prettier for code formatting
- Run `pnpm run lint` and `pnpm run format` before committing

### Pull Request Process

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/my-feature`
4. Create Pull Request on GitHub
5. Ensure all tests pass and code review approved
6. Merge to main branch

### Commit Message Convention

```
feat: add new work order status
fix: resolve customer search bug
docs: update API documentation
test: add integration tests for catalog
chore: update dependencies
```

---

## Support & Resources

- **GitHub Issues**: For bugs and feature requests
- **Documentation**: See `FRONTEND_INTEGRATION.md` and `FRONTEND_BRD.md`
- **API Docs**: Visit Swagger UI at `/api/docs`
- **Email Support**: support@fixio.com

---

## License

UNLICENSED - Internal use only

---

## Changelog

### Version 0.0.1 (Initial Release)

- MVP with authentication, customer management, catalog, workshop, and inventory modules
- JWT-based security with role-based access control
- PostgreSQL persistence with MikroORM
- Comprehensive API documentation via Swagger
