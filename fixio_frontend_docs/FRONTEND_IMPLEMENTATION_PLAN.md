# Fixio Frontend — Angular Implementation Plan
## For Angular Developers

**Stack:** Angular 17+ · Tailwind CSS 3 · TypeScript · RxJS · Angular Signals

---

## 1. Tech Stack

| Tool | Purpose | Version |
|---|---|---|
| Angular | Framework | 17+ (standalone components) |
| Tailwind CSS | Utility-first styling | 3.4+ |
| Angular Router | Client-side routing + guards | Built-in |
| Angular HttpClient | API communication | Built-in |
| RxJS | Reactive streams | 7+ |
| Angular Signals | State management | Built-in (Angular 17+) |
| Angular Reactive Forms | Form handling | Built-in |
| ngx-toastr | Toast notifications | Latest |
| date-fns | Date formatting | Latest |
| lucide-angular | Icons | Latest |

---

## 2. Project Setup

### 2.1 Create the project

```bash
ng new fixio-frontend --routing --style=none --standalone
cd fixio-frontend

# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Install dependencies
npm install ngx-toastr date-fns lucide-angular
npm install -D @types/node
```

### 2.2 Tailwind config (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        surface: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
          tertiary: '#f1f5f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### 2.3 `styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@layer base {
  body {
    @apply bg-surface-secondary text-slate-900 antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors;
  }
  .btn-danger {
    @apply inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors;
  }
  .input-field {
    @apply w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white;
  }
  .card {
    @apply bg-white rounded-xl border border-slate-200 shadow-sm;
  }
  .badge-draft     { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600; }
  .badge-confirmed { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700; }
  .badge-paid      { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700; }
  .badge-unpaid    { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700; }
  .badge-partial   { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700; }
  .badge-cancelled { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700; }
  .badge-progress  { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700; }
  .badge-completed { @apply inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700; }
}
```

---

## 3. Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── auth/
│   │   │   ├── auth.service.ts          # Login, logout, token management
│   │   │   ├── auth.guard.ts            # Route protection
│   │   │   ├── role.guard.ts            # Role-based access
│   │   │   ├── auth.interceptor.ts      # Attach Bearer token
│   │   │   └── token-refresh.interceptor.ts  # Auto-refresh on 401
│   │   ├── models/                      # TypeScript interfaces
│   │   │   ├── auth.model.ts
│   │   │   ├── catalog.model.ts
│   │   │   ├── inventory.model.ts
│   │   │   ├── customer.model.ts
│   │   │   ├── sales.model.ts
│   │   │   ├── vehicle.model.ts
│   │   │   └── workshop.model.ts
│   │   └── services/                    # API services
│   │       ├── catalog.service.ts
│   │       ├── inventory.service.ts
│   │       ├── customer.service.ts
│   │       ├── sales.service.ts
│   │       ├── vehicle.service.ts
│   │       └── workshop.service.ts
│   ├── shared/
│   │   └── components/
│   │       ├── sidebar/
│   │       ├── topbar/
│   │       ├── page-header/
│   │       ├── data-table/
│   │       ├── stat-card/
│   │       ├── status-badge/
│   │       ├── confirm-dialog/
│   │       ├── empty-state/
│   │       ├── loading-spinner/
│   │       └── breadcrumb/
│   ├── layout/
│   │   └── shell/                       # Main app shell with sidebar
│   └── features/
│       ├── auth/
│       │   └── login/
│       ├── dashboard/
│       ├── catalog/
│       │   ├── categories/
│       │   ├── templates/
│       │   └── variants/
│       ├── inventory/
│       │   ├── warehouses/
│       │   ├── stock-levels/
│       │   ├── movements/
│       │   └── receive-stock/
│       ├── customers/
│       │   ├── customer-list/
│       │   └── customer-detail/
│       ├── sales/
│       │   ├── orders/
│       │   └── invoices/
│       ├── vehicles/
│       │   ├── vehicle-list/
│       │   └── vehicle-detail/
│       └── workshop/
│           └── work-orders/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app.routes.ts
```

---

## 4. Core Models

### `src/app/core/models/auth.model.ts`
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

export type UserRole =
  | 'ADMIN'
  | 'INVENTORY_MANAGER'
  | 'SALES_EMPLOYEE'
  | 'WORKSHOP_TECHNICIAN'
  | 'ACCOUNTANT';
```

### `src/app/core/models/catalog.model.ts`
```typescript
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parent: Category | null;
  createdAt: string;
}

export interface ProductTemplate {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  description: string | null;
  isActive: boolean;
  category: Category;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string | null;
  purchasePrice: number;
  sellingPrice: number;
  unit: string | null;
  isActive: boolean;
  specs: Record<string, string>;
  createdAt: string;
}
```

### `src/app/core/models/inventory.model.ts`
```typescript
export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  isActive: boolean;
}

export interface StockLevel {
  variantId: string;
  warehouseId: string;
  warehouseName: string;
  onHand: number;
  reserved: number;
  available: number;
}

export type TransactionType =
  | 'PURCHASE_RECEIVED'
  | 'SALE'
  | 'WORKSHOP_USAGE'
  | 'ADJUSTMENT_IN'
  | 'ADJUSTMENT_OUT'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT';

export interface InventoryTransaction {
  id: string;
  variantId: string;
  type: TransactionType;
  quantity: number;
  referenceId: string | null;
  referenceType: string | null;
  notes: string | null;
  actorId: string | null;
  createdAt: string;
  warehouse: Warehouse;
}
```

### `src/app/core/models/sales.model.ts`
```typescript
export type OrderStatus = 'DRAFT' | 'CONFIRMED' | 'INVOICED' | 'CANCELLED';
export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'CHEQUE';

export interface SalesOrderLine {
  id: string;
  variantId: string;
  warehouseId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  reservationId: string | null;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  notes: string | null;
  workOrderId: string | null;
  createdAt: string;
  customer: Customer;
  lines?: SalesOrderLine[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string | null;
  createdAt: string;
  customer: Customer;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  notes: string | null;
  actorId: string;
  createdAt: string;
}
```

### `src/app/core/models/workshop.model.ts`
```typescript
export type WorkOrderStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderLineType = 'SERVICE' | 'PART';

export interface WorkOrderLine {
  id: string;
  type: WorkOrderLineType;
  description: string;
  variantId: string | null;
  warehouseId: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  consumed: boolean;
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  status: WorkOrderStatus;
  diagnosis: string | null;
  notes: string | null;
  mileageIn: number | null;
  mileageOut: number | null;
  totalAmount: number;
  technicianId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  vehicle: Vehicle;
  customer: Customer;
  lines?: WorkOrderLine[];
}
```

---

## 5. Auth Service

### `src/app/core/auth/auth.service.ts`
```typescript
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;

  // Signals for reactive auth state
  private _user = signal<CurrentUser | null>(null);
  private _accessToken = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => !!this._user());
  readonly role = computed(() => this._user()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {
    // Attempt to restore session on app load
    this.restoreSession();
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(res => {
        this._accessToken.set(res.accessToken);
        sessionStorage.setItem('refreshToken', res.refreshToken);
        this.loadCurrentUser();
      })
    );
  }

  logout() {
    return this.http.post(`${this.API}/auth/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  refreshToken() {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) return;

    return this.http.post<AuthResponse>(`${this.API}/auth/refresh`, { refreshToken }).pipe(
      tap(res => {
        this._accessToken.set(res.accessToken);
        sessionStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  getAccessToken(): string | null {
    return this._accessToken();
  }

  hasRole(...roles: UserRole[]): boolean {
    const userRole = this.role();
    if (!userRole) return false;
    if (userRole === 'ADMIN') return true;
    return roles.includes(userRole);
  }

  private loadCurrentUser() {
    this.http.get<CurrentUser>(`${this.API}/auth/me`).subscribe(
      user => this._user.set(user)
    );
  }

  private restoreSession() {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      this.refreshToken()?.subscribe({
        next: () => this.loadCurrentUser(),
        error: () => this.clearSession()
      });
    }
  }

  private clearSession() {
    this._user.set(null);
    this._accessToken.set(null);
    sessionStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
```

---

## 6. HTTP Interceptors

### Auth Interceptor
```typescript
// src/app/core/auth/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
```

### Token Refresh Interceptor
```typescript
// src/app/core/auth/token-refresh.interceptor.ts
export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        return authService.refreshToken()?.pipe(
          switchMap(() => next(req.clone({
            setHeaders: { Authorization: `Bearer ${authService.getAccessToken()}` }
          })))
        ) ?? throwError(() => error);
      }
      return throwError(() => error);
    })
  );
};
```

---

## 7. Routing

### `src/app/app.routes.ts`
```typescript
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },

      // Catalog
      { path: 'catalog/categories',       loadComponent: () => import('./features/catalog/categories/categories.component').then(m => m.CategoriesComponent) },
      { path: 'catalog/templates',         loadComponent: () => import('./features/catalog/templates/templates.component').then(m => m.TemplatesComponent) },
      { path: 'catalog/templates/:id',     loadComponent: () => import('./features/catalog/templates/template-detail.component').then(m => m.TemplateDetailComponent) },
      { path: 'catalog/variants/search',   loadComponent: () => import('./features/catalog/variants/variant-search.component').then(m => m.VariantSearchComponent) },

      // Inventory
      { path: 'inventory/warehouses',      loadComponent: () => import('./features/inventory/warehouses/warehouses.component').then(m => m.WarehousesComponent) },
      { path: 'inventory/stock',           loadComponent: () => import('./features/inventory/stock-levels/stock-levels.component').then(m => m.StockLevelsComponent) },
      { path: 'inventory/movements',       loadComponent: () => import('./features/inventory/movements/movements.component').then(m => m.MovementsComponent) },
      { path: 'inventory/receive',         loadComponent: () => import('./features/inventory/receive-stock/receive-stock.component').then(m => m.ReceiveStockComponent) },

      // Customers
      { path: 'customers',                 loadComponent: () => import('./features/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent) },
      { path: 'customers/:id',             loadComponent: () => import('./features/customers/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponent) },

      // Sales
      { path: 'sales/orders',              loadComponent: () => import('./features/sales/orders/order-list.component').then(m => m.OrderListComponent) },
      { path: 'sales/orders/new',          loadComponent: () => import('./features/sales/orders/create-order.component').then(m => m.CreateOrderComponent) },
      { path: 'sales/orders/:id',          loadComponent: () => import('./features/sales/orders/order-detail.component').then(m => m.OrderDetailComponent) },
      { path: 'sales/invoices',            loadComponent: () => import('./features/sales/invoices/invoice-list.component').then(m => m.InvoiceListComponent) },
      { path: 'sales/invoices/:id',        loadComponent: () => import('./features/sales/invoices/invoice-detail.component').then(m => m.InvoiceDetailComponent) },

      // Vehicles
      { path: 'vehicles',                  loadComponent: () => import('./features/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent) },
      { path: 'vehicles/:id',              loadComponent: () => import('./features/vehicles/vehicle-detail/vehicle-detail.component').then(m => m.VehicleDetailComponent) },

      // Workshop
      { path: 'workshop/work-orders',      loadComponent: () => import('./features/workshop/work-orders/work-order-list.component').then(m => m.WorkOrderListComponent) },
      { path: 'workshop/work-orders/new',  loadComponent: () => import('./features/workshop/work-orders/create-work-order.component').then(m => m.CreateWorkOrderComponent) },
      { path: 'workshop/work-orders/:id',  loadComponent: () => import('./features/workshop/work-orders/work-order-detail.component').then(m => m.WorkOrderDetailComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
```

---

## 8. Sidebar Navigation Config

```typescript
// Sidebar items per role
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'layout-dashboard',
    route: '/dashboard',
    roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_EMPLOYEE', 'WORKSHOP_TECHNICIAN', 'ACCOUNTANT']
  },
  {
    label: 'Catalog',
    icon: 'package',
    roles: ['ADMIN', 'INVENTORY_MANAGER', 'SALES_EMPLOYEE'],
    children: [
      { label: 'Categories',  route: '/catalog/categories' },
      { label: 'Products',    route: '/catalog/templates' },
      { label: 'Part Search', route: '/catalog/variants/search' },
    ]
  },
  {
    label: 'Inventory',
    icon: 'warehouse',
    roles: ['ADMIN', 'INVENTORY_MANAGER'],
    children: [
      { label: 'Stock Levels',  route: '/inventory/stock' },
      { label: 'Receive Stock', route: '/inventory/receive' },
      { label: 'Movements',     route: '/inventory/movements' },
      { label: 'Warehouses',    route: '/inventory/warehouses' },
    ]
  },
  {
    label: 'Customers',
    icon: 'users',
    route: '/customers',
    roles: ['ADMIN', 'SALES_EMPLOYEE', 'ACCOUNTANT']
  },
  {
    label: 'Sales',
    icon: 'shopping-cart',
    roles: ['ADMIN', 'SALES_EMPLOYEE', 'ACCOUNTANT'],
    children: [
      { label: 'Orders',   route: '/sales/orders' },
      { label: 'Invoices', route: '/sales/invoices' },
    ]
  },
  {
    label: 'Vehicles',
    icon: 'car',
    route: '/vehicles',
    roles: ['ADMIN', 'WORKSHOP_TECHNICIAN', 'SALES_EMPLOYEE']
  },
  {
    label: 'Workshop',
    icon: 'wrench',
    route: '/workshop/work-orders',
    roles: ['ADMIN', 'WORKSHOP_TECHNICIAN']
  },
];
```

---

## 9. Page-by-Page Implementation Guide

### 9.1 Login Page (`/login`)
- Full-page centered layout, no sidebar
- Email + password fields with validation
- Submit calls `AuthService.login()`
- On success: redirect to `/dashboard`
- Show error toast on failure
- Fixio logo + tagline at top

---

### 9.2 Dashboard (`/dashboard`)

**All roles see this. Content varies by role.**

**Stat cards row (top):**
- Admin/Inventory: Total Products, Low Stock Items, Today's Receipts, Stock Value
- Sales/Accountant: Open Orders, Unpaid Invoices, Today's Payments, Monthly Revenue
- Technician: Open Work Orders, In-Progress, Completed Today, Pending Parts

**Quick actions:**
- Sales Employee: New Order, New Customer
- Technician: New Work Order, Look Up Vehicle
- Inventory: Receive Stock, Adjust Stock

**Recent activity list** — last 10 audit log entries for the current user's domain

---

### 9.3 Categories (`/catalog/categories`)

**Layout:** Two-panel. Left panel = category tree. Right panel = selected category details + edit form.

**Left panel:**
- Collapsible tree of categories
- Root categories expand to show children
- Click to select → loads detail on right
- "New Category" button at top

**Right panel:**
- Category name, description, slug, isActive toggle
- Edit form inline
- "Add Subcategory" button
- List of templates in this category with links

---

### 9.4 Product Templates (`/catalog/templates`)

**Layout:** Filter sidebar left + product card grid right.

**Filter sidebar:**
- Category tree selector
- Active/inactive toggle
- Brand filter

**Product grid:**
- Card per template: name, brand, category badge, variant count, active status
- Click → goes to template detail page

**Template detail (`/catalog/templates/:id`):**
- Header: name, brand, category, slug, active toggle, edit button
- Tabs: Overview | Variants | Stock Summary
- Variants tab: table of all variants with SKU, prices, unit, spec preview
- "+ Add Variant" button → slide-over form

---

### 9.5 Variant Search (`/catalog/variants/search`)

**Purpose:** Find parts by vehicle compatibility.

**Layout:** Search form at top, results grid below.

**Search form:**
- Dynamic key-value filter builder — user adds filters like `compatibility = Toyota Corolla`
- "Search" button → calls `POST /catalog/variants/search`

**Results:**
- Table: SKU, Name, Template, Specs preview, Purchase Price, Selling Price, Unit
- Click → slide-over with full variant detail + stock levels across warehouses
- "Receive Stock" shortcut button

---

### 9.6 Stock Levels (`/inventory/stock`)

**Layout:** Warehouse tabs at top + searchable variant table.

**Warehouse tabs:**
- One tab per warehouse
- Each tab shows stock table for that warehouse

**Stock table columns:**
- SKU | Product Name | On Hand | Reserved | Available | Unit | Status
- Row color coding: green (available > 5), yellow (1–5), red (0)
- Click row → side panel with full ledger history

**Filter:** search by SKU or product name

---

### 9.7 Receive Stock (`/inventory/receive`)

**Layout:** Single focused form page.

**Form fields:**
- Variant SKU search (autocomplete from catalog)
- Warehouse selector
- Quantity
- Reference type (PURCHASE_ORDER / MANUAL)
- Reference ID (optional)
- Notes

**On submit:** calls `POST /inventory/receive`, shows success toast, clears form for next entry.

**Batch mode:** "Add another" keeps the form open after success for rapid stock receiving.

---

### 9.8 Stock Movements (`/inventory/movements`)

**Layout:** Filters top + timeline/table below.

**Filters:**
- Variant SKU search
- Warehouse selector
- Transaction type multi-select
- Date range picker
- Limit selector (50 / 100 / 200)

**Table columns:**
- Date | Type | Quantity | Warehouse | Reference | Notes | Actor

**Type badge colours:**
- PURCHASE_RECEIVED: green
- SALE: blue
- WORKSHOP_USAGE: purple
- ADJUSTMENT_IN: teal
- ADJUSTMENT_OUT: orange

---

### 9.9 Customers (`/customers`)

**Layout:** Search bar + table.

**Table columns:** Name | Phone | Email | Credit Limit | Credit Used | Status | Actions

**Search:** by name or phone (client-side filter)

**"New Customer" button** → slide-over form

**Customer Detail (`/customers/:id`):**
- Header card: name, phone, email, address, credit bar (used/limit)
- Tabs: Vehicles | Sales Orders | Invoices
- Each tab shows the relevant items linked to this customer
- Quick action buttons per tab

---

### 9.10 Sales Orders (`/sales/orders`)

**Layout:** Filter bar + orders table.

**Filter bar:** Status filter (All/DRAFT/CONFIRMED/INVOICED/CANCELLED) + customer search + date range

**Table columns:** Order # | Customer | Status badge | Total | Lines | Date | Actions

**Actions per row:**
- DRAFT: Edit, Confirm, Cancel
- CONFIRMED: View, Generate Invoice, Cancel
- INVOICED: View Invoice
- CANCELLED: View

**Create Order (`/sales/orders/new`):**

Step-based form:
1. Select Customer (search by name/phone)
2. Add Line Items:
   - SKU/product search autocomplete
   - Warehouse selector
   - Quantity + unit price fields
   - Real-time line total calculation
   - Stock availability badge next to quantity
3. Review & Confirm:
   - Order summary
   - Total amount
   - Notes field
   - "Save as Draft" or "Confirm Order" buttons

**Order Detail (`/sales/orders/:id`):**
- Header: order number, status badge, total, customer, created date
- Lines table: SKU, Description, Qty, Unit Price, Total, Stock Status
- Action buttons based on status:
  - DRAFT: Add Line, Confirm, Cancel
  - CONFIRMED: Generate Invoice, Cancel
  - INVOICED: View Invoice link
- Timeline of status changes

---

### 9.11 Invoices (`/sales/invoices`)

**Layout:** Status tabs (All/Unpaid/Partial/Paid/Cancelled) + table.

**Table columns:** Invoice # | Order # | Customer | Total | Paid | Remaining | Due Date | Status | Actions

**Invoice Detail (`/sales/invoices/:id`):**
- Printable invoice layout:
  - Header: Fixio logo, invoice number, date, due date
  - Customer info block
  - Line items table (from the order)
  - Totals: subtotal, total
  - Payment history table
  - Remaining balance
- Action buttons:
  - "Record Payment" → modal
  - "Print" → browser print
- Payment modal:
  - Amount field (pre-filled with remaining)
  - Method selector (CASH/CARD/BANK_TRANSFER/CHEQUE)
  - Notes
  - Submit

---

### 9.12 Vehicles (`/vehicles`)

**Layout:** Search bar + vehicles table.

**Search:** by license plate, make, model, or customer name

**Table columns:** License Plate | Make | Model | Year | Color | Mileage | Customer | Actions

**"Register Vehicle" button** → slide-over form

**Vehicle Detail (`/vehicles/:id`):**
- Vehicle info card: make, model, year, plate, VIN, color, current mileage
- Customer info panel
- Service History tab → list of all work orders for this vehicle
- Each work order row: WO#, date, status, diagnosis, total → click to work order detail

---

### 9.13 Work Orders (`/workshop/work-orders`)

**Layout:** Kanban board OR list view toggle.

**Kanban board:**
- 4 columns: DRAFT | IN PROGRESS | COMPLETED | CANCELLED
- Drag card to move status (with confirmation)
- Each card: WO#, vehicle plate, customer, total, technician avatar

**List view:**
- Table: WO# | Vehicle | Customer | Status | Technician | Total | Date | Actions

**Create Work Order (`/workshop/work-orders/new`):**
1. Select Vehicle (search by license plate — autocomplete)
   - Shows vehicle info card + customer auto-filled
2. Intake details: mileage in, diagnosis, notes
3. Submit → goes to work order detail to add lines

**Work Order Detail (`/workshop/work-orders/:id`):**

Header section:
- WO number, status badge, created date
- Vehicle info: plate, make/model/year, mileage in
- Customer info
- Technician (assigned when started)
- Action buttons: Start | Complete | Cancel (based on status)

Lines section:
- Table: Type | Description | Qty | Unit Price | Total | Consumed
- PART rows: show consumed toggle button (green check when consumed)
- SERVICE rows: no consume button
- "Add Line" button → slide-over:
  - Type selector (SERVICE / PART)
  - If PART: SKU search autocomplete + warehouse selector + stock availability
  - Description, qty, unit price
  - Real-time line total

When status = IN_PROGRESS:
- Each PART line shows "Mark Consumed" button
- On click: confirm dialog → calls consume endpoint → updates stock live

Summary footer:
- Parts subtotal | Services subtotal | Grand Total

---

## 10. Shared Components

### Status Badge
```typescript
@Component({
  selector: 'app-status-badge',
  template: `<span [class]="badgeClass">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input() status!: string;

  get badgeClass() {
    const map: Record<string, string> = {
      DRAFT:        'badge-draft',
      CONFIRMED:    'badge-confirmed',
      INVOICED:     'badge-confirmed',
      PAID:         'badge-paid',
      UNPAID:       'badge-unpaid',
      PARTIAL:      'badge-partial',
      CANCELLED:    'badge-cancelled',
      IN_PROGRESS:  'badge-progress',
      COMPLETED:    'badge-completed',
    };
    return map[this.status] ?? 'badge-draft';
  }

  get label() {
    return this.status.replace('_', ' ');
  }
}
```

### Confirm Dialog
```typescript
// Used for: cancel order, cancel work order, delete actions
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="card p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-600">{{ message }}</p>
        <div class="mt-6 flex gap-3 justify-end">
          <button class="btn-secondary" (click)="cancel.emit()">Cancel</button>
          <button class="btn-danger" (click)="confirm.emit()">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmLabel = 'Confirm';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
```

---

## 11. Error Handling Strategy

```typescript
// Global error handler
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private toastr: ToastrService) {}

  handleError(error: HttpErrorResponse) {
    if (error.status === 422) {
      // Domain rule violation — show the message directly
      this.toastr.error(error.error.message, 'Business Rule Violation');
    } else if (error.status === 409) {
      this.toastr.error(error.error.message, 'Conflict');
    } else if (error.status === 404) {
      this.toastr.error('Resource not found', 'Not Found');
    } else if (error.status === 500) {
      this.toastr.error('Something went wrong. Please try again.', 'Server Error');
    }
  }
}
```

---

## 12. State Management Strategy

Use **Angular Signals** for local component state and **RxJS** for async API calls.

```typescript
// Example: Work Order Detail Component
@Component({ ... })
export class WorkOrderDetailComponent {
  workOrder = signal<WorkOrder | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Derived state
  canStart    = computed(() => this.workOrder()?.status === 'DRAFT');
  canComplete = computed(() => this.workOrder()?.status === 'IN_PROGRESS');
  canCancel   = computed(() => !['COMPLETED','CANCELLED'].includes(this.workOrder()?.status ?? ''));
  partLines   = computed(() => this.workOrder()?.lines?.filter(l => l.type === 'PART') ?? []);
  serviceLines = computed(() => this.workOrder()?.lines?.filter(l => l.type === 'SERVICE') ?? []);
  totalParts    = computed(() => this.partLines().reduce((s, l) => s + l.lineTotal, 0));
  totalServices = computed(() => this.serviceLines().reduce((s, l) => s + l.lineTotal, 0));
}
```

---

## 13. Build & Deploy

```bash
# Development
ng serve --proxy-config proxy.conf.json

# proxy.conf.json
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}

# Production build
ng build --configuration production

# Output in dist/fixio-frontend/
```

---

## 14. Development Checklist

### Phase 1 — Foundation
- [ ] Project setup + Tailwind config
- [ ] Core models (TypeScript interfaces for all API responses)
- [ ] AuthService + interceptors
- [ ] Shell layout (sidebar + topbar)
- [ ] Auth guard + role guard
- [ ] Login page

### Phase 2 — Catalog & Inventory
- [ ] Categories page
- [ ] Product templates list + detail
- [ ] Variant search
- [ ] Stock levels page
- [ ] Receive stock form
- [ ] Stock movements table
- [ ] Warehouses page

### Phase 3 — Customers & Sales
- [ ] Customer list + detail
- [ ] Create order wizard
- [ ] Order list + detail
- [ ] Invoice list + detail
- [ ] Payment recording

### Phase 4 — Workshop
- [ ] Vehicle list + detail
- [ ] Work order list (kanban + table)
- [ ] Create work order
- [ ] Work order detail + line management
- [ ] Part consumption flow
- [ ] Complete work order

### Phase 5 — Polish
- [ ] Dashboard with role-specific stats
- [ ] Print views (invoice, work order)
- [ ] Error boundary components
- [ ] Loading skeletons
- [ ] Empty state illustrations
- [ ] Mobile responsiveness audit
