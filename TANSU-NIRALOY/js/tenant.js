/**
 * ==========================================================================
 * TANSU NIRALOY - TENANT DASHBOARD CONTROLLER
 * Pure Vanilla JavaScript
 * Manages:
 * - Overview KPI metrics
 * - My Requests (Rent, Buy, Visit status)
 * - My Rentals & Active contracts
 * - Bills & Payments history
 * - Receipts
 * - Outstanding Dues (with direct Pay Now action linking to payment.html)
 * - Support / Complaints ticketing (goes to Admin, NEVER direct to Owner)
 * STRICT RULE: No wallet, no top-up, no fake escrow UI.
 * ==========================================================================
 */

const TenantController = {
  async init() {
    // Role guard: Ensure user is authenticated as TENANT
    if (!Auth.requireAuth(["TENANT"])) return;

    const user = Auth.getCurrentUser();
    if (document.getElementById("tenant-name-display")) {
      document.getElementById("tenant-name-display").textContent = user.name;
    }
    if (document.getElementById("tenant-id-display")) {
      document.getElementById("tenant-id-display").textContent = user.userId;
    }

    // Tab switching
    this.setupTabs();

    // Load data
    await this.loadNotices(user.userId);
    await this.loadRequests(user.userId);
    await this.loadRentals(user.userId);
    await this.loadDues(user.userId);
    await this.loadPayments(user.userId);
    this.setupSupportForm(user.userId);
  },

  async loadNotices(tenantId) {
    const container = document.getElementById("tenant-notices-container");
    if (!container) return;

    const user = Auth.getCurrentUser();
    const userId = user ? user.userId : tenantId;
    const userEmail = user ? user.email : "";

    try {
      const res = await apiGet("/api/admin/notices");
      const allNotices = res.data || [];
      
      // Filter notices specifically sent to this tenant
      const myNotices = allNotices.filter(n => 
        (n.tenantId && n.tenantId === userId) || 
        (userEmail && n.tenantEmail && n.tenantEmail.toLowerCase() === userEmail.toLowerCase())
      );

      // If no notice specifically sent to this tenant by admin, hide notice container
      if (myNotices.length === 0) {
        container.style.display = "none";
        container.innerHTML = "";
        return;
      }

      // Check tenant's current dues to ensure the notice corresponds to an unpaid/overdue item
      let currentDues = [];
      try {
        const duesRes = await apiGet("/api/tenant/dues", { tenantId: userId, email: userEmail });
        currentDues = duesRes.data || [];
      } catch (e) {}

      // Find if there's any active notice for an UNPAID due
      const activeUnpaidNotice = myNotices.find(n => {
        if (!n.dueId) return true;
        const matchingDue = currentDues.find(d => d.dueId === n.dueId);
        return !matchingDue || (matchingDue.status !== 'PAID' && Number(matchingDue.dueAmount || 0) > 0);
      });

      if (!activeUnpaidNotice) {
        // Due has already been paid/settled, hide the notice
        container.style.display = "none";
        container.innerHTML = "";
        return;
      }

      const latest = activeUnpaidNotice;
      const isUrgent = (latest.noticeType || "").includes("Urgent") || (latest.noticeType || "").includes("Legal") || (latest.noticeType || "").includes("Final");
      const noticeBodyText = latest.message || latest.customMessage || "You have an outstanding payment overdue. Please settle your account immediately via TANSU online payment gateway.";

      container.style.display = "block";
      container.innerHTML = `
        <div class="card" style="border-left: 5px solid ${isUrgent ? 'var(--color-danger)' : 'var(--color-warning)'}; background: ${isUrgent ? '#FEF2F2' : '#FFFBEB'}; padding: 1.25rem; border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
          <div class="flex justify-between items-start" style="flex-wrap: wrap; gap: 1rem;">
            <div class="flex items-start gap-3" style="flex: 1; min-width: 260px;">
              <span style="font-size: 1.8rem; line-height: 1;">${isUrgent ? '🚨' : '⚠️'}</span>
              <div>
                <div class="flex items-center gap-2 mb-1" style="flex-wrap: wrap;">
                  <span class="badge ${isUrgent ? 'badge-rejected' : 'badge-pending'}" style="font-weight: 800; text-transform: uppercase;">
                    ${latest.noticeType || 'OFFICIAL PAYMENT NOTICE'}
                  </span>
                  <span class="text-muted" style="font-size: 0.78rem;">
                    Sent by Admin: ${latest.sentAt || 'Recently'} &bull; Delivery: ${Array.isArray(latest.channels) ? latest.channels.join(", ") : (latest.channels || 'Portal & SMS')}
                  </span>
                </div>
                <div style="font-weight: 700; color: #1E293B; margin-bottom: 0.35rem; font-size: 0.95rem;">
                  Official Admin Demand &bull; Account: ${latest.tenantName || 'Tenant'} (${latest.dueId || 'Rent Dues'})
                </div>
                <p style="margin: 0; font-size: 0.88rem; color: #334155; line-height: 1.5; white-space: pre-line;">
                  ${noticeBodyText}
                </p>
              </div>
            </div>
            <a href="#dues" onclick="const b = document.querySelector('[data-target=\\'section-dues\\']'); if(b) b.click();" class="btn btn-sm ${isUrgent ? 'btn-danger' : 'btn-accent'}" style="font-weight: 700; white-space: nowrap;">
              💳 View &amp; Settle Due
            </a>
          </div>
        </div>
      `;
    } catch (e) {
      console.error("[Tenant] Error loading notices:", e);
      container.style.display = "none";
    }
  },

  setupTabs() {
    const tabButtons = document.querySelectorAll(".dashboard-nav-item");
    const tabSections = document.querySelectorAll(".dashboard-section");

    tabButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetSectionId = btn.getAttribute("data-target");

        tabButtons.forEach(b => b.classList.remove("active"));
        tabSections.forEach(s => s.style.display = "none");

        btn.classList.add("active");
        const target = document.getElementById(targetSectionId);
        if (target) target.style.display = "block";
      });
    });
  },

  async loadRequests(tenantId) {
    const container = document.getElementById("tenant-requests-table-body");
    const kpiPending = document.getElementById("kpi-pending-requests");
    if (!container) return;

    const user = Auth.getCurrentUser();
    const userId = user ? user.userId : tenantId;
    const userEmail = user ? user.email : "";

    let requests = [];
    try {
      const res = await apiGet(`/api/requests/user/${encodeURIComponent(userId)}`);
      if (res && res.data && Array.isArray(res.data)) {
        requests = res.data;
      }
    } catch (e) {
      console.warn("Error fetching /api/requests/user:", e);
    }

    if (requests.length === 0) {
      try {
        const res = await apiGet("/api/tenant/requests", { tenantId: userId, email: userEmail });
        const all = res.data || [];
        requests = all.filter(r => r.tenantId === userId || (userEmail && r.tenantEmail === userEmail));
      } catch (e) {
        console.warn("Fallback /api/tenant/requests failed:", e);
      }
    }

    if (kpiPending) {
      const pendingCount = requests.filter(r => r.status === "PENDING" || r.status === "UNDER_REVIEW").length;
      kpiPending.textContent = pendingCount;
    }

    if (requests.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted" style="padding: 2rem;">
            No requests submitted yet. Browse properties to request Rent, Purchase, or Visit.
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = requests.map(r => {
      const displayType = (r.requestType || "RENT").replace(/_REQUEST|_SCHEDULE/g, "");
      const isRent = displayType === 'RENT';
      const statusBadge = r.status === 'APPROVED' ? 'badge-verified' : (r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending');

      return `
        <tr>
          <td><strong>${r.requestId}</strong></td>
          <td><a href="property-details.html?id=${r.propertyId}" target="_blank"><strong>${r.propertyId}</strong></a></td>
          <td><span class="badge ${isRent ? 'badge-rent' : 'badge-sale'}">${displayType}</span></td>
          <td>${r.requestDate || 'Today'}</td>
          <td>${r.preferredDate ? `${r.preferredDate}${r.preferredTime ? ' at ' + r.preferredTime : ''}` : 'N/A'}</td>
          <td>
            <span class="badge ${statusBadge}">
              ${r.status}
            </span>
          </td>
        </tr>
      `;
    }).join("");
  },

  async loadRentals(tenantId) {
    const kpiActive = document.getElementById("kpi-active-rental");
    const kpiActiveSub = document.getElementById("kpi-active-rental-sub");
    const container = document.getElementById("active-rental-container");

    const user = Auth.getCurrentUser();
    const userId = user ? user.userId : tenantId;
    const userEmail = user ? user.email : "";

    let approvedReq = null;
    try {
      const res = await apiGet(`/api/requests/user/${encodeURIComponent(userId)}`);
      const reqs = res.data || [];
      approvedReq = reqs.find(r => r.status === 'APPROVED' && (r.requestType || '').includes('RENT'));
    } catch (e) {}

    let activeDue = null;
    try {
      const resDue = await apiGet(`/api/tenant/dues`, { tenantId: userId, email: userEmail });
      const dues = resDue.data || [];
      activeDue = dues.find(d => d.tenantId === userId || (userEmail && d.tenantEmail === userEmail));
    } catch (e) {}

    if (approvedReq || activeDue || tenantId === "TNT-101") {
      const propId = approvedReq ? approvedReq.propertyId : (activeDue ? activeDue.propertyId : "PROP-102");
      let propTitle = activeDue ? activeDue.flatTitle : (approvedReq ? `Leased Residence (${propId})` : "Spacious Family Flat Near Park");
      let rentAmt = activeDue && activeDue.rentAmount ? activeDue.rentAmount : (activeDue ? activeDue.totalBilled : 45000);
      let utilityAmt = activeDue && activeDue.utilityCharge ? activeDue.utilityCharge : 5000;
      let propLoc = activeDue && activeDue.location ? activeDue.location : "Dhaka";

      if (kpiActive) kpiActive.textContent = "1 Active";
      if (kpiActiveSub) kpiActiveSub.textContent = propLoc;

      if (container) {
        container.innerHTML = `
          <div class="card" style="border-left: 4px solid var(--color-accent);">
            <div class="flex justify-between items-center mb-4" style="flex-wrap: wrap; gap: 1rem;">
              <div>
                <span class="badge badge-verified">Lease Verified &amp; Active</span>
                <h3 style="margin-top: 0.5rem; margin-bottom: 0.25rem;">${propTitle}</h3>
                <p class="text-muted" style="margin-bottom:0;">📍 ${propLoc} &bull; Property ID: <strong>${propId}</strong></p>
              </div>
              <div class="text-right">
                <div style="font-size: 1.4rem; font-weight: 800; color: var(--color-primary);">৳ ${Number(rentAmt).toLocaleString()}</div>
                <div class="text-muted" style="font-size: 0.8rem;">Monthly Base Rent</div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4" style="background: var(--color-surface-alt); padding: 1rem; border-radius: var(--radius-md);">
              <div><strong>Lease Inception:</strong> ${approvedReq && approvedReq.requestDate ? approvedReq.requestDate : 'Active'}</div>
              <div><strong>Utility Charge:</strong> ৳ ${Number(utilityAmt).toLocaleString()}</div>
              <div><strong>Intermediary Desk:</strong> Mediated via TANSU Niraloy</div>
            </div>
          </div>
        `;
      }
    } else {
      if (kpiActive) kpiActive.textContent = "0 Active";
      if (kpiActiveSub) kpiActiveSub.textContent = "No Active Flat";
      if (container) {
        container.innerHTML = `
          <div class="card text-center" style="padding: 2.5rem 1.5rem; background: var(--color-surface-alt); border-radius: var(--radius-md);">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 0.75rem;">🏡</span>
            <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">No Active Rental Lease</h4>
            <p class="text-muted" style="max-width: 480px; margin: 0 auto 1.25rem auto; font-size: 0.9rem; line-height: 1.6;">
              You have not rented any properties yet. Browse verified Dhaka flats, choose your preferred home, and submit a rental or visit inquiry.
            </p>
            <a href="properties.html" class="btn btn-primary">Browse Verified Properties</a>
          </div>
        `;
      }
    }
  },

  async loadDues(tenantId) {
    const container = document.getElementById("tenant-dues-table-body");
    const kpiDue = document.getElementById("kpi-outstanding-due");
    const kpiDueSub = document.getElementById("kpi-outstanding-due-sub");
    if (!container) return;

    const user = Auth.getCurrentUser();
    const userId = user ? user.userId : tenantId;
    const userEmail = user ? user.email : "";

    let dues = [];
    try {
      const res = await apiGet(`/api/tenant/dues`, { tenantId: userId, email: userEmail });
      if (res && res.data && Array.isArray(res.data)) {
        dues = res.data;
      }
    } catch (e) {
      console.warn("Error loading dues from API:", e);
    }

    // Filter user's dues
    let activeDues = dues.filter(d => 
      (d.tenantId && d.tenantId === userId) || 
      (userEmail && d.tenantEmail && d.tenantEmail.toLowerCase() === userEmail.toLowerCase())
    );

    // If demo tenant and not found via API, read from local storage
    if (activeDues.length === 0 && userId === "TNT-101") {
      try {
        const storedDues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
        activeDues = storedDues.filter(d => d.tenantId === "TNT-101");
      } catch (e) {}
    }

    const totalDue = activeDues
      .filter(d => d.status !== 'PAID' && Number(d.dueAmount || 0) > 0)
      .reduce((sum, d) => sum + Number(d.dueAmount != null ? d.dueAmount : (d.due != null ? d.due : d.totalBilled || 0)), 0);

    if (kpiDue) {
      kpiDue.textContent = `৳ ${totalDue.toLocaleString()}`;
    }
    if (kpiDueSub) {
      if (activeDues.length > 0 && totalDue > 0) {
        const firstUnpaid = activeDues.find(d => d.status !== 'PAID' && Number(d.dueAmount || 0) > 0) || activeDues[0];
        kpiDueSub.textContent = firstUnpaid.dueDate ? `Due: ${firstUnpaid.dueDate}` : "Payment Required";
      } else {
        kpiDueSub.textContent = "No Pending Dues";
      }
    }

    if (activeDues.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
            <span style="font-size: 1.6rem; display: block; margin-bottom: 0.35rem;">🎉</span>
            <strong style="color: var(--color-primary);">No Outstanding Dues</strong><br>
            <span style="font-size: 0.85rem;">Your account is completely settled with ৳ 0.00 outstanding balance.</span>
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = activeDues.map(d => {
      const billed = Number(d.totalBilled != null ? d.totalBilled : (d.amount != null ? d.amount : 0));
      const outstanding = Number(d.dueAmount != null ? d.dueAmount : (d.due != null ? d.due : (d.status === 'PAID' ? 0 : billed)));
      const isPaid = d.status === 'PAID' || outstanding <= 0;
      const desc = d.flatTitle || (d.type ? `${d.propertyId} - ${d.type}` : `Rental Property ${d.propertyId}`);
      const statusLabel = isPaid ? 'PAID' : (d.status || 'UNPAID');

      return `
        <tr>
          <td><strong>${d.dueId}</strong></td>
          <td>
            <strong>${desc}</strong><br>
            <small class="text-muted">Property ID: ${d.propertyId}${d.dueMonth ? ` &bull; ${d.dueMonth}` : ''}</small>
          </td>
          <td>৳ ${billed.toLocaleString()}</td>
          <td><strong style="color: ${isPaid ? 'var(--color-success)' : 'var(--color-danger)'};">৳ ${outstanding.toLocaleString()}</strong></td>
          <td>${d.dueDate || 'Current Month'}</td>
          <td>
            <span class="badge ${isPaid ? 'badge-verified' : 'badge-pending'}">
              ${statusLabel}
            </span>
          </td>
          <td>
            ${!isPaid ? `
              <a href="payment.html?dueId=${d.dueId}&propertyId=${d.propertyId}&amount=${outstanding}&type=RENT" class="btn btn-sm btn-accent" style="font-weight: 700; white-space: nowrap;">
                Pay Rent
              </a>
            ` : `
              <span class="badge badge-verified">✓ Paid (৳ 0.00)</span>
            `}
          </td>
        </tr>
      `;
    }).join("");
  },

  async loadPayments(tenantId) {
    const container = document.getElementById("tenant-payments-table-body");
    const kpiRecent = document.getElementById("kpi-recent-payment");
    const kpiRecentSub = document.getElementById("kpi-recent-payment-sub");
    if (!container) return;

    const user = Auth.getCurrentUser();
    const userId = user ? user.userId : tenantId;

    let payments = [];
    try {
      const res = await apiGet(`/api/tenant/payments`, { tenantId: userId });
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        payments = res.data;
      }
    } catch (e) {}

    if (payments.length === 0) {
      try {
        const storedPayments = JSON.parse(localStorage.getItem("tansu_payments") || "[]");
        payments = storedPayments.filter(p => p.tenantId === userId);
      } catch (e) {}
    }

    if (payments.length === 0 && userId === "TNT-101") {
      payments = [
        {
          paymentId: "PAY-9041",
          transactionId: "TXN-88219",
          propertyId: "PROP-102",
          paymentType: "RENT",
          amount: 45000,
          date: "2026-08-25",
          status: "SUCCESS"
        }
      ];
    }

    if (payments.length > 0) {
      const latestPayment = payments[0];
      if (kpiRecent) kpiRecent.textContent = `৳ ${Number(latestPayment.amount || 0).toLocaleString()}`;
      if (kpiRecentSub) kpiRecentSub.textContent = latestPayment.date ? `Cleared: ${latestPayment.date}` : "Lease Cleared";

      container.innerHTML = payments.map(p => `
        <tr>
          <td><strong>${p.paymentId || 'PAY-ONLINE'}</strong></td>
          <td><code>${p.transactionId || 'TXN-DIRECT'}</code></td>
          <td>${p.propertyId}</td>
          <td><span class="badge badge-rent">${p.paymentType || 'RENT'}</span></td>
          <td><strong>৳ ${Number(p.amount || 0).toLocaleString()}</strong></td>
          <td>${p.date || 'Today'}</td>
          <td><span class="badge badge-verified">${p.status || 'SUCCESS'}</span></td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="alert('Viewing Official Intermediary Receipt for ${p.paymentId || 'PAY'}\\nTransaction: ${p.transactionId || 'TXN'}\\nAmount: ৳ ${Number(p.amount||0).toLocaleString()}\\nVerified by TANSU Niraloy.');">
              📄 Receipt
            </button>
          </td>
        </tr>
      `).join("");
    } else {
      if (kpiRecent) kpiRecent.textContent = "৳ 0";
      if (kpiRecentSub) kpiRecentSub.textContent = "No Records Yet";
      container.innerHTML = `
        <tr>
          <td colspan="8" class="text-center text-muted" style="padding: 2.5rem;">
            No payment receipts or transaction history found.
          </td>
        </tr>
      `;
    }
  },

  setupSupportForm(tenantId) {
    const form = document.getElementById("tenant-support-form");
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const category = document.getElementById("support-category").value;
      const subject = document.getElementById("support-subject").value.trim();
      const description = document.getElementById("support-description").value.trim();

      if (!subject || !description) {
        Components.showToast("error", "Missing Fields", "Please provide a subject and detailed description.");
        return;
      }

      await apiPost("/api/tenant/support", {
        tenantId,
        propertyId: "PROP-102",
        category,
        subject,
        description
      });

      form.reset();
      Components.showToast("success", "Support Ticket Logged", "Your issue has been submitted to the TANSU Niraloy Admin desk. Our team will mediate the resolution.");
    };
  }
};
