# Frontend Integration Guide

This document explains how frontend applications should connect to the Fixio backend API, with detailed examples, error handling, and best practices.

## Base API URL

The backend exposes all routes under:

```
/api
```

If the server runs locally on port `3000`, the frontend should use:

```
http://localhost:3000/api
```

## CORS and Frontend Origin

The backend enables CORS for the origin defined in the `.env` variable:

```env
FRONTEND_ORIGIN=http://localhost:4200
```

Update that value to match the frontend host when running on a different port or domain. The backend also sets `credentials: true`, so include `credentials: 'include'` in fetch/axios requests if using cookies.

## Authentication

### Login

**Endpoint:**

```
POST /api/auth/login
```

**Headers:**

```
Content-Type: application/json
```

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

**Error response (401 Unauthorized):**

```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401
}
```

**Frontend implementation example (TypeScript):**

```typescript
async function login(email: string, password: string) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.user;
}
```

### Register user (Admin only)

**Endpoint:**

```
POST /api/auth/register
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request body:**

```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "role": "SALES_EMPLOYEE"
}
```

**Success response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newuser@example.com",
  "role": "SALES_EMPLOYEE"
}
```

**Error responses:**

- `400 Bad Request` - invalid input (password too short, email invalid, etc.)
- `401 Unauthorized` - missing or invalid access token
- `403 Forbidden` - user does not have ADMIN role
- `409 Conflict` - email already in use

### Get current user

**Endpoint:**

```
GET /api/auth/me
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "role": "ADMIN",
  "sub": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error response (401 Unauthorized):**

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### Refresh access token

**Endpoint:**

```
POST /api/auth/refresh
```

**Headers:**

```
Authorization: Bearer <refreshToken>
```

**Success response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error response (401 Unauthorized):**

```json
{
  "message": "Refresh token invalid or expired",
  "statusCode": 401
}
```

**Frontend token management helper:**

```typescript
let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

async function apiCall(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${accessToken}`);

  let response = await fetch(url, { ...options, headers });

  // If 401, try refreshing the token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    headers.set('Authorization', `Bearer ${accessToken}`);
    response = await fetch(url, { ...options, headers });
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

async function refreshAccessToken() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${refreshToken}` }
    });

    if (!response.ok) return false;

    const data = await response.json();
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return true;
  } catch (err) {
    return false;
  }
}
```

### Logout

**Endpoint:**

```
POST /api/auth/logout
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (204 No Content):**

No response body.

**Frontend implementation:**

```typescript
async function logout() {
  await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}
```

## Common endpoints

### Customers

#### List customers

**Endpoint:**

```
GET /api/customers
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "createdAt": "2026-07-12T10:00:00Z"
  }
]
```

#### Get customer by ID

**Endpoint:**

```
GET /api/customers/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Same as single customer object above.

**Error response (404 Not Found):**

```json
{
  "message": "Customer not found",
  "statusCode": 404
}
```

#### Create customer

**Endpoint:**

```
POST /api/customers
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `SALES_EMPLOYEE`

**Request body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+1234567891",
  "address": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001"
}
```

**Success response (201 Created):**

Same customer object structure with `id` and `createdAt`.

**Error response (409 Conflict):**

```json
{
  "message": "Phone or email already registered",
  "statusCode": 409
}
```

#### Update customer

**Endpoint:**

```
PATCH /api/customers/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `SALES_EMPLOYEE`

**Request body (all fields optional):**

```json
{
  "firstName": "Jane",
  "email": "jane.updated@example.com",
  "phone": "+1234567899"
}
```

**Success response (200 OK):**

Updated customer object.

---

### Catalog categories

#### List categories

**Endpoint:**

```
GET /api/catalog/categories
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Engine Parts",
    "slug": "engine-parts",
    "description": "All engine-related spare parts",
    "parentId": null,
    "createdAt": "2026-07-12T10:00:00Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Oil Filters",
    "slug": "oil-filters",
    "description": "Various oil filter types",
    "parentId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-07-12T10:05:00Z"
  }
]
```

#### Get category by ID

**Endpoint:**

```
GET /api/catalog/categories/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Single category object.

#### Get subcategories

**Endpoint:**

```
GET /api/catalog/categories/:id/children
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Array of categories with `parentId` equal to the requested `:id`.

#### Create category

**Endpoint:**

```
POST /api/catalog/categories
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body:**

```json
{
  "name": "Transmission Parts",
  "slug": "transmission-parts",
  "description": "Transmission and gearbox components",
  "parentId": null
}
```

**Success response (201 Created):**

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "Transmission Parts",
  "slug": "transmission-parts",
  "description": "Transmission and gearbox components",
  "parentId": null,
  "createdAt": "2026-07-12T10:10:00Z"
}
```

**Error response (409 Conflict):**

```json
{
  "message": "Slug already in use",
  "statusCode": 409
}
```

#### Update category

**Endpoint:**

```
PATCH /api/catalog/categories/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body (optional fields):**

```json
{
  "name": "Transmission Components",
  "description": "Updated description"
}
```

**Success response (200 OK):**

Updated category object.

#### Delete category

**Endpoint:**

```
DELETE /api/catalog/categories/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Success response (204 No Content):**

No response body. (soft delete)

---

### Product templates

#### List product templates

**Endpoint:**

```
GET /api/catalog/templates
```

**Query parameters (optional):**

- `categoryId` - filter templates by category ID

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Synthetic Motor Oil",
    "slug": "synthetic-motor-oil",
    "description": "High-quality synthetic motor oil",
    "categoryId": "660e8400-e29b-41d4-a716-446655440000",
    "specificationSchema": {
      "viscosity": "string",
      "volume": "number",
      "brand": "string"
    },
    "createdAt": "2026-07-12T10:00:00Z"
  }
]
```

#### Get template by ID

**Endpoint:**

```
GET /api/catalog/templates/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Single template object with full `specificationSchema`.

#### Create product template

**Endpoint:**

```
POST /api/catalog/templates
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body:**

```json
{
  "name": "Synthetic Motor Oil",
  "slug": "synthetic-motor-oil",
  "description": "Premium synthetic engine oil",
  "categoryId": "660e8400-e29b-41d4-a716-446655440000",
  "specificationSchema": {
    "viscosity": "string",
    "volume": "number",
    "brand": "string"
  }
}
```

**Success response (201 Created):**

New template object with `id` and `createdAt`.

**Error response (409 Conflict):**

```json
{
  "message": "Slug already in use",
  "statusCode": 409
}
```

#### Update product template

**Endpoint:**

```
PATCH /api/catalog/templates/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body (optional fields):**

```json
{
  "name": "Premium Synthetic Motor Oil",
  "description": "Updated description",
  "specificationSchema": {
    "viscosity": "string",
    "volume": "number",
    "brand": "string",
    "certifications": "string"
  }
}
```

**Success response (200 OK):**

Updated template object.

#### Delete product template

**Endpoint:**

```
DELETE /api/catalog/templates/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Success response (204 No Content):**

No response body. (soft delete)

---

### Product variants

#### Create product variant

**Endpoint:**

```
POST /api/catalog/variants
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body:**

```json
{
  "templateId": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "SYNTH-OIL-5W30-1L",
  "price": 29.99,
  "specifications": {
    "viscosity": "5W-30",
    "volume": "1",
    "brand": "Mobil 1"
  }
}
```

**Success response (201 Created):**

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440000",
  "templateId": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "SYNTH-OIL-5W30-1L",
  "price": 29.99,
  "specifications": {
    "viscosity": "5W-30",
    "volume": "1",
    "brand": "Mobil 1"
  },
  "createdAt": "2026-07-12T10:00:00Z"
}
```

**Error response (409 Conflict):**

```json
{
  "message": "SKU already in use",
  "statusCode": 409
}
```

#### Get variant by SKU

**Endpoint:**

```
GET /api/catalog/variants/sku/:sku
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Single variant object.

**Error response (404 Not Found):**

```json
{
  "message": "Variant not found",
  "statusCode": 404
}
```

#### Get variant by ID

**Endpoint:**

```
GET /api/catalog/variants/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

Single variant object.

#### Get variants for a template

**Endpoint:**

```
GET /api/catalog/templates/:id/variants
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Success response (200 OK):**

```json
[
  {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "templateId": "550e8400-e29b-41d4-a716-446655440000",
    "sku": "SYNTH-OIL-5W30-1L",
    "price": 29.99,
    "specifications": {
      "viscosity": "5W-30",
      "volume": "1",
      "brand": "Mobil 1"
    },
    "createdAt": "2026-07-12T10:00:00Z"
  }
]
```

#### Search variants by specifications (GET)

**Endpoint:**

```
GET /api/catalog/variants/search?filters=<json>
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Query parameter:**

- `filters` - URL-encoded JSON object, e.g., `?filters={"viscosity":"5W-30","brand":"Mobil 1"}`

**Success response (200 OK):**

Array of matching variant objects.

#### Search variants by specifications (POST)

**Endpoint:**

```
POST /api/catalog/variants/search
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request body:**

```json
{
  "filters": {
    "viscosity": "5W-30",
    "brand": "Mobil 1"
  }
}
```

**Success response (200 OK):**

Array of matching variant objects.

#### Update variant

**Endpoint:**

```
PATCH /api/catalog/variants/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Request body (optional fields):**

```json
{
  "price": 32.99,
  "specifications": {
    "viscosity": "5W-30",
    "volume": "1",
    "brand": "Mobil 1 Enhanced"
  }
}
```

**Success response (200 OK):**

Updated variant object.

#### Delete variant

**Endpoint:**

```
DELETE /api/catalog/variants/:id
```

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Required role:** `ADMIN` or `INVENTORY_MANAGER`

**Success response (204 No Content):**

No response body. (soft delete)

---

## Error handling

### Common HTTP status codes

- **200 OK** - Successful GET or PATCH request
- **201 Created** - Successful POST request creating a new resource
- **204 No Content** - Successful DELETE request
- **400 Bad Request** - Invalid input; check the `message` field for details
- **401 Unauthorized** - Missing, invalid, or expired token
- **403 Forbidden** - User role does not permit this action
- **404 Not Found** - Resource does not exist
- **409 Conflict** - Duplicate resource (e.g., duplicate email, slug, or SKU)
- **422 Unprocessable Entity** - Validation failed; check the `message` for details
- **429 Too Many Requests** - Rate limited (10 requests per 60 seconds)
- **500 Internal Server Error** - Unexpected backend error

### Error response format

All errors follow this structure:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Frontend error handling pattern

```typescript
async function handleApiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await apiCall(url, options);
    return response;
  } catch (err: any) {
    if (err.statusCode === 401) {
      // Handle unauthorized
      console.log('User session expired');
      window.location.href = '/login';
    } else if (err.statusCode === 403) {
      // Handle forbidden
      console.error('Insufficient permissions');
    } else if (err.statusCode === 404) {
      // Handle not found
      console.error('Resource not found');
    } else if (err.statusCode === 409) {
      // Handle conflict
      console.error('Resource already exists:', err.message);
    } else if (err.statusCode === 429) {
      // Handle rate limit
      console.error('Too many requests, please wait');
    } else {
      // Generic error
      console.error('An error occurred:', err.message);
    }
    throw err;
  }
}
```

---

## Token management best practices

1. **Store tokens securely**
   - Use `localStorage` for development simplicity
   - Consider `sessionStorage` or secure cookies in production
   - Never store tokens in `document.cookie` if they contain sensitive data

2. **Refresh proactively**
   - Track token expiry time (decode JWT payload)
   - Refresh 1-2 minutes before expiry to avoid mid-request expiration
   - Use a timer or background task for automatic refresh

3. **Handle expiry gracefully**
   - When `accessToken` expires (401), automatically refresh using `refreshToken`
   - If `refreshToken` also expires, redirect to login
   - Provide user feedback on logout due to session expiry

4. **Clean up on logout**
   - Clear tokens from storage
   - Clear any user state
   - Redirect to login page

---

## Rate limiting

The backend enforces a rate limit of **10 requests per 60 seconds** per client IP.

**Response when rate limited (429 Too Many Requests):**

```json
{
  "message": "ThrottlerException: Too Many Requests",
  "statusCode": 429
}
```

**Frontend handling:**

- Implement exponential backoff when you receive 429 responses
- Avoid polling APIs rapidly; use reasonable intervals

---

## UI areas to build first

### 1. Authentication
   - Login page with email and password fields
   - Handle login errors and show appropriate messages
   - Store tokens after successful login
   - Implement logout that clears tokens and redirects

### 2. Dashboard
   - Display current user information (from `/api/auth/me`)
   - Show role-based menu options
   - Implement token refresh logic in a shared API layer

### 3. Customer management
   - List all customers with pagination
   - View customer details
   - Create new customer form with validation
   - Edit customer information
   - Handle conflict errors for duplicate emails/phones

### 4. Catalog browser
   - Tree view of categories and subcategories
   - Click category to see associated product templates
   - View template details and specifications schema
   - See all variants for a selected template

### 5. Product variant search
   - Dynamic form based on template's `specificationSchema`
   - Search variants by specifications
   - Display search results with price and full specifications
   - Quick variant lookup by SKU

### 6. Admin/Inventory management
   - Create and edit categories
   - Create and edit product templates
   - Create and edit product variants
   - Role-based visibility (only show to ADMIN/INVENTORY_MANAGER)

---

## Environment variables for frontend

Create a `.env` file in your frontend project:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

Then in your frontend configuration:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');
```

For production, update these to match your deployed backend URL.

---

## API discovery and testing

- **Swagger UI:** Visit `http://localhost:3000/api/docs` for interactive API documentation
- **Test with cURL:**
  ```bash
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123"}'
  ```
- **Use Postman or Insomnia** - import the Swagger endpoint for easier testing

---

## Common issues and solutions

### Issue: "CORS error" when calling API from frontend

**Solution:**
- Ensure `FRONTEND_ORIGIN` in backend `.env` matches your frontend URL (including port)
- Restart the backend after changing `.env`
- Check that the backend is running and accessible

### Issue: "401 Unauthorized" on protected endpoints

**Solution:**
- Verify the access token is being sent in the `Authorization: Bearer <token>` header
- Check if the token has expired; try refreshing it
- Ensure the token was properly stored after login

### Issue: "403 Forbidden" when creating/updating resources

**Solution:**
- Check your user role; only certain roles can perform admin operations
- Use the `/api/auth/me` endpoint to confirm your role
- Ask an admin to promote your user account if needed

### Issue: "429 Too Many Requests" errors

**Solution:**
- Implement request debouncing or throttling in the frontend
- Avoid repeated polling of the same endpoint
- Use reasonable intervals for background refresh tasks

### Issue: Token expires immediately or `refresh` returns 401

**Solution:**
- Ensure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set correctly in backend `.env`
- Check that the secrets are at least 32 characters
- Verify token expiry times in backend config (default 15m for access, 7d for refresh)

---

## Next steps

1. Set up your frontend development environment
2. Implement the authentication service and token management
3. Create the login page and test the auth flow with Swagger
4. Build the customer management UI
5. Implement the catalog browser and variant search
6. Add admin/inventory management features as needed

