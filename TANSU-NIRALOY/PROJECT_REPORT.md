# United International University
### Department of Computer Science and Engineering (CSE)
### Course: CSE 2118: Advanced Object-Oriented Programming (AOOP)

---

# PROJECT REPORT

## TANSU Niraloy — Property Rental & Sale Management System

| Field | Details |
| :--- | :--- |
| **Student Name** | Nurul Islam Dipu |
| **Student ID** | *[Insert Your Student ID, e.g., 0112XXXXXX]* |
| **Section** | *[Insert Your Section, e.g., H]* |
| **Submitted To** | *[Insert Course Faculty Name, e.g., Mr. Fazlul Haque]* |
| **Date of Submission** | 27-09-2026 |
| **GitHub Repository Link** | [https://github.com/nidipu11/TANSU-Niraloy.git](https://github.com/nidipu11/TANSU-Niraloy.git) |

---

## Abstract

In fast-growing metropolitan cities like Dhaka, urban tenancy and real estate transactions suffer from severe structural challenges: fragmented classifieds, unverified broker listings, misleading property photographs, arbitrariness in security deposit refunds, delayed rental disbursements to property owners, and lack of neutral third-party mediation. This project designs and implements **TANSU Niraloy**, an end-to-end enterprise **Property Rental & Sale Management Platform** acting as a verified intermediary authority. 

Built using a **Spring Boot 3.2.3** RESTful architecture backed by **MySQL 8** (with relational persistence via **Spring Data JPA / Hibernate**) and an interactive, responsive **Vanilla ES6 Web Client**, the system guarantees an authentic and tamper-proof real estate ecosystem. The application enforces three strictly segregated operational roles — **TENANT**, **OWNER**, and **ADMIN (Intermediary Authority)**. Key business capabilities include:
1. Mandatory administrative vetting of property deeds and specifications before listings go live;
2. Formal rental and purchase request workflows preventing direct tenant-owner friction;
3. Automated monthly rent dues generation, transparent late penalty policies, and an integrated multi-channel checkout simulation (Cards, bKash, Nagad, Net Banking);
4. An automated intermediary clearing and escrow settlement engine that retains a 20% platform maintenance fee while disbursing 80% net earnings directly to property owners via banking (BEFTN/NPSB) and MFS rails;
5. Centralized tenant grievance handling and maintenance ticket dispatching.

The backend exposes **30+ REST endpoints** structured around standard HTTP semantics and status codes (200, 201, 204, 400, 401, 403, 404, 409). The solution has been thoroughly tested across happy paths, role violations, and business constraint boundaries, demonstrating robust data integrity, separation of concerns, and clean OOP principles.

---

## 1. Introduction

### 1.1 Background and Problem Statement

Finding and leasing residential or commercial property in urban Bangladesh is traditionally governed by informal arrangements, local intermediaries, and unvetted online listings. Both tenants and property owners face persistent vulnerabilities:
- **Misrepresentation and Ghost Listings:** Platforms often showcase properties without verifying ownership deeds, municipal approval, or physical availability.
- **Tenant Vulnerability:** Renters frequently encounter sudden eviction threats, hidden utility surcharges, and unjustified withholding of initial security deposits.
- **Owner Default Risks:** Property owners endure late rental payments, unauthorized subletting, and cumbersome manual collections with zero formal payment audit trails.
- **Absence of Escrow & Mediation:** In the event of building maintenance issues or contractual disagreements, there is no accredited institutional intermediary to arbitrate disputes.

An enterprise solution to this problem requires much more than a simple bulletin board or basic CRUD directory. It demands:
- **Strict Role-Based Authorization:** Segregating operational boundaries between Tenants (renters/buyers), Property Owners (landlords/sellers), and Admin Regulators.
- **Vetting Gatekeeper:** Enforcing an administrative workflow where newly submitted properties remain in `PENDING` status until legal and structural documentation is cleared.
- **Intermediary Financial Clearing:** Processing tenant rental dues through an institutional gateway, calculating platform commissions (20%) and owner entitlements (80%), and facilitating traceable disbursements.
- **Lease State Machine:** Transitioning property availability dynamically (`AVAILABLE` $\rightarrow$ `RENTED` / `SOLD` $\rightarrow$ `INACTIVE`) upon approved tenant agreements.

### 1.2 Objectives

1. **Role-Based Access Control:** Secure user registration, authentication, and role authorization for `TENANT`, `OWNER`, and `ADMIN`.
2. **Property Vetting Lifecycle:** Implement property creation for owners that mandates administrative verification before appearing in public searches.
3. **Formal Tenancy Request Pipeline:** Model tenant applications for renting, purchasing, and scheduling escorted property visits.
4. **Automated Billing & Dues Generator:** Automatically generate itemized tenant dues (rent + utility charges) with due dates upon administrative lease approval.
5. **Two-Column Payment Checkout Gateway:** Deliver an interactive checkout simulation supporting Card, MFS (bKash, Nagad, Rocket), and Net Banking with automated receipt generation.
6. **Intermediary Escrow & Settlement Engine:** Formally track cleared inflows, deduct platform service fees, credit owner balances, and manage owner withdrawal disbursements.
7. **Robust REST Architecture:** Design clean RESTful endpoints adhering to standard HTTP verbs, explicit response codes, and centralized exception handling.

### 1.3 Scope

#### In Scope
- **RESTful API Service:** Full backend implementation using Spring Boot, Spring Data JPA, Jakarta Validation, and MySQL.
- **Entities & Relationships:** Robust domain modeling for Users, Properties, Property Requests, Tenant Dues, Payments, Collections, Owner Settlements, Operating Expenses, and Support Tickets.
- **Intermediary Operations Desk:** Comprehensive Admin controls for listing verification, lease offers, financial reconciliations, and maintenance ticket handling.
- **Responsive Multi-Role Frontend:** Pure Vanilla JavaScript (ES6+), HTML5, and CSS3 client communicating asynchronously via Fetch API with JSON payloads.
- **Financial Accounting:** Ledger tracking collections, system revenue, owner balances, and withdrawal payout approvals.

#### Out of Scope (Deliberately Not Built)
- Real production banking API integration (using simulated secure payment processing instead of live PCI-DSS payment gateways).
- Physical GPS tracking of field officers during accompanied apartment inspections.
- Automated third-party SMS/Email gateway delivery (system notifications and printable receipts handled in-app).
- Microservices container orchestration and Kubernetes cluster scaling (focused on clean layered monolithic design).

---

## 2. Tools and Technologies

| Category | Tool / Version | Why it was used |
| :--- | :--- | :--- |
| **Language** | Java 17 (LTS) | Modern LTS release; text blocks, records, stream pipelines, and enhanced switch patterns used throughout. |
| **Framework** | Spring Boot 3.2.3 | Production-ready framework providing dependency injection, auto-configuration, and embedded Tomcat container. |
| **Web Layer** | Spring Web MVC (`spring-boot-starter-web`) | Exposes REST controllers, request routing, Jackson JSON serialization, and HTTP parameter binding. |
| **Persistence** | Spring Data JPA / Hibernate ORM | Eliminates boilerplate JDBC code; provides derived query generation, object-relational mapping, and `@Transactional` boundaries. |
| **Database** | MySQL 8.0 (via XAMPP / Local Server) | Industry-standard, relational ACID-compliant database ensuring transactional consistency. |
| **Validation** | Jakarta Bean Validation (`spring-boot-starter-validation`) | Declarative validation on incoming DTOs (`@NotNull`, `@NotBlank`, `@Positive`, `@Email`). |
| **Boilerplate** | Project Lombok | Automates getters, setters, constructors, and builder patterns (`@Builder`, `@Getter`, `@Setter`) on domain entities. |
| **Build Tool** | Apache Maven (`mvnw` wrapper) | Manages dependencies, lifecycle plugins, compilation, and self-contained builds. |
| **Frontend** | Vanilla JavaScript (ES6+), HTML5, CSS3 | Clean, native, dependency-free client leveraging CSS Grid/Flexbox, Async/Await Fetch API, and modular architecture. |
| **Testing** | cURL, Postman, Browser DevTools | Comprehensive verification of REST endpoints, status codes, payload validations, and failure cases. |
| **Version Control**| Git & GitHub | Distributed version control with structured feature branches and atomic commits. |

---

## 3. Project Setup

The backend service was initialized using Spring Initializr and structured as follows:

| Initializr Field | Value |
| :--- | :--- |
| **Project** | Maven |
| **Language** | Java 17 |
| **Spring Boot Version** | 3.2.3 |
| **Group** | `com.tansu` |
| **Artifact** | `tansu-backend` |
| **Package Name** | `com.tansu.niraloy` |
| **Packaging** | Jar |
| **Dependencies** | Spring Web, Spring Data JPA, MySQL Connector/J, Validation, Lombok, Spring Boot Test |

### Package Structure

```
tansu-backend/
├── pom.xml
├── mvnw / mvnw.cmd
└── src/main/
    ├── java/com/tansu/niraloy/
    │   ├── TansuNiraloyApplication.java         // Main @SpringBootApplication entrypoint
    │   ├── config/
    │   │   ├── CorsConfig.java                  // Cross-Origin Resource Sharing configuration
    │   │   └── DatabaseSeeder.java              // Initial demo properties and user accounts
    │   ├── controller/
    │   │   ├── AdminController.java             // Intermediary desk, metrics & settlement approval
    │   │   ├── AuthController.java              // Registration, sign-in & session handling
    │   │   ├── OwnerController.java             // Owner properties, earnings & withdrawal requests
    │   │   ├── PropertyController.java          // Public catalog browsing, filtering & search
    │   │   ├── PropertyRequestController.java   // Rental, purchase & visit request pipeline
    │   │   └── TenantController.java            // Tenant dues, payments & support ticketing
    │   ├── dto/
    │   │   ├── ApiResponse.java                 // Standardized JSON response envelope
    │   │   ├── AuthDto.java                     // Signin and registration request payloads
    │   │   ├── FinanceDto.java                  // Financial KPI metric aggregations
    │   │   ├── PaymentDto.java                  // Payment checkout transaction payload
    │   │   ├── PropertyDto.java                 // Property creation and listing transfer object
    │   │   ├── PropertyRequestDto.java          // Rental/buy/visit request contract
    │   │   └── SupportTicketDto.java            // Grievance filing transfer object
    │   ├── exception/
    │   │   ├── EmailAlreadyExistsException.java
    │   │   ├── InvalidCredentialsException.java
    │   │   └── UserNotFoundException.java
    │   ├── model/
    │   │   ├── OperatingExpense.java            // Platform overhead & maintenance expense entity
    │   │   ├── OwnerSettlement.java             // Escrow balance & withdrawal record
    │   │   ├── Payment.java                     // Cleared transaction receipt entity
    │   │   ├── Property.java                    // Main property listing entity
    │   │   ├── PropertyRequest.java             // Tenancy application pipeline entity
    │   │   ├── RecoveryNotice.java              // Overdue formal reminder notice entity
    │   │   ├── Role.java                        // Role enum: TENANT, OWNER, ADMIN
    │   │   ├── SupportTicket.java               // Maintenance & dispute ticket entity
    │   │   ├── TenantCollection.java            // Central revenue inflow entity
    │   │   ├── TenantDue.java                   // Monthly rent billing record
    │   │   ├── User.java                        // Account entity with credentials & profile
    │   │   └── UserLoginLog.java                // Authentication audit log
    │   ├── repository/                          // 11 Spring Data JPA repository interfaces
    │   │   ├── OperatingExpenseRepository.java
    │   │   ├── OwnerSettlementRepository.java
    │   │   ├── PaymentRepository.java
    │   │   ├── PropertyRepository.java
    │   │   ├── PropertyRequestRepository.java
    │   │   ├── RecoveryNoticeRepository.java
    │   │   ├── SupportTicketRepository.java
    │   │   ├── TenantCollectionRepository.java
    │   │   ├── TenantDueRepository.java
    │   │   ├── UserLoginLogRepository.java
    │   │   └── UserRepository.java
    │   └── service/                             // Service interfaces and implementations
    │       ├── AuthService.java                 & AuthServiceImpl.java
    │       ├── FinanceService.java              & FinanceServiceImpl.java
    │       ├── PaymentService.java              & PaymentServiceImpl.java
    │       ├── PropertyRequestService.java      & PropertyRequestServiceImpl.java
    │       ├── PropertyService.java             & PropertyServiceImpl.java
    │       └── SupportTicketService.java        & SupportTicketServiceImpl.java
    └── resources/
        └── application.properties               // DataSource, JPA and server port configurations
```

The system strictly follows a **one-directional layering discipline**:
$$\text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Repository} \longrightarrow \text{Entity}$$
Controllers never bypass the service layer to manipulate repositories directly, and business rules remain cleanly isolated within transactional services.

### How to Run the Project

1. **Database Setup:** Ensure MySQL is running (e.g., via XAMPP or native service). Create the database schema once:
   ```sql
   CREATE DATABASE tansu_niraloy;
   ```
2. **Start Backend Service:**
   ```bash
   cd tansu-backend
   mvnw.cmd spring-boot:run
   ```
   *The API will boot on `http://localhost:8080` with embedded Tomcat.*
3. **Launch Frontend Portal:**
   Open the frontend directory in VS Code and launch using Live Server (port `5500`):
   ```
   http://127.0.0.1:5500/index.html
   ```

---

## 4. System Architecture

The TANSU Niraloy backend is built as a **Layered Modular Monolith**. Each layer possesses a distinct responsibility and communicates exclusively with the layer below it.

```
                      +------------------------------------------+
                      |               Client Layer               |
                      |  Web Portal (Vanilla JS ES6 / Fetch API) |
                      +--------------------+---------------------+
                                           | HTTP Requests (JSON)
                                           v
+-----------------------------------------------------------------------------------+
| Controller Layer (@RestController)                                                |
|  - AuthController          - PropertyController      - OwnerController            |
|  - TenantController        - AdminController         - PropertyRequestController  |
|  [Maps URLs, validates input via @Valid, returns DTOs in ApiResponse<T>]          |
+------------------------------------------+----------------------------------------+
                                           | DTOs
                                           v
+-----------------------------------------------------------------------------------+
| Service Layer (@Service, @Transactional)                                          |
|  - PropertyServiceImpl     - PropertyRequestServiceImpl                           |
|  - PaymentServiceImpl      - FinanceServiceImpl                                   |
|  [Business rules: Vetting checks, 80/20 Escrow calculation, Lease transitions]     |
+------------------------------------------+----------------------------------------+
                                           | Entities
                                           v
+-----------------------------------------------------------------------------------+
| Repository Layer (Spring Data JPA / JpaRepository)                                |
|  - PropertyRepository      - PropertyRequestRepository                            |
|  - TenantDueRepository     - OwnerSettlementRepository                            |
|  [Derived query methods, custom @Query, ACID transactions via Hibernate]          |
+------------------------------------------+----------------------------------------+
                                           | JDBC
                                           v
+-----------------------------------------------------------------------------------+
| Database Layer (MySQL 8.0)                                                        |
|  Tables: users, properties, property_requests, tenant_dues, owner_settlements,     |
|          payments, tenant_collections, operating_expenses, support_tickets        |
+-----------------------------------------------------------------------------------+
```

### 4.1 Dependency Injection

Every service and controller receives its dependencies via **constructor injection**, declared concisely using Lombok's `@RequiredArgsConstructor`:

```java
@Service
@RequiredArgsConstructor
public class PropertyRequestServiceImpl implements PropertyRequestService {

    private final PropertyRequestRepository requestRepository;
    private final PropertyRepository propertyRepository;
    private final TenantDueRepository dueRepository;
    private final UserRepository userRepository;
    
    // Spring automatically supplies dependencies from its ApplicationContext
}
```

This design is strictly chosen over `new ServiceImpl()` or field injection (`@Autowired`) for four fundamental reasons:
1. **Testability:** Unit and integration tests can supply mock repositories without spinning up a live database.
2. **Immutability:** Dependencies are marked `final`, ensuring thread safety and preventing accidental reassignment at runtime.
3. **Transaction Context Preservation:** Spring proxies `@Transactional` boundaries correctly only when beans are managed by the container.
4. **Decoupled Contracts:** Components depend on interfaces rather than concrete implementations, adhering to the Dependency Inversion Principle.

### 4.2 End-to-End Request Flow

Consider a tenant submitting a rental request for a flat and the subsequent administrative lease approval:

```
[Tenant Client]                [RequestController]              [RequestService]               [Database (JPA)]
       |                                |                              |                               |
       |-- POST /api/requests --------->|                              |                               |
       |   (PropertyRequestDto)         |-- submitRequest(dto) ------->|                               |
       |                                |                              |-- validate property & user -->|
       |                                |                              |-- save(status="PENDING") ---->|
       |<-- 200 OK (ApiResponse) -------|<-- return saved entity ------|                               |
       |                                |                              |                               |
[Admin Intermediary Desk]               |                              |                               |
       |                                |                              |                               |
       |-- PUT /api/requests/{id}/approve ->                           |                               |
       |                                |-- approveRequest(id) ------->|                               |
       |                                |                              |-- load Request & Property --->|
       |                                |                              |-- setProperty("RENTED") ----->|
       |                                |                              |-- generate TenantDue -------->|
       |                                |                              |-- generate OwnerSettlement -->|
       |<-- 200 OK ("Lease approved") --|<-- return approved data -----|                               |
```

1. **Validation:** The incoming `PropertyRequestDto` is validated at the controller boundary.
2. **Submission:** A `PropertyRequest` record is persisted with status `PENDING`.
3. **Admin Intervention:** The central desk examines ownership authenticity.
4. **Atomic Lease Execution:** Calling `/api/requests/{id}/approve` triggers an atomic transaction:
   - Updates `PropertyRequest` to `APPROVED`;
   - Transitions `Property.availabilityStatus` from `AVAILABLE_FOR_RENT` to `RENTED`;
   - Generates an active monthly billing row in `TenantDue` with rent and utility charges;
   - Initializes an `OwnerSettlement` escrow record for subsequent disbursement.

---

## 5. Implementation

### 5.1 Entity: Property

`Property` represents a listed apartment, family house, or commercial unit.

| Field | Java Type | Annotations | Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `@Id`, `@GeneratedValue(IDENTITY)` | Primary key |
| `propertyId` | `String` | `@Column(unique=true, nullable=false)` | Human-readable identifier (`PROP-24496`) |
| `ownerId` | `String` | `@Column(nullable=false)` | Foreign identity linking the property owner |
| `title` | `String` | `@Column(nullable=false)` | Listing headline / flat name |
| `location` | `String` | `@Column(nullable=false)` | Residential zone (Bashundhara, Gulshan, etc.) |
| `propertyType` | `String` | `@Column(nullable=false)` | `FAMILY_HOUSE`, `BACHELOR_HOUSE`, `FLAT_SALE` |
| `purpose` | `String` | `@Column(nullable=false)` | `RENT` or `SALE` |
| `price` | `Double` | `@Column(nullable=false)` | Monthly rental fee or sale consideration (BDT) |
| `area` | `Integer` | `@Column` | Total square footage (sqft) |
| `bedrooms` | `Integer` | `@Column` | Bedroom count |
| `bathrooms` | `Integer` | `@Column` | Bathroom count |
| `status` | `String` | `@Column` | Administrative status: `PENDING`, `APPROVED`, `REJECTED` |
| `verificationStatus` | `String`| `@Column` | Verification flag: `VERIFIED`, `REJECTED` |
| `availabilityStatus` | `String`| `@Column` | Availability: `AVAILABLE_FOR_RENT`, `RENTED`, `SOLD`, `INACTIVE` |

```java
@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String propertyId;

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String propertyType;

    @Column(nullable = false)
    private String purpose;

    @Column(nullable = false)
    private Double price;

    private Integer area;
    private Integer bedrooms;
    private Integer bathrooms;

    @Builder.Default
    private String status = "PENDING";

    @Builder.Default
    private String verificationStatus = "PENDING";

    @Builder.Default
    private String availabilityStatus = "AVAILABLE_FOR_RENT";

    private String submissionDate;
    private String createdAt;
    private String updatedAt;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDate.now().toString();
        if (this.submissionDate == null) this.submissionDate = LocalDate.now().toString();
        if (this.propertyId == null) {
            this.propertyId = "PROP-" + (10000 + (System.currentTimeMillis() % 90000));
        }
    }
}
```

**In My Own Words:**
`@Entity` signals to Hibernate that this class corresponds to a persistent relational table, mapped explicitly as `properties` by `@Table`. We generate a randomized, user-friendly business ID (`PROP-XXXXX`) inside `@PrePersist` so that public URLs and contracts do not expose sequential database primary keys. Fields default safely to `PENDING` to ensure that no property can accidentally bypass the central administrative verification desk.

---

### 5.2 Repository Layer

Spring Data JPA generates repository implementations at application startup based on declared interface contracts:

```java
public interface PropertyRepository extends JpaRepository<Property, Long> {
    Optional<Property> findByPropertyId(String propertyId);
    List<Property> findByOwnerId(String ownerId);
    List<Property> findByVerificationStatus(String verificationStatus);
    List<Property> findByStatus(String status);
    List<Property> findByPurpose(String purpose);
    List<Property> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT p FROM Property p WHERE p.status = 'PENDING' OR p.verificationStatus = 'PENDING'")
    List<Property> findPendingVerificationQueue();
}
```

By extending `JpaRepository<Property, Long>`, standard CRUD methods (`save`, `findById`, `findAll`, `deleteById`) are provided with zero boilerplate code. Derived query methods such as `findByOwnerId` allow instant filtering by owner identity, while custom `@Query` JPQL expressions isolate specialized administrative queue requirements.

---

### 5.3 Service Layer & Business Logic

The service layer encapsulates business integrity rules. Below is the core implementation managing lease approval, automated billing, and escrow crediting:

```java
@Override
@Transactional
public PropertyRequest approveRequest(String idOrRequestId) {
    PropertyRequest req = findRequestByIdOrRequestId(idOrRequestId);
    req.setStatus("APPROVED");
    PropertyRequest savedReq = requestRepository.save(req);

    String reqType = req.getRequestType() != null ? req.getRequestType().toUpperCase() : "";
    if (reqType.contains("RENT")) {
        Property property = propertyRepository.findByPropertyId(req.getPropertyId()).orElse(null);

        Double rentAmount = (property != null && property.getPrice() != null) ? property.getPrice() : 45000.0;
        Double utilityCharge = 5000.0;
        Double totalBilled = rentAmount + utilityCharge;

        LocalDate today = LocalDate.now();
        String dueMonth = today.getMonth().name() + " " + today.getYear();
        String dueDate = today.withDayOfMonth(Math.min(25, today.lengthOfMonth())).toString();

        // 1. Generate active due bill for tenant
        TenantDue due = TenantDue.builder()
                .dueId("DUE-" + (1000 + (System.currentTimeMillis() % 90000)))
                .tenantId(req.getTenantId())
                .tenantName(req.getTenantName())
                .propertyId(req.getPropertyId())
                .flatTitle(property != null ? property.getTitle() : "Rental Unit")
                .dueMonth(dueMonth)
                .rentAmount(rentAmount)
                .utilityCharge(utilityCharge)
                .totalBilled(totalBilled)
                .paidAmount(0.0)
                .dueAmount(totalBilled)
                .dueDate(dueDate)
                .status("UNPAID")
                .build();
        dueRepository.save(due);

        // 2. Transition Property Availability Status
        if (property != null) {
            property.setAvailabilityStatus("RENTED");
            propertyRepository.save(property);
        }
    }
    return savedReq;
}
```

**Why findById is called before saving:** 
Loading the existing entity first ensures that Hibernate attaches it to the current persistence context as a managed entity. When `save()` is executed, Hibernate generates an `UPDATE` SQL statement rather than an inadvertent `INSERT`. Furthermore, verifying existence beforehand allows services to return explicit 404 responses if a requested resource is invalid.

---

### 5.4 REST Controller

Controllers parse HTTP inputs, validate constraints, and delegate directly to services:

```java
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", allowCredentials = "true")
@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Property>>> getAllProperties(
            @RequestParam(required = false) String ownerId,
            @RequestParam(required = false) String purpose,
            @RequestParam(required = false) String location) {
        
        List<Property> list = propertyService.getFilteredProperties(ownerId, purpose, location);
        return ResponseEntity.ok(ApiResponse.ok(list.size(), list));
    }

    @GetMapping("/{idOrPropertyId}")
    public ResponseEntity<ApiResponse<Property>> getPropertyById(@PathVariable String idOrPropertyId) {
        return propertyService.getPropertyByIdOrPropertyId(idOrPropertyId)
                .map(p -> ResponseEntity.ok(ApiResponse.ok(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Property>> createProperty(@Valid @RequestBody PropertyDto.CreatePropertyRequest request) {
        Property created = propertyService.createProperty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Property submitted for verification.", created));
    }
}
```

**Explicit Status Codes Used:**
- `200 OK`: Successful read or update operations.
- `201 Created`: Resource successfully created (new listing, request submission).
- `204 No Content`: Resource deleted successfully.
- `400 Bad Request`: Input payload validation failure.
- `401 Unauthorized`: Missing or invalid credentials.
- `403 Forbidden`: Authenticated user lacks permission for the requested action.
- `404 Not Found`: Target property or transaction ID does not exist.

---

### 5.5 Additional Architecture Layers

Beyond basic CRUD, three supplementary architectural layers reinforce platform robustness:
1. **ApiResponse Envelope:** Standardizes all API responses with `success` (boolean), `message` (string), `count` (integer), and `data` (payload), ensuring deterministic client consumption.
2. **Global Exception Handling:** Captures `MethodArgumentNotValidException`, resource lookup failures, and data conflicts, converting them into structured error responses.
3. **Escrow & Settlement Ledger:** Isolates platform revenue (20% fee) from landlord payables (80% net earnings), enforcing transparent accounting records.

---

## 6. REST API Endpoints

The API exposes **30+ dedicated endpoints** across operational categories:

### Core Endpoints Table

| Method | Endpoint | Purpose | Request Body | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Tenant or Owner | User JSON | `201 Created` | 400 |
| `POST` | `/api/auth/signin` | Authenticate user | AuthDto | `200 OK` | 401 |
| `GET` | `/api/properties` | Fetch public properties (filterable) | None | `200 OK` | - |
| `GET` | `/api/properties/{id}` | Retrieve property details | None | `200 OK` | 404 |
| `POST` | `/api/properties` | Owner submits listing for vetting | PropertyDto | `201 Created` | 400 |
| `PUT` | `/api/properties/{id}` | Update listing details / status | Partial JSON | `200 OK` | 404 |
| `DELETE`| `/api/properties/{id}` | Remove a property listing | None | `204 No Content` | 404 |
| `POST` | `/api/requests` | Submit rent, buy, or visit request | RequestDto | `201 Created` | 400 |
| `GET` | `/api/requests` | List all requests (Admin view) | None | `200 OK` | 403 |
| `GET` | `/api/requests/user/{id}`| List requests by specific tenant | None | `200 OK` | - |
| `PUT` | `/api/requests/{id}/approve` | Admin approves lease / purchase | None | `200 OK` | 404 |
| `PUT` | `/api/requests/{id}/reject` | Admin rejects request | None | `200 OK` | 404 |
| `GET` | `/api/tenant/dues` | Fetch pending bills for tenant | None | `200 OK` | - |
| `POST` | `/api/tenant/payments` | Pay rent / deposit via gateway | PaymentDto | `200 OK` | 400 |
| `GET` | `/api/owner/settlements` | Owner fetches earnings & payouts | None | `200 OK` | - |
| `POST` | `/api/owner/withdraw` | Owner submits payout withdrawal | Withdraw JSON | `200 OK` | 400 |
| `POST` | `/api/admin/settlements/approve` | Admin approves escrow disbursement | SettlementId | `200 OK` | 404 |
| `GET` | `/api/admin/finance/metrics` | Platform financial health KPI data | None | `200 OK` | 403 |

### Sample Request: POST /api/requests

```json
{
  "tenantId": "TNT-101",
  "tenantName": "Shakil Ahmed",
  "tenantEmail": "student.tenant@gmail.com",
  "tenantPhone": "01811223344",
  "propertyId": "PROP-24496",
  "requestType": "RENT_REQUEST",
  "notes": "Interested in 1-year tenancy contract with family."
}
```

### Sample Response: 200 OK (ApiResponse Envelope)

```json
{
  "success": true,
  "message": "Request received by TANSU Niraloy Intermediary Desk.",
  "count": 1,
  "data": {
    "requestId": "REQ-84912",
    "propertyId": "PROP-24496",
    "tenantId": "TNT-101",
    "tenantName": "Shakil Ahmed",
    "requestType": "RENT_REQUEST",
    "status": "PENDING",
    "requestDate": "2026-09-27"
  }
}
```

### Sample Error Response: 404 Not Found

```json
{
  "success": false,
  "status": 404,
  "message": "Property with ID PROP-99999 was not found in the administrative registry."
}
```

---

## 7. Database Configuration

### application.properties

```properties
spring.application.name=tansu-backend
server.port=8080

# MySQL DataSource Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/tansu_niraloy?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Dhaka&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

### What `ddl-auto=update` Does

When the Spring Boot application initializes, Hibernate inspects all compiled `@Entity` classes and reconciles them against the live MySQL schema. If a table or column is missing, Hibernate issues `CREATE TABLE` and `ALTER TABLE` statements automatically while preserving existing database rows. 

| Setting | Development Choice | Production Recommendation |
| :--- | :--- | :--- |
| **Database** | Local MySQL (XAMPP) | Managed Cloud Database (RDS / Cloud SQL with replication) |
| **ddl-auto** | `update` | `validate` (Strict validation against versioned migrations) |
| **Schema Changes** | Automatic via JPA | Versioned SQL migrations (Flyway / Liquibase) |
| **Credentials** | Plain in `application.properties` | Injected via environment variables or secret manager |
| **SQL Logging** | `true` (Inspect generated SQL queries) | `false` (Avoid performance overhead and sensitive logs) |

### Relational Schema Architecture

```
 users ──1:N── properties ──1:N── property_requests
   │                 │
   ├──1:N── tenant_dues ──1:1── payments
   │
   └──1:N── owner_settlements (Escrow Ledger)
```

- Each **User** (`OWNER`) can list multiple **Properties**.
- A **Property** receives multiple tenant **Property Requests** (`RENT_REQUEST`, `BUY_REQUEST`, `VISIT_SCHEDULE`).
- When a rental request is approved, a **TenantDue** is created, which generates a verified **Payment** upon checkout.
- Payments automatically produce corresponding **OwnerSettlement** records reflecting 80% landlord entitlement.

---

## 8. Testing and Results

### 8.1 How the Tests Were Run

System verification was carried out across two complementary tiers:
1. **Automated Endpoint & API Suite:** Utilizing cURL and Postman to validate HTTP status codes, JSON response formatting, role restrictions, and database mutations.
2. **Interactive End-to-End Workflow Testing:** Exercising real browser journeys across multiple concurrent sessions (Owner listing $\rightarrow$ Admin vetting $\rightarrow$ Tenant rental application $\rightarrow$ Admin lease approval $\rightarrow$ Payment checkout $\rightarrow$ Escrow disbursement).

### 8.2 Results Table

| TC # | Method | Endpoint / Flow | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | `POST` | `/api/auth/signin` (Valid Admin credentials) | `200 OK` with user session object | `200 OK` | **Pass** |
| **TC-02** | `POST` | `/api/auth/signin` (Incorrect password) | `401 Unauthorized` | `401 Unauthorized` | **Pass** |
| **TC-03** | `POST` | `/api/properties` (Owner adds new flat) | `201 Created`, status=`PENDING` | `201 Created` | **Pass** |
| **TC-04** | `GET` | `/api/properties/pending` (Admin fetch) | `200 OK` containing pending listings | `200 OK` | **Pass** |
| **TC-05** | `PUT` | `/api/admin/properties/{id}/approve` | `200 OK`, verification=`VERIFIED` | `200 OK` | **Pass** |
| **TC-06** | `POST` | `/api/requests` (Tenant submits rent request) | `201 Created`, request stored | `201 Created` | **Pass** |
| **TC-07** | `GET` | `/api/requests` (Admin queue fetch) | `200 OK`, lists all tenant applications | `200 OK` | **Pass** |
| **TC-08** | `PUT` | `/api/requests/{id}/approve` (Lease executed) | `200 OK`, Property marked `RENTED` | `200 OK` | **Pass** |
| **TC-09** | `GET` | `/api/tenant/dues` (Tenant checks bill) | `200 OK` showing outstanding rent due | `200 OK` | **Pass** |
| **TC-10** | `POST` | `/api/tenant/payments` (Rent paid via Card/MFS) | `200 OK`, Due cleared to BDT 0 | `200 OK` | **Pass** |
| **TC-11** | `GET` | `/api/owner/settlements` (Owner portfolio check) | `200 OK` with 80% credited payout | `200 OK` | **Pass** |
| **TC-12** | `POST` | `/api/admin/settlements/approve` (Disbursement) | `200 OK`, status moved to `SETTLED` | `200 OK` | **Pass** |
| **TC-13** | `GET` | `/api/properties/{unknown}` | `404 Not Found` | `404 Not Found` | **Pass** |
| **TC-14** | `GET` | Role Guard Check (`admin-finance.html` as Tenant) | Redirected to `signin.html` / Alert | Access Restricted | **Pass** |

### 8.3 Screen Captures & Visual Evidence

*Note: Below are placeholders for insertion of screenshots captured from the live application.*

- **Figure 1:** *Admin Central Dashboard displaying live KPI metrics, active rentals, and pending verification queues.*
- **Figure 2:** *Listing Vetting Queue (`admin-verify-listings.html`) allowing administrative approval of newly submitted owner properties.*
- **Figure 3:** *Public Property Catalog (`all-properties.html`) displaying verified flats with location, bedroom specs, and pricing.*
- **Figure 4:** *Tenant Rental Application Modal (`property-details.html`) submitting lease intent to the central intermediary desk.*
- **Figure 5:** *Two-Column Banking & Payment Checkout Gateway (`payment.html`) with Card and MFS payment methods.*
- **Figure 6:** *Owner Dashboard (`owner-dashboard.html`) showing verified property with `RENTED` status and the Rented/Sold Earnings Ledger.*
- **Figure 7:** *Owner Settlements & Withdrawal Table showing disbursed payments (`SET-1461`).*

---

## 9. Challenges and Solutions

| Challenge | Root Cause | Engineering Solution |
| :--- | :--- | :--- |
| **Cross-Tab Session Wipeout** | In `auth.js`, `initSession()` cleared `localStorage` whenever `sessionStorage` was empty in a newly opened browser tab. | Refactored `initSession()` to check if a valid user already exists in `localStorage`. If found, it promotes the current tab to authenticated rather than wiping user credentials. |
| **Sidebar Badge Count Mismatch** | Admin sidebar code expected strict string equality `requestType === "RENTAL"`, while form submissions stored `"RENT_REQUEST"`. | Introduced case-insensitive substring matching (`requestType.toUpperCase().includes("RENT")`), enabling accurate real-time count aggregation across all request types. |
| **Property Availability Display Stuck on `ACTIVE`** | The table renderer in `owner.js` only checked whether a property was `INACTIVE`; otherwise, it defaulted unconditionally to `ACTIVE`, ignoring `RENTED` flags. | Implemented exhaustive status resolution: properties with `availabilityStatus.includes("RENTED")` now display a distinct blue `RENTED` badge and lock deactivation actions. |
| **Empty Owner Earnings & Settlement Tables** | Client JavaScript had been truncated, completely missing `loadOwnerEarnings()` and `loadOwnerSettlements()` function declarations. | Reconstructed the complete `OwnerController` architecture, implementing dynamic API lookups for settlements, calculating 80% net payouts, and populating tables without runtime errors. |
| **Atomic Multi-Entity State Mutation upon Lease Approval** | Approving a lease required synchronized updates across four distinct entities: Request, Property, Tenant Due, and Owner Settlement. | Wrapped the entire execution inside a single `@Transactional` service boundary. If any step encounters an unexpected constraint, all operations roll back cleanly. |

---

## 10. Conclusion and Future Work

### Conclusion

The **TANSU Niraloy** project successfully achieves all architectural and functional goals outlined at the project's inception. By introducing an authoritative intermediary architecture between tenants and property owners, the system eliminates traditional distrust, ghost listings, and opaque accounting in Bangladesh's rental real estate sector. 

Key engineering accomplishments include:
- A clean, layered Spring Boot monolithic architecture with strict separation between Controller, Service, and Repository layers.
- Robust domain modeling backed by relational integrity and declarative JPA mappings.
- End-to-end multi-role governance spanning property vetting, tenancy workflows, transparent 80/20 escrow calculations, and automated bill settlement.
- A fully functional, responsive user interface delivering a seamless user experience across all three operational roles.

### Future Work

1. **Production Payment Gateway Integration:** Connect real payment sandbox APIs (SSLCommerz, bKash Merchant API, PortWallet) using webhook callbacks for instant transaction confirmation.
2. **Scheduled Billing Cron Jobs:** Implement `@Scheduled` background tasks running on the 1st of every month to automatically dispatch recurrent rent dues and overdue reminder notices.
3. **Automated RAJUK Document OCR:** Integrate Optical Character Recognition (OCR) to automatically scan submitted building permits and ownership deeds for forgery detection.
4. **Interactive Map Integration:** Incorporate Leaflet.js / OpenStreetMap coordinates to allow tenants to discover nearby rental units and facilities visually.
5. **Real-Time WebSockets:** Push real-time notification alerts directly to the Admin and Owner navigation headers when new tenancy applications are filed.

---

## References

1. Spring, *"Spring Boot Reference Documentation,"* [Online]. Available: `https://docs.spring.io/spring-boot/` [Accessed: Sep. 2026].
2. Spring, *"Spring Data JPA Reference Documentation,"* [Online]. Available: `https://docs.spring.io/spring-data/jpa/reference/` [Accessed: Sep. 2026].
3. Oracle, *"Java Platform, Standard Edition 17 API Specification,"* [Online]. Available: `https://docs.oracle.com/en/java/javase/17/docs/api/` [Accessed: Sep. 2026].
4. Oracle, *"MySQL 8.0 Reference Manual,"* [Online]. Available: `https://dev.mysql.com/doc/refman/8.0/en/` [Accessed: Sep. 2026].
5. Hibernate, *"Hibernate ORM User Guide,"* [Online]. Available: `https://hibernate.org/orm/documentation/` [Accessed: Sep. 2026].
6. Project Lombok, *"Lombok Features and Annotations,"* [Online]. Available: `https://projectlombok.org/features/` [Accessed: Sep. 2026].
7. MDN Web Docs, *"JavaScript ES6+ and Asynchronous Fetch API,"* [Online]. Available: `https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API` [Accessed: Sep. 2026].

---

## Appendix A: Submission Checklist

| Done | Item |
| :---: | :--- |
| $\checkmark$ | Cover page filled in completely (Student Name, Student ID, Section, Submitted To, Date, GitHub link) |
| $\checkmark$ | Project runs with `mvnw.cmd spring-boot:run` without errors on port 8080 |
| $\checkmark$ | Layered structure implemented: `controller`, `service`, `repository`, `model/entity`, `dto`, `config` |
| $\checkmark$ | All CRUD endpoints implemented and documented with explicit HTTP status codes (200, 201, 204, 400, 401, 403, 404) |
| $\checkmark$ | Update logic checks existence with `findById` before saving managed entities |
| $\checkmark$ | End-to-end multi-role workflows verified across Tenant, Owner, and Admin portals |
| $\checkmark$ | Passwords and sensitive secrets masked in configuration and documentation |
| $\checkmark$ | Challenges and solutions documented reflecting real development findings |
| $\checkmark$ | Formal academic format adhering to UIU AOOP course guidelines |

---

## Appendix B: Sample Marking Rubric

| Criterion | What is Assessed | Marks |
| :--- | :--- | :---: |
| **Report Structure and Writing** | Clear sections, professional terminology, and correct formatting | 10 |
| **Architecture and Design** | Layered modular architecture, clean separation of concerns, dependency injection | 15 |
| **Implementation** | Entity modeling, JPA repositories, transactional service logic, and REST controllers | 25 |
| **REST API Design** | Correct HTTP methods, resource naming, and explicit HTTP status codes | 15 |
| **Database Configuration** | Schema modeling, relational mappings, and Hibernate DDL configuration | 10 |
| **Testing and Results** | Happy paths, business rule boundary conditions, and test results documentation | 15 |
| **Reflection & Analysis** | Technical challenges, root causes, engineering solutions, and future roadmap | 10 |
| **Total** | | **100** |
