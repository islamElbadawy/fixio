# Business Requirements Document (BRD)
## Fixio — Car Workshop & Spare Parts Management System
### Frontend Application

**Version:** 1.0
**Date:** July 2026
**Status:** Approved for Development

---

## 1. Executive Summary

Fixio is an ERP web application for car workshops that sell spare parts and provide vehicle maintenance services. The system manages the complete business lifecycle from spare parts inventory through to workshop job cards, invoicing, and payment collection.

The frontend is a single-page application (SPA) built in Angular, consuming the Fixio REST API. It serves five distinct user roles, each with a tailored experience and restricted access to relevant features.

---

## 2. Business Context

### 2.1 Problem Statement

Car workshops currently manage operations across disconnected tools — spreadsheets for inventory, paper job cards for work orders, and manual invoicing. This causes:

- Stock shortages discovered only when a technician needs a part
- Lost job cards and billing errors
- No visibility into which parts are moving and which are dead stock
- Manual invoice reconciliation prone to error
- No customer history — each visit starts from scratch

### 2.2 Business Objectives

- Eliminate stock-outs by providing real-time inventory visibility
- Digitise the job card process from vehicle intake to invoice
- Ensure every part used in the workshop is billed correctly
- Give management a live view of business performance
- Reduce invoice errors to zero through automated calculation

### 2.3 Success Metrics

| Metric | Target |
|---|---|
| Time to create a work order | < 2 minutes |
| Inventory accuracy | 99%+ |
| Invoice errors | 0 per month |
| Stock-out incidents | < 5% of service occasions |

---

## 3. Stakeholders

| Role | Responsibilities in Fixio |
|---|---|
| **Admin** | Full system access, user management, configuration |
| **Inventory Manager** | Catalog management, stock receiving, adjustments |
| **Sales Employee** | Customer management, sales orders, invoicing, payments |
| **Workshop Technician** | Vehicle intake, work orders, part consumption |
| **Accountant** | Invoice review, payment recording, financial reporting |

---

## 4. Functional Requirements

### 4.1 Authentication Module

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Users must log in with email and password | Must |
| AUTH-02 | Access token must refresh automatically before expiry | Must |
| AUTH-03 | Session must invalidate on logout | Must |
| AUTH-04 | Unauthorized users redirected to login | Must |
| AUTH-05 | Role-based UI — show only permitted features | Must |
| AUTH-06 | Remember last visited page, redirect after login | Should |

### 4.2 Dashboard Module

| ID | Requirement | Priority |
|---|---|---|
| DASH-01 | Show today's key metrics: open work orders, pending invoices, low stock alerts | Must |
| DASH-02 | Quick access actions per role | Must |
| DASH-03 | Recent activity feed | Should |
| DASH-04 | Stock value summary for Inventory Manager | Should |

### 4.3 Catalog Module

| ID | Requirement | Priority |
|---|---|---|
| CAT-01 | Browse categories in a hierarchical tree | Must |
| CAT-02 | List product templates filterable by category | Must |
| CAT-03 | View product variants with specs, prices, and stock level | Must |
| CAT-04 | Search variants by spec attributes (JSONB filter) | Must |
| CAT-05 | Create/edit/deactivate categories | Must (Admin/Inv) |
| CAT-06 | Create/edit/deactivate product templates | Must (Admin/Inv) |
| CAT-07 | Create/edit/deactivate product variants with dynamic specs editor | Must (Admin/Inv) |
| CAT-08 | SKU uniqueness validated in real-time | Should |
| CAT-09 | Bulk import variants from CSV | Could |

### 4.4 Inventory Module

| ID | Requirement | Priority |
|---|---|---|
| INV-01 | View stock level per variant per warehouse (on-hand, reserved, available) | Must |
| INV-02 | Receive stock — link to purchase reference | Must |
| INV-03 | Manual stock adjustment (in/out) with mandatory reason | Must |
| INV-04 | View full ledger history per variant | Must |
| INV-05 | Reserve stock manually | Should |
| INV-06 | Low stock alerts — highlight variants below threshold | Must |
| INV-07 | Warehouse management — create and view warehouses | Must |
| INV-08 | Stock movement report filterable by date, type, warehouse | Should |

### 4.5 Customers Module

| ID | Requirement | Priority |
|---|---|---|
| CUS-01 | List and search customers by name or phone | Must |
| CUS-02 | Customer detail page with vehicles, orders, and invoices | Must |
| CUS-03 | Create and edit customer profiles | Must |
| CUS-04 | View customer credit limit vs used | Should |

### 4.6 Sales Module

| ID | Requirement | Priority |
|---|---|---|
| SAL-01 | Create sales order, add line items, confirm | Must |
| SAL-02 | Stock availability shown per line in real-time | Must |
| SAL-03 | Generate invoice from confirmed order | Must |
| SAL-04 | Record payment (partial or full) with method | Must |
| SAL-05 | Invoice status indicator: UNPAID / PARTIAL / PAID | Must |
| SAL-06 | Printable invoice view | Must |
| SAL-07 | Cancel order with confirmation dialog | Must |
| SAL-08 | Filter orders by status and customer | Should |

### 4.7 Vehicles Module

| ID | Requirement | Priority |
|---|---|---|
| VEH-01 | Register a vehicle with make, model, year, plate, VIN | Must |
| VEH-02 | Vehicle detail page — full service history | Must |
| VEH-03 | Search vehicles by license plate | Must |
| VEH-04 | Link vehicle to customer | Must |

### 4.8 Workshop Module

| ID | Requirement | Priority |
|---|---|---|
| WRK-01 | Create work order — select vehicle, record mileage | Must |
| WRK-02 | Add service lines (labor) and part lines to work order | Must |
| WRK-03 | Start work order — assigns technician | Must |
| WRK-04 | Mark individual parts as consumed — deducts from stock | Must |
| WRK-05 | Complete work order — auto-creates sales order | Must |
| WRK-06 | Work order status board: DRAFT / IN PROGRESS / COMPLETED | Must |
| WRK-07 | Cancel work order with confirmation | Must |
| WRK-08 | Print job card | Should |

### 4.9 Audit & Reporting

| ID | Requirement | Priority |
|---|---|---|
| AUD-01 | Audit log viewer — filter by entity and action | Should |
| REP-01 | Stock movement report | Should |
| REP-02 | Sales summary by date range | Could |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 3 seconds on 4G connection
- API response rendered in UI: < 500ms after response received
- Table renders up to 200 rows without pagination freezing

### 5.2 Usability

- Mobile-responsive — works on tablets (minimum 768px viewport)
- All actions reachable within 3 clicks from the dashboard
- Confirmation dialogs for all destructive actions (delete, cancel, refund)
- Form validation with inline error messages before submission

### 5.3 Security

- Never store tokens in localStorage — use memory store + secure HttpOnly cookie for refresh token
- Auto-logout after access token expiry if refresh fails
- Role guards on every route — redirect unauthorized users
- Sanitize all user inputs before display

### 5.4 Accessibility

- WCAG 2.1 AA compliant
- All interactive elements keyboard navigable
- Colour contrast ratio ≥ 4.5:1
- Screen reader compatible labels on all inputs

---

## 6. Business Rules

| Rule | Description |
|---|---|
| BR-01 | Selling price must always exceed purchase price |
| BR-02 | Stock cannot go below zero — reservations block over-selling |
| BR-03 | A confirmed order cannot be edited — must cancel and recreate |
| BR-04 | An invoiced order cannot be cancelled |
| BR-05 | Payments cannot exceed the invoice total |
| BR-06 | Parts consumed in the workshop are non-reversible |
| BR-07 | A work order must have at least one line before completion |
| BR-08 | Completing a work order automatically creates a sales order |
| BR-09 | Stock is only permanently deducted when the invoice is fully paid |
| BR-10 | License plate numbers must be unique across all vehicles |

---

## 7. User Stories

### Admin
- As an Admin, I want to create user accounts with specific roles so that staff can access only their relevant features
- As an Admin, I want to deactivate users without deleting them so their history is preserved
- As an Admin, I want to see the audit log to investigate discrepancies

### Inventory Manager
- As an Inventory Manager, I want to add new products with dynamic attributes so parts with different specs are correctly catalogued
- As an Inventory Manager, I want to receive stock against a purchase reference so the ledger is traceable
- As an Inventory Manager, I want to see which products are running low so I can reorder before stock-outs occur

### Sales Employee
- As a Sales Employee, I want to quickly look up a customer by phone number to find their account
- As a Sales Employee, I want to see real-time stock availability when adding order lines so I never sell what we don't have
- As a Sales Employee, I want to generate and print an invoice so the customer has proof of purchase

### Workshop Technician
- As a Workshop Technician, I want to record a vehicle's mileage when it comes in so the service history is accurate
- As a Workshop Technician, I want to mark each part as consumed so inventory is automatically updated
- As a Workshop Technician, I want to complete a job card so billing is triggered automatically

### Accountant
- As an Accountant, I want to see all unpaid invoices so I can follow up on outstanding payments
- As an Accountant, I want to record partial payments so customers can pay in installments
- As an Accountant, I want to filter invoices by date range for monthly reconciliation

---

## 8. Integration Points

The frontend integrates exclusively with the Fixio REST API:

- **Base URL:** `http://localhost:3000/api/v1` (development)
- **Auth:** Bearer token in Authorization header
- **Format:** JSON request/response bodies
- **Docs:** Swagger UI at `/api/docs`

All cross-module automation (stock reservation, ledger entries, auto-created sales orders) happens server-side. The frontend only needs to make the triggering API call and refresh the relevant data after.

---

## 9. Out of Scope (MVP)

- Supplier management module
- Purchase order creation (stock is received manually via `/inventory/receive`)
- Customer-facing portal
- Email notifications
- Native mobile app
- Multi-currency support
- Tax calculation
- Barcode scanning

---

## 10. Assumptions

- All users access the application via a modern browser (Chrome 120+, Firefox 120+, Edge 120+)
- The backend API is already built and available
- No offline support is required
- All monetary values are in a single currency (EGP)
- One workshop location per installation (no multi-branch in MVP)
