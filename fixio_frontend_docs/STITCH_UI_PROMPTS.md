# Fixio — Google Stitch UI/UX Generation Prompts

> Copy each prompt into Google Stitch to generate the UI/UX for each page.
> Design system: Clean SaaS dashboard, Tailwind CSS, Inter font, blue primary color.

---

## Global Design System Prompt

Use this as the base context for every page:

```
Design a professional SaaS ERP web application called "Fixio" for car workshops and spare parts businesses.

Design system:
- Font: Inter (sans-serif)
- Primary color: Blue (#2563eb)
- Background: Light gray (#f8fafc)
- Cards: White with subtle border and shadow
- Border radius: 12px for cards, 8px for inputs and buttons
- Sidebar: Dark navy (#0f172a) with white icons and text
- Status badges: Pill-shaped, color-coded (green=success, yellow=warning, red=error, blue=info, gray=neutral, purple=in-progress)
- Tables: Clean white background, alternating subtle row hover, no heavy borders
- Typography: Slate-900 for headings, slate-600 for body, slate-400 for hints
- Icons: Lucide icon set (thin stroke, consistent weight)
- Spacing: Generous whitespace, 24px padding on cards
- Buttons: Primary (blue filled), Secondary (white with border), Danger (red filled)

Layout:
- Fixed left sidebar (240px wide, dark navy)
- Top bar (64px, white, with page title and user avatar)
- Main content area with 24px padding
- Responsive — collapses to hamburger on tablet
```

---

## Page 1 — Login Page

```
Design a login page for Fixio, a car workshop ERP system.

Layout:
- Split screen: left half is a dark navy panel with branding, right half is the login form
- Left panel: Fixio logo (wrench icon + "Fixio" wordmark in white), tagline "Workshop management, simplified", and a subtle illustration of a car silhouette or workshop tools
- Right panel: centered white form on light gray background

Form elements:
- "Welcome back" heading (large, slate-900)
- Subtitle: "Sign in to your Fixio account" (slate-500)
- Email input with envelope icon
- Password input with lock icon and show/hide toggle
- "Sign In" button (full width, blue primary)
- Error state: red border on inputs with inline error message below

No registration link — accounts are created by admin only.
Show a loading spinner inside the button when submitting.
```

---

## Page 2 — Dashboard

```
Design the main dashboard for Fixio ERP, showing different content based on user role.

Layout:
- Standard shell: dark navy sidebar left, white topbar, gray content area
- Sidebar shows: Dashboard, Catalog, Inventory, Customers, Sales, Vehicles, Workshop

Content area has 4 zones:

Zone 1 — Stat cards row (4 cards across):
Each card has: icon in a colored circle, metric number (large, bold), label below, subtle trend indicator
Example cards:
- "Open Work Orders" — wrench icon, blue circle, number 12
- "Unpaid Invoices" — file-text icon, yellow circle, number 7, total amount below
- "Low Stock Items" — alert-triangle icon, red circle, number 3
- "Today's Revenue" — trending-up icon, green circle, amount in EGP

Zone 2 — Two-column row:
Left (60%): "Recent Work Orders" — compact table with columns: WO#, Vehicle, Status badge, Technician, Time
Right (40%): "Quick Actions" — vertical stack of action buttons with icons:
  - New Sales Order (blue)
  - New Work Order (indigo)
  - Receive Stock (green)
  - Register Vehicle (slate)

Zone 3 — Full width:
"Recent Invoices" table: Invoice#, Customer, Total, Paid, Remaining, Status badge, Due Date

All tables have "View all →" link in the header.
Show empty states with illustrated placeholders when no data.
```

---

## Page 3 — Categories Page

```
Design the product categories management page for Fixio ERP.

Layout: Two-panel horizontal split inside the main content area.

Left panel (320px, white card):
- Header: "Categories" title + "New Category" button (blue, small, top right)
- Search input at top
- Tree list below: each item is a row with chevron expand icon, folder icon, category name
- Sub-categories indent 20px with a connecting line on the left
- Selected item has blue left border and light blue background
- Items show a small "active" green dot or gray dot for inactive

Right panel (flex-1, white card):
- Empty state when nothing selected: centered illustration + "Select a category to view details"
- When selected, show:
  - Category name as editable heading
  - Breadcrumb: Parent > Current Category
  - Form fields: Name, Slug (auto-generated, editable), Description textarea, Active toggle switch
  - "Save Changes" button + "Add Subcategory" button
  - Section below: "Products in this category" — compact list of product template names with counts
```

---

## Page 4 — Product Templates List

```
Design the product templates (catalog) page for Fixio ERP.

Layout: Filter sidebar left (280px) + main content right.

Left sidebar (white card):
- "Filters" heading
- Category tree with checkboxes
- Brand filter (list of checkboxes with brand names)
- Status filter: Active / Inactive toggle buttons
- "Clear filters" link at bottom

Main content:
- Header: "Products" (h1) + item count + "New Product" button
- View toggle: Grid / Table icons (top right)

Grid view — responsive card grid (3 columns):
Each card:
  - White card with hover shadow
  - Category badge (colored pill) top left
  - Product name (bold, slate-900)
  - Brand name (slate-500, small)
  - Variant count: "4 variants" with package icon
  - Price range: "EGP 8.50 – 25.00"
  - Active status dot (green/gray)
  - "View" button appears on hover

Table view — clean table:
Columns: Product Name | Category | Brand | Variants | Price Range | Status | Actions
```

---

## Page 5 — Product Template Detail + Variants

```
Design the product template detail page for Fixio ERP.

URL: /catalog/templates/:id

Layout: Full-width page with tabs.

Header section (white card):
- Back button "← Products"
- Product name as large heading
- Brand badge + Category breadcrumb
- Active/Inactive status toggle (top right)
- Edit button

Tabs: Overview | Variants | Stock Summary

Overview tab:
- Two-column: left = description, right = metadata (slug, created date, category)

Variants tab (default):
- "+ Add Variant" button top right
- Table with columns:
  SKU | Name | Purchase Price | Selling Price | Unit | Specs preview | Status | Actions
- Specs preview: show 2-3 key specs as small gray pills (e.g. "Toyota Corolla" "1.6L" "2008-2019")
- Each row: Edit (pencil icon) + Deactivate (toggle) actions
- Clicking a row or edit opens a slide-over panel from the right:

Slide-over (Add/Edit Variant):
- "Add Variant" heading
- SKU input (with real-time uniqueness check indicator)
- Name input (optional)
- Purchase Price + Selling Price side-by-side inputs
- Unit select (piece/liter/set/meter)
- Dynamic specs editor: key-value pair builder
  - Two columns: "Spec name" input + "Value" input
  - "+" button to add row, "×" to remove
  - Pre-populated common specs based on category
- Active toggle
- Save + Cancel buttons

Stock Summary tab:
- Table per warehouse: Warehouse Name | On Hand | Reserved | Available
- Color-code available column: green (>5), yellow (1-5), red (0)
```

---

## Page 6 — Variant Search (Part Finder)

```
Design the spare parts search / part finder page for Fixio ERP.

Purpose: Find parts by vehicle specs (e.g. "Toyota Corolla 2020 oil filter")

Layout: Search builder at top, results below.

Search builder (white card):
- Heading: "Find Parts by Specification"
- Dynamic filter builder:
  - Each row: [Spec Key dropdown ▼] [=] [Value input] [× remove]
  - Common keys pre-loaded: compatibility, year_from, year_to, engine, material, position
  - "+ Add Filter" button to add a new row
  - "Search Parts" button (blue, full row width at bottom)

Results section:
- Show count: "Found 8 parts matching your filters"
- Table columns: SKU | Product Name | Template | Specs | Purchase Price | Selling Price | Unit | Stock Status
- Specs column: show key specs as small colored pills
- Stock Status: show colored badge (In Stock / Low Stock / Out of Stock) based on total available
- Each row: "View Stock" button → shows a mini table of stock per warehouse in an expandable row
- "Receive Stock" button on each row (inventory manager only)

Empty state:
- Illustration of magnifying glass + parts
- "No parts found matching these specifications"
- "Try different filters" suggestion
```

---

## Page 7 — Stock Levels

```
Design the inventory stock levels page for Fixio ERP.

Layout: Warehouse tabs at top, filterable stock table below.

Warehouse tabs:
- Tab per warehouse (3 tabs: Main Warehouse / Branch Warehouse / Workshop Storage)
- Each tab shows item count badge
- Active tab: blue underline

Filter bar (below tabs):
- Search input: "Search by SKU or product name"
- Status filter pills: All | In Stock | Low Stock | Out of Stock
- Category filter dropdown

Stock table (white card):
Columns: SKU | Product Name | Category | On Hand | Reserved | Available | Unit | Last Movement | Actions

Row color coding:
- Normal: white
- Low stock (available 1-5): left yellow border accent
- Out of stock (available 0): left red border accent, row slightly tinted

Available column: show number with colored circle indicator (green/yellow/red)

Actions per row:
- Eye icon → slide-over with full ledger history for this variant
- Plus icon → quick receive stock modal (inventory manager only)
- Adjust icon → quick adjustment modal (inventory manager only)

Ledger history slide-over:
- Timeline of all transactions: date, type badge, quantity (+/-), reference, warehouse, actor
- Transaction type colors match the movements page
```

---

## Page 8 — Receive Stock

```
Design the receive stock page for Fixio ERP (inventory management).

Layout: Centered single-column form page (max-width 640px), white card.

Header: "Receive Stock" with back button

Form:
- Section 1: Product
  - Variant SKU input with autocomplete dropdown
  - As user types, show matching SKUs with product name and current stock
  - When selected: show product info card (name, template, current stock badge)

- Section 2: Details
  - Warehouse selector (dropdown with warehouse names)
  - Quantity input (number, min 1) with unit label
  - Reference Type selector: Purchase Order / Manual Receipt / Transfer
  - Reference ID input (optional, UUID or PO number)
  - Notes textarea (optional)

- Section 3: Preview
  - Summary card: "You are adding X [unit] of [Product Name] to [Warehouse]"
  - New stock level preview: "Stock will be: 45 → 95"

Actions:
- "Receive Stock" button (blue, full width)
- "Receive & Add Another" button (secondary, full width) — submits and resets form

Success state:
- Green banner: "50 units of OIL-FLT-001 received into Main Warehouse"
- Quick stats update showing new stock level
```

---

## Page 9 — Customers List

```
Design the customer management page for Fixio ERP.

Layout: Search + action bar top, data table below.

Top bar:
- "Customers" heading (h1) + count badge
- Search input: "Search by name or phone..."
- "+ New Customer" button

Table (white card, full width):
Columns: Customer | Phone | Email | Credit | Orders | Status | Actions

Customer column: avatar circle with initials + name stacked with phone below
Credit column: small progress bar showing used/limit ratio with numbers "EGP 2,000 / 5,000"
Orders column: count of total orders
Status: Active (green badge) / Inactive (gray badge)
Actions: View (eye), Edit (pencil), Deactivate (toggle)

"New Customer" slide-over panel:
- Name (required)
- Phone (required, unique)
- Email (optional)
- Address (textarea, optional)
- Credit Limit (number, EGP)
- Save button
```

---

## Page 10 — Customer Detail

```
Design the customer detail page for Fixio ERP.

URL: /customers/:id

Layout: Header card + tabs.

Header card (white):
- Back button "← Customers"
- Large avatar circle with initials (left)
- Customer name (large heading)
- Phone + email (with icons)
- Address
- Edit button (top right)
- Credit usage bar: "Credit Used: EGP 2,000 of EGP 5,000" with progress bar
- Status badge

Tabs: Vehicles | Orders | Invoices

Vehicles tab:
- List of vehicles as cards: plate number + make/model/year + color dot + mileage
- "+ Register Vehicle" button
- Click card → goes to vehicle detail

Orders tab:
- Table: Order# | Date | Status | Lines | Total | Actions
- "New Order for this Customer" button (pre-fills customer)

Invoices tab:
- Table: Invoice# | Order# | Status | Total | Paid | Remaining | Due Date
- Filter by status
```

---

## Page 11 — Create Sales Order

```
Design the sales order creation page for Fixio ERP (step-based wizard).

Layout: Centered max-width 800px, white card, step indicator at top.

Step indicator: 3 steps with connecting line
① Select Customer → ② Add Items → ③ Review & Confirm

Step 1 — Select Customer:
- Search input: "Search customer by name or phone"
- Autocomplete dropdown with customer cards (name + phone + credit info)
- Selected customer shows info card below:
  - Name, phone, email
  - Credit availability badge
- "Next →" button

Step 2 — Add Items:
- Line items table (starts empty):
  Columns: # | SKU | Product | Qty | Unit Price | Availability | Total | Remove
- Search row at bottom of table:
  - SKU autocomplete input → selects variant
  - Warehouse dropdown → shows stock level
  - Qty input + unit price input
  - Availability badge: "45 available" (green) or "2 available" (yellow) or "Out of stock" (red, blocks add)
  - "+ Add Item" button
- Running total in bottom right
- Notes textarea
- "← Back" and "Next →" buttons

Step 3 — Review & Confirm:
- Customer info summary card
- Order lines table (read-only): Product | Qty | Price | Total
- Grand total (large, blue)
- Two buttons:
  - "Save as Draft" (secondary) — saves without confirming
  - "Confirm Order" (primary blue) — confirms and reserves stock
- Confirmation dialog appears for "Confirm Order" showing what stock will be reserved
```

---

## Page 12 — Order Detail

```
Design the sales order detail page for Fixio ERP.

URL: /sales/orders/:id

Layout: Header + status timeline + lines table + action panel.

Header section (white card):
- Back "← Orders"
- Order number (large: "ORD-2026-001") + status badge
- Customer info block (name, phone, email)
- Created date + last updated
- Notes (if any)

Status timeline (horizontal):
DRAFT → CONFIRMED → INVOICED (cancelled shown as X branch)
Current status highlighted with blue filled circle, completed steps with check marks.

Lines section (white card):
Table: # | Product (SKU + name) | Warehouse | Qty | Unit | Price | Total | Reserved
Reserved column: green check icon if reservation exists, dash if not
Table footer: total row

Action panel (white card, right side or bottom):
Based on status:

DRAFT:
- "Add Line" button
- "Confirm Order" button (blue) with stock impact preview
- "Cancel Order" button (red outline)

CONFIRMED:
- Stock reserved banner: "Stock reserved for all X lines"
- "Generate Invoice" button (blue)
- "Cancel Order" button (red outline, shows warning that reservations will be released)

INVOICED:
- Invoice link card: INV-2026-001 | status | amount
- "View Invoice →" button
```

---

## Page 13 — Invoice Detail (with Print View)

```
Design the invoice detail page for Fixio ERP.

URL: /sales/invoices/:id

Layout: Two-column (invoice view left, actions right).

Left column — Invoice Document (white card, printable):
- Fixio header: logo + "TAX INVOICE" label
- Two info blocks side-by-side:
  Left: "From" — Fixio Workshop, address, phone
  Right: "Bill To" — customer name, address, phone
- Invoice metadata: Invoice# | Order# | Date | Due Date
- Line items table:
  Columns: # | Description (product name + SKU) | Qty | Unit | Unit Price | Total
- Totals section:
  Subtotal
  Total (bold, larger)
- Payment history table:
  Date | Method | Amount | Remaining After
- Balance section:
  Total Paid (green) | Remaining Balance (red if unpaid)
- Status banner at bottom: PAID (green) / UNPAID (yellow) / PARTIAL (orange)

Right column — Actions (white cards stack):
Card 1 — Invoice Status:
- Large status badge
- Circular progress arc showing paid percentage
- "EGP 50 of EGP 75 paid"

Card 2 — Record Payment (if not fully paid):
- Amount input (pre-filled with remaining)
- Payment method buttons: Cash | Card | Bank Transfer | Cheque
- Notes input
- "Record Payment" blue button

Card 3 — Actions:
- Print Invoice button (with printer icon)
- Download PDF button
- Cancel Invoice button (red, only if unpaid)

Print view:
When print is triggered, hide the right column and action buttons, show only the clean invoice document.
```

---

## Page 14 — Vehicles

```
Design the vehicles registration and management page for Fixio ERP.

URL: /vehicles

Layout: Search bar + vehicle card grid.

Top bar:
- "Vehicles" heading + count
- Search input: "Search by plate, make, model or customer"
- "+ Register Vehicle" button

Vehicle cards grid (3 columns):
Each card:
- Car silhouette icon or color swatch (colored circle matching the car color)
- License plate number (large, monospace font, badge style with border)
- Make + Model + Year (bold heading)
- Customer name with person icon
- Mileage with gauge icon
- Active status dot
- "View History" button

"Register Vehicle" slide-over:
- Customer search (autocomplete)
- Make input (with common makes dropdown)
- Model input
- Year selector (dropdown 1990–current year)
- License Plate input (uppercase enforced)
- VIN input (optional, 17 chars, with format hint)
- Color input (color picker or text)
- Current Mileage input
- Save button
```

---

## Page 15 — Vehicle Detail

```
Design the vehicle detail page for Fixio ERP.

URL: /vehicles/:id

Layout: Header info card + service history timeline.

Header card (white):
- Back button
- Large license plate display (bold, border, uppercase)
- Two-column info:
  Left: Make, Model, Year, Color swatch
  Right: VIN, Mileage, Owner (customer link), Status
- Edit button top right

Service History section:
- "Service History" heading + "New Work Order" button
- Timeline of work orders (vertical timeline design):
  Each entry:
    - Date dot on the timeline
    - WO number + status badge
    - Diagnosis/notes preview
    - Mileage in/out
    - Total amount
    - Technician name
    - "View Details →" link
- Empty state: "No service history yet. Create the first work order."
```

---

## Page 16 — Work Orders (Kanban Board)

```
Design the workshop work orders management page for Fixio ERP — Kanban board view.

URL: /workshop/work-orders

Layout: View toggle top right (Kanban / List), Kanban board main content.

Top bar:
- "Work Orders" heading
- View toggle: Kanban icon | Table icon
- "+ New Work Order" button (blue)

Kanban board (4 columns):
Each column has a header with column title + count badge + column color accent:
- DRAFT (gray)
- IN PROGRESS (blue/indigo)
- COMPLETED (green)
- CANCELLED (red, collapsed/smaller)

Work order cards (draggable):
White card with left color border matching column:
- WO number (small, monospace)
- Vehicle license plate (large, bold)
- Make/Model below plate
- Customer name with avatar circle
- Status badge (matches column)
- Total amount (bottom right)
- Technician avatar (if assigned)
- Time indicator: "2 hours ago" or "3 days ago"
- Urgency indicator: if work order is old and still DRAFT, show yellow warning

Clicking a card → navigates to work order detail page.

List view (alternative):
Table: WO# | Vehicle | Customer | Status | Technician | Total | Created | Actions
```

---

## Page 17 — Work Order Detail

```
Design the work order detail page for Fixio ERP — the core workshop screen.

URL: /workshop/work-orders/:id

Layout: Full-width, two-column on desktop (main content left, actions right).

Top header (white card):
- Back "← Work Orders"
- WO number (large: "WO-2026-001") + status badge
- Status progression bar: DRAFT → IN PROGRESS → COMPLETED

Vehicle + Customer section (white card, two sub-panels):
Left — Vehicle:
  License plate (large badge), Make/Model/Year, Color, Mileage In
Right — Customer:
  Name, Phone, Email
  Assigned Technician (avatar + name, assigned when started)

Diagnosis & Notes section:
Editable text areas for diagnosis and notes (editable in DRAFT/IN_PROGRESS).

Lines section (white card, full width):
Header: "Job Card Lines" + "Add Line" button (if not completed/cancelled)

Table columns: Type | Description | Qty | Unit Price | Total | Consumed | Actions

Type column:
- SERVICE: blue "SERVICE" pill
- PART: purple "PART" pill

Consumed column (PART rows only):
- Not consumed: gray circle button "Mark Consumed"
- Consumed: green check badge "Consumed ✓"
- Clicking "Mark Consumed" → confirmation dialog → calls API → updates live

Actions column:
- Edit icon (only in DRAFT/IN_PROGRESS)
- Delete icon (only in DRAFT)

Table footer:
- Services Subtotal | Parts Subtotal | Grand Total

Add Line slide-over:
- Type toggle: SERVICE | PART (large toggle buttons)

SERVICE mode:
  - Description input
  - Unit price input
  - Quantity (default 1)

PART mode:
  - SKU search autocomplete
    - Shows: SKU, product name, current stock badge
  - Warehouse selector with stock level shown
  - Quantity input + availability check:
    - Green: "45 available"
    - Yellow: "2 available — low stock"
    - Red: "0 available — cannot add"
  - Description (auto-filled from product name, editable)
  - Unit price (auto-filled from selling price, editable)

Action panel (right sidebar or bottom bar based on status):

DRAFT status:
- "Start Work Order" button (blue) — assigns current user as technician
- "Cancel" button (red outline)

IN_PROGRESS status:
- Technician info card
- "Complete Work Order" button (green) — shows modal for mileage out
- "Cancel" button (red outline)
Completion modal:
  - Mileage out input
  - Summary: "This will auto-create a Sales Order for EGP 250.00"
  - Confirm button

COMPLETED status:
- Green banner: "Work order completed"
- Link to auto-created sales order: "Sales Order ORD-2026-005 →"
- "Print Job Card" button

CANCELLED status:
- Red banner: "Work order cancelled"
```

---

## Design Notes for All Pages

```
Global interaction patterns:

1. Loading states:
   - Skeleton loaders (gray animated blocks) for table rows and cards
   - Spinner inside buttons when submitting
   - Never show empty state during loading

2. Toast notifications (top-right corner):
   - Success: green with check icon (3 seconds)
   - Error: red with X icon (5 seconds, dismissible)
   - Warning: yellow with alert icon

3. Confirmation dialogs:
   - Modal overlay with dark backdrop
   - Clear action description
   - Destructive button is red
   - Cancel is always secondary/outlined

4. Empty states:
   - Centered illustration (subtle, not distracting)
   - Clear message: what is empty and why
   - Call-to-action button to create the first item

5. Responsive behavior:
   - Sidebar collapses to hamburger menu on < 768px
   - Tables become scrollable horizontally on mobile
   - Cards stack to single column on mobile
   - Forms go full width on mobile

6. Form validation:
   - Inline error messages below inputs (red text, small)
   - Red border on invalid inputs
   - Error only shows after field is touched
   - Submit button disabled while form is invalid

7. Role-based UI:
   - Action buttons not shown if user lacks permission
   - Sidebar items hidden for unauthorized roles
   - No "permission denied" pages — items simply don't appear
```
