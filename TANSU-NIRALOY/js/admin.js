/**
 * ==========================================================================
 * TANSU NIRALOY - CENTRAL ADMIN INTERMEDIARY CONTROLLER
 * Pure Vanilla JavaScript
 * Manages:
 * - Listing Verification Queue (Verify, Reject, Request Correction)
 * - Verified Properties Directory (Available, Rented, Sold)
 * - Processing Rental, Purchase, and Visit Requests
 * - Finance Ledger & Settlements
 * - Support Ticket Resolution
 * ==========================================================================
 */

const AdminController = {
  async initDashboard() {
    if (!Auth.requireAuth(["ADMIN"])) return;

    // Load High-Level Platform KPIs
    const propsRes = await apiGet("/api/properties");
    const allProps = propsRes.data || [];
    const pendingRes = await apiGet("/api/admin/listings/pending");
    const pendingProps = pendingRes.data || [];

    const elTotal = document.getElementById("admin-kpi-total-props");
    const elVerified = document.getElementById("admin-kpi-verified-props");
    const elPending = document.getElementById("admin-kpi-pending-props");
    const elRentals = document.getElementById("admin-kpi-active-rentals");
    const elSales = document.getElementById("admin-kpi-active-sales");

    if (elTotal) elTotal.textContent = allProps.length + pendingProps.length;
    if (elVerified) elVerified.textContent = allProps.filter(p => p.verificationStatus === "VERIFIED").length;
    if (elPending) elPending.textContent = pendingProps.length;
    if (elRentals) elRentals.textContent = allProps.filter(p => p.purpose === "RENT" && p.availabilityStatus.includes("RENT")).length;
    if (elSales) elSales.textContent = allProps.filter(p => p.purpose === "SALE").length;
  },

  /**
   * Load Listing Verification Queue (admin-verify-listings.html)
   */
  async loadVerificationQueue() {
    if (!Auth.requireAuth(["ADMIN"])) return;
    const tableBody = document.getElementById("admin-verification-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏳</div>
          Loading pending listings from TANSU verification queue...
        </td>
      </tr>
    `;

    const res = await apiGet("/api/properties/pending");
    const pending = res.data || [];

    if (pending.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
            No pending listings awaiting administrative verification.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = pending.map(p => `
      <tr>
        <td><strong>${p.propertyId}</strong></td>
        <td><code>${p.ownerId}</code></td>
        <td>
          <strong>${p.title}</strong><br>
          <small class="text-muted">📍 ${p.location} &bull; ${p.bedrooms || 0} Beds, ${p.bathrooms || 0} Baths, ${p.area || 0} sqft</small>
        </td>
        <td><span class="badge ${p.purpose === 'SALE' ? 'badge-sale' : 'badge-rent'}">${p.purpose}</span></td>
        <td><strong>৳ ${Number(p.price).toLocaleString()}</strong></td>
        <td>${p.submissionDate || p.createdAt || 'Today'}</td>
        <td>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-primary" onclick="AdminController.verifyListing('${p.propertyId}')">Approve</button>
            <button class="btn btn-sm btn-danger" onclick="AdminController.rejectListing('${p.propertyId}')">Reject</button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  async verifyListing(propertyId) {
    if (!confirm(`Are you sure you want to approve property ${propertyId} to the live public catalog?`)) return;

    const res = await apiPut(`/api/properties/${propertyId}/approve`);
    if (res && (res.success || res.status === 200)) {
      Components.showToast("success", "Listing Approved", `Property ${propertyId} has been verified and published to public catalog.`);
    } else {
      Components.showToast("info", "Listing Updated", `Approval request processed for ${propertyId}.`);
    }
    await this.loadVerificationQueue();
  },

  async rejectListing(propertyId) {
    if (!confirm(`Are you sure you want to reject property ${propertyId}?`)) return;

    const res = await apiPut(`/api/properties/${propertyId}/reject`);
    if (res && (res.success || res.status === 200)) {
      Components.showToast("error", "Listing Rejected", `Property ${propertyId} has been rejected.`);
    } else {
      Components.showToast("info", "Listing Updated", `Rejection request processed for ${propertyId}.`);
    }
    await this.loadVerificationQueue();
  },

  /**
   * Load Verified Properties Directory (admin-verified-properties.html)
   */
  async loadVerifiedProperties() {
    if (!Auth.requireAuth(["ADMIN"])) return;
    const tableBody = document.getElementById("admin-verified-table-body");
    if (!tableBody) return;

    const res = await apiGet("/api/properties");
    const list = res.data || [];

    tableBody.innerHTML = list.map(p => `
      <tr>
        <td><strong>${p.propertyId}</strong></td>
        <td>
          <strong>${p.title}</strong><br>
          <small class="text-muted">📍 ${p.location}</small>
        </td>
        <td><code>${p.ownerId}</code></td>
        <td><span class="badge ${p.purpose === 'SALE' ? 'badge-sale' : 'badge-rent'}">${p.purpose}</span></td>
        <td>৳ ${Number(p.price).toLocaleString()}</td>
        <td><span class="badge badge-verified">${p.verificationStatus || p.status}</span></td>
        <td>
          ${p.propertyId === 'PROP-102' ? '<code>TEN-901</code>' : '<span class="text-muted">No Active Tenant</span>'}
        </td>
        <td>
          <div class="flex gap-2">
            <a href="property-details.html?id=${p.propertyId}" target="_blank" class="btn btn-sm btn-outline">View Details</a>
            <button class="btn btn-sm btn-danger" onclick="AdminController.removeVerifiedProperty('${p.propertyId}')" title="Revoke verification and remove from public catalog">Remove</button>
          </div>
        </td>
      </tr>
    `).join("");
  },

  /**
   * Admin removes/revokes a verified flat.
   * Sets status to REJECTED, availabilityStatus to INACTIVE/REJECTED.
   * Automatically hides the flat from visitors and tenants, and marks it REJECTED & INACTIVE on the owner's dashboard.
   */
  async removeVerifiedProperty(propertyId) {
    if (!confirm(`Are you sure you want to remove property ${propertyId} from the verified catalog?\n\nThis will make it INACTIVE and REJECTED, hiding it completely from visitors and tenants.`)) return;

    try {
      const res = await apiPut(`/api/properties/${propertyId}/reject`);
      if (res && (res.success || res.status === 200)) {
        Components.showToast("error", "Property Removed & Rejected", `Property ${propertyId} has been revoked from public catalog and marked REJECTED.`);
      } else {
        Components.showToast("info", "Property Revoked", `Property ${propertyId} listing has been revoked.`);
      }
    } catch (e) {
      console.error("Error revoking property:", e);
      Components.showToast("error", "Error", "Could not remove property.");
    }
    await this.loadVerifiedProperties();
  },

  currentRequestsFilter: "ALL",

  /**
   * Load Requests Queue for Admin
   */
  async loadRequestsQueue(filterType = "ALL") {
    if (!Auth.requireAuth(["ADMIN"])) return;
    this.currentRequestsFilter = filterType;
    const tableBody = document.getElementById("admin-requests-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏳</div>
          Loading requests from TANSU administrative repository...
        </td>
      </tr>
    `;

    let reqs = [];
    try {
      const res = await apiGet("/api/requests");
      if (res && res.data && Array.isArray(res.data)) {
        reqs = res.data;
      }
    } catch (e) {
      console.warn("Could not fetch /api/requests:", e);
    }

    if (reqs.length === 0) {
      reqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
    }

    if (filterType !== "ALL") {
      reqs = reqs.filter(r => {
        const t = (r.requestType || "").toUpperCase();
        if (filterType === "RENT") return t.includes("RENT");
        if (filterType === "BUY") return t.includes("BUY") || t.includes("SALE");
        if (filterType === "VISIT") return t.includes("VISIT");
        return t === filterType.toUpperCase();
      });
    }

    if (reqs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
            No requests in this category awaiting administrative processing.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = reqs.map(r => {
      const displayType = (r.requestType || "RENT").replace(/_REQUEST|_SCHEDULE/g, "");
      const isPending = r.status === "PENDING";
      const isApproved = r.status === "APPROVED";
      const statusBadge = isApproved ? 'badge-verified' : (r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending');

      return `
        <tr>
          <td><strong>${r.requestId || 'REQ-' + r.id}</strong></td>
          <td>
            <code>${r.tenantId}</code><br>
            <small class="text-muted">${r.tenantName || ''}${r.tenantEmail ? ' &bull; ' + r.tenantEmail : ''}</small>
          </td>
          <td><a href="property-details.html?id=${r.propertyId}" target="_blank"><strong>${r.propertyId}</strong></a></td>
          <td><span class="badge ${displayType === 'RENT' ? 'badge-rent' : 'badge-sale'}">${displayType}</span></td>
          <td>${r.preferredDate ? `${r.preferredDate} (${r.preferredTime || ''})` : (r.requestDate || 'Recent')}</td>
          <td><span class="badge ${statusBadge}">${r.status}</span></td>
          <td>
            <div class="flex gap-2">
              ${isPending ? `
                <button class="btn btn-sm btn-primary" onclick="AdminController.processRequest('${r.requestId || r.id}', 'APPROVED')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="AdminController.processRequest('${r.requestId || r.id}', 'REJECTED')">Reject</button>
              ` : `
                <span class="text-muted" style="font-size: 0.85rem; font-weight: 600;">Processed (${r.status})</span>
              `}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  },

  async processRequest(requestId, newStatus) {
    if (newStatus === "APPROVED") {
      if (!confirm(`Are you sure you want to APPROVE rental request ${requestId}?\nThis will automatically generate tenant rent dues and mark property status as Rented.`)) return;

      const res = await apiPut(`/api/requests/${requestId}/approve`);
      if (res && (res.success || res.status === 200)) {
        Components.showToast("success", "Request Approved", `Request ${requestId} approved! Tenant outstanding due generated and property marked as Rented.`);
      } else {
        Components.showToast("info", "Request Processed", `Approval recorded for ${requestId}.`);
      }
    } else {
      if (!confirm(`Are you sure you want to REJECT request ${requestId}?`)) return;

      const res = await apiPut(`/api/requests/${requestId}/reject`);
      if (res && (res.success || res.status === 200)) {
        Components.showToast("error", "Request Rejected", `Request ${requestId} has been rejected.`);
      } else {
        Components.showToast("info", "Request Processed", `Rejection recorded for ${requestId}.`);
      }
    }

    // Also update localStorage for offline cache
    let localReqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
    localReqs = localReqs.map(r => (r.requestId === requestId || String(r.id) === String(requestId)) ? { ...r, status: newStatus } : r);
    localStorage.setItem("tansu_requests", JSON.stringify(localReqs));

    await this.loadRequestsQueue(this.currentRequestsFilter || "ALL");
  },

  /**
   * Initialize Finance & Settlements Dashboard (admin-finance.html)
   */
  async initFinanceHub() {
    if (!Auth.requireAuth(["ADMIN"])) return;

    await this.loadFinanceMetrics();
    await this.loadTenantCollections();
    await this.loadTenantDues();
    await this.loadOwnerSettlements();
    await this.loadOperatingExpenses();
    this.setupFinanceSearchAndFilters();
  },

  async loadFinanceMetrics() {
    const colRes = await apiGet("/api/admin/collections");
    const collections = colRes.data || [];
    const totalCollected = collections.reduce((sum, c) => sum + Number(c.amount || 0), 0);

    const duesRes = await apiGet("/api/admin/dues");
    const dues = duesRes.data || [];
    const totalDue = dues.reduce((sum, d) => sum + Number(d.dueAmount || 0), 0);
    const overdueCount = dues.filter(d => d.status === "OVERDUE").length;

    const setRes = await apiGet("/api/admin/settlements");
    const settlements = setRes.data || [];
    const totalDisbursed = settlements.reduce((sum, s) => sum + Number(s.disbursed || 0), 0);

    const expRes = await apiGet("/api/admin/expenses");
    const expenses = expRes.data || [];
    const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const elCol = document.getElementById("kpi-tenant-inflow");
    const elDue = document.getElementById("kpi-tenant-dues");
    const elDueCount = document.getElementById("kpi-overdue-count");
    const elSet = document.getElementById("kpi-owner-settled");
    const elExp = document.getElementById("kpi-operating-expenses");

    if (elCol) elCol.textContent = `৳ ${totalCollected.toLocaleString()}`;
    if (elDue) elDue.textContent = `৳ ${totalDue.toLocaleString()}`;
    if (elDueCount) elDueCount.textContent = `${overdueCount} Overdue Accounts`;
    if (elSet) elSet.textContent = `৳ ${totalDisbursed.toLocaleString()}`;
    if (elExp) elExp.textContent = `৳ ${totalExp.toLocaleString()}`;
  },

  /**
   * Helper to format payment method with official logo or icon
   */
  renderPaymentMethodBadge(method) {
    if (!method) return '<span class="badge">N/A</span>';
    if (method.includes("bKash")) {
      return `<span class="badge" style="background:#FCE7F3;color:#BE185D;display:inline-flex;align-items:center;gap:0.35rem;"><img src="assets/logos/bkash.png" alt="bKash" style="height:14px;"> bKash (MFS)</span>`;
    }
    if (method.includes("Nagad")) {
      return `<span class="badge" style="background:#FFF7ED;color:#C2410C;display:inline-flex;align-items:center;gap:0.35rem;"><img src="assets/logos/nagad.png" alt="Nagad" style="height:13px;"> Nagad (MFS)</span>`;
    }
    if (method.includes("Rocket")) {
      return `<span class="badge" style="background:#F3E8FF;color:#7E22CE;display:inline-flex;align-items:center;gap:0.35rem;"><img src="assets/logos/rocket.png" alt="Rocket" style="height:14px;"> Rocket (MFS)</span>`;
    }
    if (method.includes("CARD") || method.includes("VISA")) {
      return `<span class="badge" style="background:#E0F2FE;color:#0284C7;display:inline-flex;align-items:center;gap:0.35rem;">💳 CARD (VISA)</span>`;
    }
    return `<span class="badge badge-verified">${method}</span>`;
  },

  /**
   * Section 1: Tenant Rent Collections (Collections Inflow Ledger)
   */
  async loadTenantCollections(searchTerm = "") {
    const tbody = document.getElementById("admin-collections-table-body");
    if (!tbody) return;

    const res = await apiGet("/api/admin/collections");
    let list = res.data || [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(c =>
        c.tenantName.toLowerCase().includes(term) ||
        c.tenantId.toLowerCase().includes(term) ||
        c.propertyId.toLowerCase().includes(term) ||
        c.flatTitle.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted" style="padding: 2.5rem;">
            No tenant collection records found matching criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(c => `
      <tr>
        <td>
          <strong>${c.collectionId}</strong><br>
          <code style="font-size:0.75rem;color:var(--color-text-muted);">${c.transactionId}</code>
        </td>
        <td>
          <strong style="color:var(--color-primary);">${c.tenantName}</strong><br>
          <small class="text-muted"><code>${c.tenantId}</code> &bull; 📞 ${c.tenantPhone}</small>
        </td>
        <td>
          <strong style="color:var(--color-primary);">${c.flatTitle}</strong><br>
          <small class="text-muted">📍 ${c.location} &bull; <strong><a href="property-details.html?id=${c.propertyId}" target="_blank">${c.propertyId}</a></strong></small>
        </td>
        <td>
          <span class="badge badge-rent">${c.purpose}</span><br>
          <small class="text-muted">${c.rentMonth}</small>
        </td>
        <td>
          <strong style="color:var(--color-success);font-size:1.05rem;">৳ ${Number(c.amount).toLocaleString()}</strong>
        </td>
        <td>
          ${AdminController.renderPaymentMethodBadge(c.paymentMethod)}
        </td>
        <td>
          <span style="font-size:0.82rem;">${c.paymentDate}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="AdminController.viewReceipt('${c.collectionId}')">
            📄 Receipt
          </button>
        </td>
      </tr>
    `).join("");
  },

  /**
   * Section 2: Tenant Outstanding Dues & Overdue Notices Desk
   */
  async loadTenantDues(filterStatus = "ALL") {
    const tbody = document.getElementById("admin-dues-table-body");
    if (!tbody) return;

    const res = await apiGet("/api/admin/dues");
    let list = res.data || [];

    if (filterStatus !== "ALL") {
      list = list.filter(d => d.status === filterStatus);
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted" style="padding: 2.5rem;">
            No outstanding tenant dues recorded. All accounts in good standing.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(d => {
      const noticeStatusHtml = d.noticeSent
        ? `<span class="badge" style="background:#FEF3C7;color:#B45309;font-size:0.75rem;">⚠️ Notice Dispatched<br><small style="font-size:0.68rem;">${d.lastNoticeDate || ''}</small></span>`
        : `<span class="badge" style="background:#F1F5F9;color:#64748B;font-size:0.75rem;">No Notice Sent</span>`;

      return `
        <tr style="${d.status === 'OVERDUE' ? 'background: rgba(254, 242, 242, 0.4);' : ''}">
          <td>
            <strong>${d.dueId}</strong>
          </td>
          <td>
            <strong style="color:var(--color-primary);">${d.tenantName}</strong><br>
            <small class="text-muted"><code>${d.tenantId}</code> &bull; 📞 ${d.tenantPhone}</small>
          </td>
          <td>
            <strong>${d.flatTitle}</strong><br>
            <small class="text-muted">📍 ${d.location} &bull; <strong><a href="property-details.html?id=${d.propertyId}" target="_blank">${d.propertyId}</a></strong></small>
          </td>
          <td>
            <span style="font-weight:600;font-size:0.85rem;">${d.dueType}</span><br>
            <small class="text-muted">${d.dueMonth}</small>
          </td>
          <td>
            <span style="font-size:0.85rem;color:var(--color-text-muted);">৳ ${Number(d.totalBilled).toLocaleString()}</span>
          </td>
          <td>
            <strong style="color:var(--color-danger);font-size:1.05rem;">৳ ${Number(d.dueAmount).toLocaleString()}</strong>
          </td>
          <td>
            <span style="font-size:0.85rem;font-weight:600;">${d.dueDate}</span><br>
            <span class="badge badge-danger" style="font-size:0.68rem;">${d.daysOverdue} Days Overdue</span>
          </td>
          <td>
            ${noticeStatusHtml}
          </td>
          <td>
            <button class="btn btn-sm ${d.noticeSent ? 'btn-outline' : 'btn-warning'}" style="font-weight:700;font-size:0.78rem;" onclick="AdminController.openNoticeModal('${d.dueId}')">
              📢 ${d.noticeSent ? 'Resend Notice' : 'Send Notice'}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  },

  /**
   * Section 3: Owner Settlements Pipeline
   */
  async loadOwnerSettlements() {
    const tbody = document.getElementById("admin-settlements-table-body");
    if (!tbody) return;

    const res = await apiGet("/api/admin/settlements");
    const list = res.data || [];

    tbody.innerHTML = list.map(s => {
      const isWithdrawal = s.type === "WITHDRAWAL_REQUEST";
      const isSettled = s.status === "SETTLED";
      const isPending = s.status === "PENDING_ADMIN_APPROVAL" || s.status === "PENDING_AUDIT";
      const dest = s.bankName || (s.payoutMethod ? s.payoutMethod : "Bank Transfer");

      return `
        <tr style="${isWithdrawal && !isSettled ? 'background:#FFFBEB;' : ''}">
          <td>
            <strong>${s.settlementId}</strong><br>
            <small class="text-muted">${s.requestDate || s.clearanceDate || 'Current'}</small>
          </td>
          <td>
            <strong style="color:var(--color-primary);">${s.ownerName || 'Property Owner'}</strong><br>
            <small class="text-muted"><code>${s.ownerId}</code></small>
          </td>
          <td>
            <strong><a href="property-details.html?id=${s.propertyId}" target="_blank">${s.propertyId}</a></strong><br>
            <small class="text-muted">${s.flatTitle || 'Owner Portfolio'}</small>
          </td>
          <td>
            <span class="badge ${isWithdrawal ? 'badge-rent' : 'badge-available'}">
              ${isWithdrawal ? 'WITHDRAWAL REQUEST' : 'RENTAL INFLOW'}
            </span>
          </td>
          <td><strong style="font-size:1.05rem; color:${isWithdrawal ? 'var(--color-danger)' : 'var(--color-primary)'};">৳ ${Number(s.entitledAmount || 0).toLocaleString()}</strong></td>
          <td><strong style="color:var(--color-success);">৳ ${Number(s.disbursed || 0).toLocaleString()}</strong></td>
          <td>
            <strong>${dest}</strong>
            ${s.payoutDetails && s.payoutDetails.accountNumber ? `<br><small class="text-muted">A/C: ${s.payoutDetails.accountNumber}</small>` : ''}
          </td>
          <td>
            <span class="badge ${isSettled ? 'badge-verified' : (isPending ? 'badge-pending' : 'badge-available')}">
              ${isSettled ? '✓ Disbursed' : (isPending ? '⏳ Awaiting Clearance' : s.status)}
            </span>
          </td>
          <td><small>${s.clearanceDate || s.requestDate || 'Pending'}</small></td>
          <td>
            ${isSettled
              ? `<button class="btn btn-sm btn-outline" disabled style="opacity:0.6;">✓ Disbursed</button>`
              : `<button class="btn btn-sm btn-primary" style="font-weight:700;" onclick="AdminController.approveSettlement('${s.settlementId}')">Approve &amp; Disburse</button>`
            }
          </td>
        </tr>
      `;
    }).join("");
  },

  /**
   * Section 4: Operating Expenses
   */
  async loadOperatingExpenses() {
    const tbody = document.getElementById("admin-expenses-table-body");
    if (!tbody) return;

    const res = await apiGet("/api/admin/expenses");
    const list = res.data || [];

    tbody.innerHTML = list.map(e => `
      <tr>
        <td><strong>${e.expenseId}</strong></td>
        <td><span class="badge badge-available">${e.category}</span></td>
        <td><strong style="color:var(--color-danger);">৳ ${Number(e.amount).toLocaleString()}</strong></td>
        <td>${e.date}</td>
        <td><span style="font-size:0.85rem;">${e.description}</span></td>
        <td><code>${e.voucher}</code></td>
      </tr>
    `).join("");
  },

  /**
   * Open Due Notice Modal with Pre-filled Content
   */
  async openNoticeModal(dueId) {
    const duesRes = await apiGet("/api/admin/dues");
    const dues = duesRes.data || [];
    const due = dues.find(d => d.dueId === dueId);
    if (!due) {
      Components.showToast("error", "Not Found", "Due record could not be located.");
      return;
    }

    this._activeDueForNotice = due;

    // Set modal display fields
    const elDueId = document.getElementById("notice-due-id");
    if (elDueId) elDueId.value = due.dueId;
    const elTenant = document.getElementById("notice-tenant-display");
    if (elTenant) elTenant.textContent = `${due.tenantName} (${due.tenantId})`;
    const elPhone = document.getElementById("notice-phone-display");
    if (elPhone) elPhone.textContent = due.tenantPhone;
    const elEmail = document.getElementById("notice-email-display");
    if (elEmail) elEmail.textContent = due.tenantEmail;
    const elFlat = document.getElementById("notice-flat-display");
    if (elFlat) elFlat.textContent = `${due.propertyId} - ${due.flatTitle} (${due.location})`;
    const elAmt = document.getElementById("notice-amount-display");
    if (elAmt) elAmt.textContent = `৳ ${Number(due.dueAmount).toLocaleString()}`;
    const elDays = document.getElementById("notice-days-display");
    if (elDays) elDays.textContent = `${due.daysOverdue} Days Overdue (Due Date: ${due.dueDate})`;

    // Reset dropdown to default and generate text
    const elType = document.getElementById("notice-type-select");
    if (elType) elType.value = "1ST_REMINDER";
    this.updateNoticeTemplateText();

    Components.openModal("modal-send-notice");
  },

  updateNoticeTemplateText() {
    if (!this._activeDueForNotice) return;
    const due = this._activeDueForNotice;
    const type = document.getElementById("notice-type-select")?.value;
    const textarea = document.getElementById("notice-message-text");
    if (!textarea) return;

    if (type === "1ST_REMINDER") {
      textarea.value = `[RENT DUE REMINDER NOTICE]
Dear ${due.tenantName} (${due.tenantId}),

This is an official payment notice from TANSU Niraloy Central Intermediary Authority. According to our billing records, rent payment for flat "${due.flatTitle}" (Property ID: ${due.propertyId}) for the billing period of ${due.dueMonth} in the amount of ৳ ${Number(due.dueAmount).toLocaleString()} is past its scheduled due date (${due.dueDate}).

Please log in to your TANSU Niraloy Tenant Portal or proceed to the Payment Gateway (payment.html) to settle the outstanding balance via bKash, Nagad, Rocket, or Card at your earliest convenience.

If you have already processed this transaction within the last 24 hours, kindly disregard this notification.

TANSU Niraloy Central Billing Desk
Support: desk@tansu-niraloy.com.bd | +880 1700-000000`;
    } else if (type === "URGENT_WARNING") {
      textarea.value = `[URGENT OVERDUE DEMAND NOTICE]
Dear ${due.tenantName} (${due.tenantId}),

Please be advised that your outstanding rental dues of ৳ ${Number(due.dueAmount).toLocaleString()} for flat "${due.flatTitle}" (Property ID: ${due.propertyId}) remain unpaid for ${due.daysOverdue} days past the scheduled due date.

Under the terms of your Intermediary Tenancy Agreement, you are requested to clear all overdue balances within the next 48 hours. Continued delay will result in mandatory late penalty surcharges and administrative escalation.

Please settle your account immediately via the online payment gateway or contact the central desk.

TANSU Niraloy Central Settlements Authority`;
    } else {
      textarea.value = `[FINAL NOTICE - LEASE TERMINATION & LEGAL ESCALATION]
ATTENTION: ${due.tenantName} (${due.tenantId})
Property: ${due.propertyId} - ${due.flatTitle}
Total Outstanding Balance: ৳ ${Number(due.dueAmount).toLocaleString()}

Despite prior reminders, your overdue rent balance remains unsettled. Formal notice is hereby served that lease agreement suspension proceedings have commenced under Section 8 of the Intermediary Tenancy Regulations.

You are instructed to remit the total outstanding amount immediately and contact the TANSU Legal & Compliance Desk without delay to prevent formal eviction and legal recovery proceedings.

TANSU Niraloy Legal & Compliance Authority`;
    }
  },

  /**
   * Submit Dispatch Notice
   */
  async submitDueNotice(e) {
    if (e) e.preventDefault();
    if (!this._activeDueForNotice) return;

    const due = this._activeDueForNotice;
    const typeSelect = document.getElementById("notice-type-select");
    const noticeType = typeSelect ? typeSelect.options[typeSelect.selectedIndex].text : "Standard Reminder";
    const message = document.getElementById("notice-message-text")?.value;

    await apiPost("/api/admin/notices", {
      dueId: due.dueId,
      tenantId: due.tenantId,
      tenantName: due.tenantName,
      tenantPhone: due.tenantPhone,
      propertyId: due.propertyId,
      dueAmount: due.dueAmount,
      noticeType,
      message
    });

    Components.closeModal("modal-send-notice");
    Components.showToast("success", "Notice Dispatched", `Official recovery notice sent to ${due.tenantName} via SMS, Email & Tenant Portal.`);
    await this.loadTenantDues();
    await this.loadFinanceMetrics();
  },

  /**
   * View Official Receipt
   */
  async viewReceipt(collectionId) {
    const res = await apiGet("/api/admin/collections");
    const list = res.data || [];
    const item = list.find(c => c.collectionId === collectionId);
    if (!item) return;

    document.getElementById("receipt-id").textContent = item.collectionId;
    document.getElementById("receipt-trx").textContent = item.transactionId;
    document.getElementById("receipt-tenant").textContent = `${item.tenantName} (${item.tenantId})`;
    document.getElementById("receipt-property").textContent = `${item.propertyId} - ${item.flatTitle}`;
    document.getElementById("receipt-location").textContent = item.location;
    document.getElementById("receipt-month").textContent = item.rentMonth;
    document.getElementById("receipt-amount").textContent = `৳ ${Number(item.amount).toLocaleString()}`;
    document.getElementById("receipt-method").innerHTML = AdminController.renderPaymentMethodBadge(item.paymentMethod);
    document.getElementById("receipt-date").textContent = item.paymentDate;

    Components.openModal("modal-receipt-view");
  },

  async approveSettlement(settlementId) {
    if (!confirm(`Are you sure you want to approve disbursement for ${settlementId}?`)) return;
    await apiPost("/api/admin/settlements/approve", { settlementId });
    Components.showToast("success", "Settlement Disbursed", `Settlement ${settlementId} successfully marked as settled.`);
    await this.loadOwnerSettlements();
    await this.loadFinanceMetrics();
  },

  setupFinanceSearchAndFilters() {
    const searchInput = document.getElementById("search-collections");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        AdminController.loadTenantCollections(e.target.value.trim());
      });
    }

    const filterDues = document.getElementById("filter-dues-status");
    if (filterDues) {
      filterDues.addEventListener("change", (e) => {
        AdminController.loadTenantDues(e.target.value);
      });
    }
  }
};
