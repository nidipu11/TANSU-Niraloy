# TANSU Niraloy — Centralized Property Rental & Property Sale Management System

> **Frontend Implementation: Pure HTML5, CSS3, and Vanilla JavaScript**  
> *Architected to be 100% Java (Spring Boot) & Relational SQL Backend Ready.*

---

## 1. Core Intermediary Business Architecture

TANSU Niraloy operates on an institutional intermediary model designed to eliminate tenant-landlord fraud and rent disputes in Dhaka, Bangladesh:

```
[ PROPERTY OWNER ] 
       │  (Submits listing with deed & photos)
       ▼
[ TANSU NIRALOY ADMIN / SYSTEM ] ── (Performs RAJUK & physical inspection)
       │  (Publishes verified listing to catalog)
       ▼
[ PROSPECTIVE TENANT ] ── (Requests Visit / Rent / Buy via TANSU Desk)
       │
       ▼
[ TANSU NIRALOY ADMIN ] ── (Escorts viewing, drafts legal lease, collects payment)
       │
       ▼
[ OWNER SETTLEMENT ] ── (Net settlement disbursed to Owner via BEFTN/NPSB)
```

**Golden Business Rule:** Owner and Tenant **never** interact or transact directly. All communication, visits, leases, payments, and complaints are mediated through the TANSU Niraloy administrative intermediary.

---

## 2. Technology Constraints & Purity

- **Frontend Tech**: Pure **HTML5**, **CSS3**, and **Vanilla JavaScript (ES6+)**.
- **Zero Frameworks**: No React, Vue, Angular, TypeScript, Python, PHP, or Node.js runtime.
- **Zero Fake Authenticated Users**: No hardcoded "Rahim Ahmed" demo user. Starts as an unauthenticated GUEST by default.
- **Zero Fake Financial Data / Wallets**: Real itemized dues and receipts. No wallet or escrow UI gimmicks.
- **Responsive Design**: Desktop (1200px+), Laptop (1024px), Tablet (768px), and Mobile (<768px), with an adaptive single-column payment layout on mobile.

---

## 3. Project Structure

```
TANSU-NIRALOY/
├── index.html                   # Landing homepage with Dhaka location search & featured listings
├── properties.html              # Full property catalog with real-time multi-criteria filtering
├── property-details.html        # Property specs, image gallery, and intermediary action modals
├── family-house.html            # Pre-filtered category: FAMILY_HOUSE
├── bachelor-house.html          # Pre-filtered category: BACHELOR_HOUSE
├── flat-sale.html               # Pre-filtered category: FLAT_SALE
├── premium-family.html          # Pre-filtered category: PREMIUM_FAMILY_HOUSING
│
├── signin.html                  # Sign in page with Gmail & password validation
├── signup.html                  # Sign up page with BD phone & Gmail validation (Role: TENANT/OWNER)
├── forgot-password.html         # Clean password reset request flow
├── profile.html                 # Profile management and session review
│
├── tenant-dashboard.html        # Comprehensive Tenant Portal (Overview, Requests, Rentals, Bills, Dues, Support)
│
├── owner-dashboard.html         # Owner Portal (Properties, Verification Status, Settlements)
├── owner-add-property.html      # Owner listing submission with local image preview manager
├── owner-edit-property.html     # Property editing interface
│
├── admin-dashboard.html         # Central Intermediary Admin Console
├── admin-verified-properties.html # Master inventory (shows Owner ID & active Tenant ID)
├── admin-verify-listings.html   # Owner submissions verification queue (Approve / Reject / Correction)
├── admin-rental-requests.html   # Rental applications processing queue
├── admin-purchase-requests.html # Flat purchase inquiries processing queue
├── admin-visit-requests.html    # Escorted visit scheduling queue
├── admin-finance.html           # Clearing account inflows, owner settlements, and system expenses
├── admin-transactions.html      # Immutable master transactions ledger
├── admin-support.html           # Centralized tenant maintenance & complaints ticketing
├── admin-reports.html           # Zone-wise occupancy analytics & compliance audits
├── admin-settings.html          # Backend API base URL configuration & system parameters
│
├── payment.html                 # Professional 2-column payment checkout interface
├── payment-success.html         # Verified payment receipt & download
├── payment-failed.html          # Transaction declined troubleshooting
│
├── css/
│   ├── style.css                # Design system tokens, typography, grid utilities, colors
│   ├── components.css           # Navigation, buttons, cards, badges, modals, toasts, tables
│   └── responsive.css           # Viewport media queries & mobile single-column rules
│
├── js/
│   ├── api.js                   # Centralized REST client (apiGet, apiPost, apiPut, apiDelete) & fallback repo
│   ├── auth.js                  # Session storage, role guards (GUEST, TENANT, OWNER, ADMIN), and auth logic
│   ├── properties.js            # Catalog rendering, multi-facet filtering, and detail page bindings
│   ├── tenant.js                # Tenant dashboard logic, requests, itemized dues, and support tickets
│   ├── owner.js                 # Owner listing management, image upload preview handling, settlements
│   ├── admin.js                 # Admin verification workflow, request triage, and accounting summaries
│   ├── payments.js              # Two-column checkout logic, card formatting, MFS selector, EMI tenure
│   ├── validation.js            # Strict client-side validation rules (Gmail, BD phone, password rules)
│   ├── components.js            # Shared UI mount functions (Header, Footer, Toast, Modal, Role Sandbox)
│   └── app.js                   # Main application bootstrapper
│
└── README.md                    # Documentation & Java Spring Boot Integration Guide
```

---

## 4. Entity Relationships & Future Java Backend Integration

All forms and data models utilize relational entity identifiers:

| Entity Name | Primary Key | Foreign Keys | Future Java REST Endpoint |
|---|---|---|---|
| **User** | `userId` | - | `GET /api/users/me`, `POST /api/auth/signup` |
| **Property** | `propertyId` | `ownerId` | `GET /api/properties`, `POST /api/owner/properties` |
| **Request** | `requestId` | `tenantId`, `propertyId` | `GET /api/tenant/requests`, `POST /api/tenant/requests` |
| **Payment** | `paymentId` | `tenantId`, `propertyId` | `POST /api/payments`, `GET /api/payments/{id}` |
| **Transaction** | `transactionId` | `paymentId`, `tenantId`, `propertyId` | `GET /api/admin/transactions` |
| **Settlement** | `settlementId` | `ownerId`, `propertyId` | `GET /api/owner/settlements`, `GET /api/admin/finance` |
| **Support Ticket** | `supportId` | `tenantId`, `propertyId` | `POST /api/tenant/support`, `GET /api/admin/support` |
| **Expense** | `expenseId` | - | `GET /api/admin/expenses` |

---

## 5. How to Test & Evaluate the System

1. **Open in Browser**: Open `index.html` in any modern web browser.
2. **Browse as Guest**: Search properties across Dhaka (Gulshan, Banani, Dhanmondi, Uttara, Mirpur, Bashundhara) and test filter controls.
3. **Role Testing Sandbox**: Use the unobtrusive floating panel in the bottom-left corner to seamlessly switch between:
   - **GUEST**: Unauthenticated visitor browsing.
   - **TENANT**: Access `tenant-dashboard.html` to view active leases, itemized dues, and trigger payments.
   - **OWNER**: Access `owner-dashboard.html` to submit new properties with image previews and view settlement balances.
   - **ADMIN**: Access `admin-dashboard.html`, review the verification queue, approve listings, and disburse settlements.
4. **Checkout Simulation**: Click **"Pay Now"** on any outstanding due to launch the professional 2-column payment interface (`payment.html`), test card formatting, MFS options (bKash/Nagad/Rocket), and receive an official verified receipt.
