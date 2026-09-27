/**
 * ==========================================================================
 * TANSU NIRALOY - OWNER DASHBOARD & PROPERTY MANAGEMENT CONTROLLER
 * Pure Vanilla JavaScript
 * Strict Rules:
 * - Owner only sees properties, earnings, and settlements belonging to their ownerId
 * - Owner CANNOT verify own listing or approve tenant requests
 * - Owner CANNOT directly collect rent or contact tenant (System Intermediary Rule)
 * - Temporary image upload preview manager (frontend preview only, ready for Java multipart storage)
 * ==========================================================================
 */

const OwnerController = {
  // Temporary browser preview images array for current session
  _stagedImagePreviews: [],
  _availableBalance: 0,

  async initDashboard() {
    if (!Auth.requireAuth(["OWNER"])) return;
    const user = Auth.getCurrentUser();

    if (document.getElementById("owner-name-display")) {
      document.getElementById("owner-name-display").textContent = user.name;
    }
    if (document.getElementById("owner-id-display")) {
      document.getElementById("owner-id-display").textContent = user.userId;
    }

    await this.loadOwnerProperties(user.userId);
    await this.loadOwnerEarnings(user.userId);
    await this.loadOwnerSettlements(user.userId);
  },

  /**
   * Load and render the owner's listed properties into #owner-properties-table-body.
   */
  async loadOwnerProperties(ownerId) {
    const tableBody = document.getElementById("owner-properties-table-body");
    const kpiTotal = document.getElementById("kpi-owner-total-props");
    const kpiVerified = document.getElementById("kpi-owner-verified-props");

    try {
      const res = await apiGet("/api/properties", { ownerId });
      const properties = res.data || [];

      if (kpiTotal) kpiTotal.textContent = properties.length;
      
      const verifiedCount = properties.filter(p => 
        (p.status === "APPROVED" || p.verificationStatus === "VERIFIED") &&
        p.status !== "REJECTED" && p.verificationStatus !== "REJECTED"
      ).length;
      if (kpiVerified) kpiVerified.textContent = verifiedCount;

      if (!tableBody) return;

      if (properties.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">You haven\'t listed any properties yet.<br><a href="owner-add-property.html" class="btn btn-sm btn-primary mt-3">+ Add Your First Listing</a></td></tr>';
        return;
      }

      tableBody.innerHTML = properties.map(p => {
        const isRejected = p.status === 'REJECTED' || p.verificationStatus === 'REJECTED' || p.availabilityStatus === 'REJECTED';
        const isVerified = (p.status === 'APPROVED' || p.verificationStatus === 'VERIFIED') && !isRejected;
        
        let statusBadge = '';
        if (isRejected) {
          statusBadge = '<span class="badge badge-rejected">REJECTED</span>';
        } else if (isVerified) {
          statusBadge = '<span class="badge badge-success">VERIFIED</span>';
        } else {
          statusBadge = '<span class="badge badge-warning">PENDING</span>';
        }

        const availStr = (p.availabilityStatus || "").toUpperCase();
        const isRented = availStr.includes("RENTED");
        const isSold = availStr.includes("SOLD");
        const isInactive = availStr === 'INACTIVE';

        let availBadge = '';
        let actionButtons = '';

        if (isRejected) {
          availBadge = '<span class="badge badge-rejected">BLOCKED</span>';
          actionButtons = `<button class="btn btn-sm btn-outline" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="OwnerController.deleteProperty('${p.propertyId}')">Remove</button>`;
        } else if (isRented) {
          availBadge = '<span class="badge badge-rent" style="background:#DBEAFE; color:#1E40AF; font-weight:700;">RENTED</span>';
          actionButtons = `
            <div class="flex gap-1 items-center">
              <span class="badge badge-pending" style="font-size:0.75rem; padding: 3px 8px;">Occupied Flat</span>
              <a href="property-details.html?id=${p.propertyId}" target="_blank" class="btn btn-sm btn-outline">View</a>
            </div>
          `;
        } else if (isSold) {
          availBadge = '<span class="badge badge-sale" style="background:#FEE2E2; color:#DC2626; font-weight:700;">SOLD</span>';
          actionButtons = `<span class="badge badge-verified" style="font-size:0.75rem; padding: 3px 8px;">Transferred</span>`;
        } else if (isInactive) {
          availBadge = '<span class="badge badge-rejected">INACTIVE</span>';
          actionButtons = `
            <div class="flex gap-1">
              <button class="btn btn-sm btn-outline" onclick="OwnerController.togglePropertyStatus('${p.propertyId}', 'AVAILABLE')">Activate</button>
              <button class="btn btn-sm btn-outline" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="OwnerController.deleteProperty('${p.propertyId}')">Remove</button>
            </div>
          `;
        } else {
          availBadge = '<span class="badge badge-success">ACTIVE</span>';
          actionButtons = `
            <div class="flex gap-1">
              <button class="btn btn-sm btn-outline" onclick="OwnerController.togglePropertyStatus('${p.propertyId}', 'INACTIVE')">Deactivate</button>
              <button class="btn btn-sm btn-outline" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="OwnerController.deleteProperty('${p.propertyId}')">Remove</button>
            </div>
          `;
        }

        return `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--color-primary);">${p.propertyId}</div>
            <div style="font-size:0.85rem; color:var(--color-text-muted);">${p.location || ''}</div>
          </td>
          <td>${p.title}</td>
          <td>${p.purpose === 'SALE' ? 'PROPERTY SALE' : 'RENTAL LEASE'}</td>
          <td><strong>BDT ${p.price ? Number(p.price).toLocaleString() : 0}</strong> ${p.purpose === 'SALE' ? '' : '/ month'}</td>
          <td>${statusBadge}</td>
          <td>${availBadge}</td>
          <td>${actionButtons}</td>
        </tr>`;
      }).join('');
    } catch (e) {
      console.warn('Error loading properties:', e);
      if (tableBody) tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load properties.</td></tr>';
    }
  },

  /**
   * Load Verified Flat Rented & Sold Earnings Ledger (#owner-earnings-table-body)
   */
  async loadOwnerEarnings(ownerId) {
    const tableBody = document.getElementById("owner-earnings-table-body");
    if (!tableBody) return;

    let props = [];
    try {
      const propRes = await apiGet("/api/properties", { ownerId });
      props = propRes.data || [];
    } catch(e){}

    let settlements = [];
    try {
      const setRes = await apiGet("/api/owner/settlements", { ownerId });
      settlements = setRes.data || [];
    } catch(e){}

    let requests = [];
    try {
      const reqRes = await apiGet("/api/requests");
      requests = reqRes.data || [];
    } catch (e) {}

    const verifiedProps = props.filter(p => p.status === "APPROVED" || p.verificationStatus === "VERIFIED");
    const earningItems = [];

    verifiedProps.forEach(p => {
      const availStr = (p.availabilityStatus || "").toUpperCase();
      const matchingSettlement = settlements.find(s => s.propertyId === p.propertyId);
      const isRented = availStr.includes("RENTED") || (matchingSettlement && matchingSettlement.type === "RENTAL_INCOME");
      const isSold = availStr.includes("SOLD") || (matchingSettlement && matchingSettlement.type === "SALE_PROCEEDS");

      if (isRented || isSold) {
        const matchingReq = requests.find(r => r.propertyId === p.propertyId && (r.status === "APPROVED" || r.status === "PENDING"));
        let occupant = "Verified Tenant";
        if (matchingReq && matchingReq.tenantName) {
          occupant = `${matchingReq.tenantName} (${matchingReq.tenantId || 'TNT'})`;
        } else if (p.occupant) {
          occupant = p.occupant;
        }

        const isSettled = matchingSettlement && matchingSettlement.status === "SETTLED";
        const agreementRate = Number(p.price || (matchingSettlement ? matchingSettlement.amount : 0) || 0);
        const creditedAmount = matchingSettlement ? Number(matchingSettlement.entitledAmount) : Math.round(agreementRate * 0.8);

        earningItems.push({
          propertyId: p.propertyId,
          title: p.title,
          location: p.location,
          type: isSold ? "SALE" : "RENT",
          tenant: occupant,
          agreementRate: agreementRate,
          creditedAmount: creditedAmount,
          isSettled: isSettled,
          status: isSettled ? "Rent Cleared & Disbursed" : (isSold ? "Sold & Transferred" : "Active Tenancy")
        });
      }
    });

    if (earningItems.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-muted" style="padding: 2.5rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.35rem;"></div>
            <strong>No active rented or sold properties yet.</strong><br>
            <span style="font-size: 0.85rem;">Once your verified properties are leased or sold to tenants/buyers, revenue inflows will appear here.</span>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = earningItems.map(item => {
      const isSale = item.type === "SALE";
      return `
        <tr>
          <td>
            <strong>${item.propertyId}</strong><br>
            <small class="text-muted">${item.title} (${item.location})</small>
            <div style="font-size:0.8rem; color:var(--color-primary); margin-top:2px;">Occupant: ${item.tenant}</div>
          </td>
          <td>
            <span class="badge ${isSale ? 'badge-sale' : 'badge-rent'}">
              ${isSale ? 'FLAT PURCHASE' : 'RENTAL LEASE'}
            </span>
          </td>
          <td><strong>BDT ${item.agreementRate.toLocaleString()}</strong> ${isSale ? '' : '/ month'}</td>
          <td>
            <strong style="color:var(--color-success); font-size: 1.05rem;">BDT ${item.creditedAmount.toLocaleString()}</strong>
            <br><small class="text-muted">Net 80% Payout</small>
          </td>
          <td>
            <span class="badge ${item.isSettled ? 'badge-verified' : 'badge-available'}">
              ${item.status}
            </span>
          </td>
          <td>
            ${item.isSettled 
              ? '<span class="badge badge-verified" style="background:#DCFCE7; color:#166534; font-weight:700;">Disbursed by Admin</span>'
              : '<span class="badge badge-available" style="background:#FEF3C7; color:#92400E; font-weight:700;">Credited to Balance</span>'
            }
          </td>
        </tr>
      `;
    }).join("");
  },

  /**
   * Load Settlements & Payouts (#owner-settlements-table-body)
   */
  async loadOwnerSettlements(ownerId) {
    const tableBody = document.getElementById("owner-settlements-table-body");
    const kpiEarned = document.getElementById("kpi-owner-total-earned");
    const kpiAvailable = document.getElementById("kpi-owner-available-balance");
    const kpiReceived = document.getElementById("kpi-owner-total-received");

    let settlements = [];
    try {
      const res = await apiGet("/api/owner/settlements", { ownerId });
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        settlements = res.data;
      }
    } catch (e) {
      console.warn("API settlements fetch error:", e);
    }

    if (settlements.length === 0) {
      try {
        const stored = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
        settlements = stored.filter(s => s.ownerId === ownerId);
      } catch (e) {}
    }

    // Calculations
    const totalEarned = settlements
      .filter(s => s.type !== "WITHDRAWAL_REQUEST")
      .reduce((sum, s) => sum + Number(s.entitledAmount || s.amount || 0), 0);

    const totalDisbursed = settlements
      .filter(s => s.status === "SETTLED")
      .reduce((sum, s) => sum + Number(s.disbursed != null ? s.disbursed : (s.entitledAmount || 0)), 0);

    const pendingWithdrawals = settlements
      .filter(s => s.type === "WITHDRAWAL_REQUEST" && s.status !== "SETTLED" && s.status !== "REJECTED")
      .reduce((sum, s) => sum + Number(s.entitledAmount || 0), 0);

    const availableBalance = Math.max(0, totalEarned - totalDisbursed - pendingWithdrawals);
    this._availableBalance = availableBalance;

    if (kpiEarned) kpiEarned.textContent = `BDT ${totalEarned.toLocaleString()}`;
    if (kpiAvailable) kpiAvailable.textContent = `BDT ${availableBalance.toLocaleString()}`;
    if (kpiReceived) kpiReceived.textContent = `BDT ${totalDisbursed.toLocaleString()}`;

    if (!tableBody) return;

    if (settlements.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted" style="padding: 2.5rem;">
            <div style="font-size: 1.5rem; margin-bottom: 0.35rem;"></div>
            <strong style="color: var(--color-primary);">No Settlement Records</strong><br>
            <span style="font-size: 0.85rem;">When tenants pay rent or purchase your verified properties, you can submit withdrawal requests to disburse funds.</span>
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = settlements.map(s => {
      const isWithdrawal = s.type === "WITHDRAWAL_REQUEST";
      const isSettled = s.status === "SETTLED";
      const isPending = s.status === "PENDING_ADMIN_APPROVAL" || s.status === "PENDING_AUDIT" || s.status === "PENDING";
      let statusBadge = isSettled ? 'badge-verified' : (isPending ? 'badge-pending' : 'badge-available');
      let statusLabel = isSettled ? 'Disbursed' : (isPending ? 'Awaiting Admin Approval' : (s.status || 'Available'));

      const dest = s.bankName || (s.payoutMethod ? `${s.payoutMethod}` : 'Designated Bank Account');
      const totalCollected = Number(s.totalCollected || s.amount || (isWithdrawal ? s.entitledAmount : 0));
      const commission = Number(s.commissionFee || s.systemCommission || 0);
      const ownerPayout = Number(s.entitledAmount || 0);
      const commissionRate = s.commissionRate || '20%';

      return `
        <tr>
          <td>
            <strong>${s.settlementId}</strong><br>
            <small class="text-muted">${s.propertyId || 'Portfolio'}</small>
          </td>
          <td>
            <span class="badge ${isWithdrawal ? 'badge-rent' : (s.type === 'SALE_PROCEEDS' ? 'badge-sale' : 'badge-available')}">
              ${isWithdrawal ? 'WITHDRAWAL REQUEST' : (s.type === 'SALE_PROCEEDS' ? 'SALE PROCEEDS' : 'RENTAL REMITTANCE')}
            </span>
          </td>
          <td>
            ${!isWithdrawal && totalCollected > 0 ? `
              <div style="font-size:0.78rem; color:var(--color-text-muted); margin-bottom:0.15rem;">Listing Amount: <strong>BDT ${totalCollected.toLocaleString()}</strong></div>
              <div style="font-size:0.78rem; color:var(--color-danger); margin-bottom:0.15rem;">Commission (${commissionRate}): − BDT ${commission.toLocaleString()}</div>
            ` : ''}
            <strong style="color:${isWithdrawal ? 'var(--color-danger)' : 'var(--color-success)'}; font-size:1.05rem;">BDT ${ownerPayout.toLocaleString()}</strong>
            ${!isWithdrawal ? '<br><small class="text-muted">Your Payout (80%)</small>' : ''}
          </td>
          <td>
            <strong>${dest}</strong>
            ${s.payoutDetails && s.payoutDetails.accountNumber ? `<br><small class="text-muted">A/C: ${s.payoutDetails.accountNumber}</small>` : ''}
          </td>
          <td>${s.requestDate || s.clearanceDate || 'Recent'}</td>
          <td>
            <span class="badge ${statusBadge}">
              ${statusLabel}
            </span>
          </td>
          <td>
            ${isSettled 
              ? `<span style="color:var(--color-success); font-weight:700;">Disbursed on ${s.clearanceDate || 'Audit'}</span>` 
              : (isPending 
                  ? `<span class="text-muted" style="font-size:0.85rem;">Under Admin Review</span>` 
                  : `<button class="btn btn-sm btn-outline" onclick="OwnerController.openWithdrawModal()">Withdraw</button>`)
            }
          </td>
        </tr>
      `;
    }).join("");
  },

  openWithdrawModal() {
    const modalDisplay = document.getElementById("modal-available-balance-display");
    if (modalDisplay) {
      modalDisplay.textContent = `BDT ${this._availableBalance.toLocaleString()}`;
    }
    const amountInput = document.getElementById("withdraw-amount");
    if (amountInput) {
      amountInput.max = Math.max(0, this._availableBalance);
      if (this._availableBalance < 500) {
        amountInput.min = 0;
        amountInput.disabled = true;
        amountInput.value = 0;
      } else {
        amountInput.min = 500;
        amountInput.disabled = false;
        amountInput.value = this._availableBalance;
      }
    }
    Components.openModal("modal-request-withdrawal");
  },

  togglePayoutFields() {
    const method = document.getElementById("withdraw-payout-method")?.value;
    const bankFields = document.getElementById("payout-bank-fields");
    const mfsFields = document.getElementById("payout-mfs-fields");

    if (method === "BANK_TRANSFER") {
      if (bankFields) bankFields.style.display = "block";
      if (mfsFields) mfsFields.style.display = "none";
    } else {
      if (bankFields) bankFields.style.display = "none";
      if (mfsFields) mfsFields.style.display = "block";
    }
  },

  async submitWithdrawalRequest(e) {
    if (e) e.preventDefault();
    const user = Auth.getCurrentUser();
    if (!user) return;

    const amountInput = document.getElementById("withdraw-amount");
    const amount = Number(amountInput?.value || 0);

    if (amount <= 0) {
      Components.showToast("error", "Invalid Amount", "Please enter a valid withdrawal amount greater than 0.");
      return;
    }

    if (amount > this._availableBalance) {
      Components.showToast("warning", "Insufficient Balance", `Requested BDT ${amount.toLocaleString()} exceeds your available balance of BDT ${this._availableBalance.toLocaleString()}.`);
      return;
    }

    const method = document.getElementById("withdraw-payout-method")?.value || "BANK_TRANSFER";
    const note = document.getElementById("withdraw-note")?.value?.trim() || "";

    let payoutDetails = {};
    let methodLabel = "Bank Transfer";

    if (method === "BANK_TRANSFER") {
      const bank = document.getElementById("withdraw-bank-name")?.value?.trim() || "BRAC Bank PLC";
      const acc = document.getElementById("withdraw-bank-account")?.value?.trim() || "150120XXXXXX";
      const holder = document.getElementById("withdraw-bank-holder")?.value?.trim() || user.name;
      const branch = document.getElementById("withdraw-bank-branch")?.value?.trim() || "";
      methodLabel = `${bank} (BEFTN)`;
      payoutDetails = { bankName: bank, accountNumber: acc, accountHolder: holder, branch };
    } else {
      const mfsNumber = document.getElementById("withdraw-mfs-number")?.value?.trim() || user.phone || "017XXXXXXXX";
      const mfsType = document.getElementById("withdraw-mfs-type")?.value || "Personal";
      methodLabel = `${method} (${mfsType} - ${mfsNumber})`;
      payoutDetails = { provider: method, accountNumber: mfsNumber, accountType: mfsType };
    }

    const submitBtn = document.getElementById("btn-submit-withdraw");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting to Admin...";
    }

    try {
      await apiPost("/api/owner/withdraw", {
        ownerId: user.userId,
        ownerName: user.name,
        amount: amount,
        payoutMethod: methodLabel,
        payoutDetails: payoutDetails,
        note: note
      });

      Components.closeModal("modal-request-withdrawal");
      Components.showToast("success", "Withdrawal Request Submitted", `Your request for BDT ${amount.toLocaleString()} has been sent to TANSU Admin for review and disbursement.`);
      
      // Refresh views
      await this.loadOwnerSettlements(user.userId);
      await this.loadOwnerEarnings(user.userId);
    } catch (err) {
      console.error("Withdrawal error:", err);
      Components.showToast("error", "Error", "Could not submit withdrawal request. Please try again.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Withdrawal Request";
      }
    }
  },

  async togglePropertyStatus(propertyId, newStatus) {
    const action = newStatus === 'INACTIVE' ? 'deactivate' : 'activate';
    const confirmed = await Components.confirm(`Are you sure you want to ${action} property ${propertyId}?`, 'Change Status');
    if (!confirmed) return;
    
    await apiPut(`/api/properties/${propertyId}`, { availabilityStatus: newStatus });
    Components.showToast("success", "Status Updated", `Property is now ${newStatus}`);
    
    const user = Auth.getCurrentUser();
    if (user) await this.loadOwnerProperties(user.userId);
  },

  async deleteProperty(propertyId) {
    const confirmed = await Components.confirm(`Are you sure you want to delete property ${propertyId}? This action cannot be undone.`, "Delete Property");
    if (!confirmed) return;
    await apiDelete(`/api/properties/${propertyId}`);
    Components.showToast("info", "Deleted", `Property ${propertyId} has been removed.`);
    const user = Auth.getCurrentUser();
    if (user) await this.loadOwnerProperties(user.userId);
  },

  /**
   * Initialize Add/Edit Property Form
   */
  initPropertyForm(isEdit = false) {
    if (!Auth.requireAuth(["OWNER"])) return;
    const user = Auth.getCurrentUser();

    this._stagedImagePreviews = [];
    const imageInput = document.getElementById("property-images");
    const previewContainer = document.getElementById("image-previews-container");
    const form = document.getElementById("property-form");

    // Setup image input previewing
    if (imageInput && previewContainer) {
      imageInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          const valRes = Validation.validateImageFile(file, 5);
          if (!valRes.valid) {
            Components.showToast("error", "File Validation Error", valRes.message);
            return;
          }

          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            const previewObj = {
              id: Date.now() + Math.random(),
              name: file.name,
              url: loadEvt.target.result
            };
            this._stagedImagePreviews.push(previewObj);
            this.renderImagePreviews();
          };
          reader.readAsDataURL(file);
        });
      });
    }

    // Submit handler
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        Validation.clearAllErrors(form);

        const title = document.getElementById("property-title").value.trim();
        const location = document.getElementById("property-location").value;
        const propertyType = document.getElementById("property-type").value;
        const purpose = document.getElementById("property-purpose").value;
        const price = document.getElementById("property-price").value;
        const area = document.getElementById("property-area").value;
        const bedrooms = document.getElementById("property-bedrooms").value;
        const bathrooms = document.getElementById("property-bathrooms").value;
        const description = document.getElementById("property-description").value.trim();

        // Collect checked amenities
        const checkedAmenities = [];
        document.querySelectorAll("input[name='amenities']:checked").forEach(cb => {
          checkedAmenities.push(cb.value);
        });

        // Validations
        let hasError = false;
        if (!title) {
          Validation.showError(document.getElementById("property-title"), "Property title is required.");
          hasError = true;
        }
        const priceVal = Validation.validatePositiveNumber(price, "Price");
        if (!priceVal.valid) {
          Validation.showError(document.getElementById("property-price"), priceVal.message);
          hasError = true;
        }
        const areaVal = Validation.validatePositiveNumber(area, "Area (sqft)");
        if (!areaVal.valid) {
          Validation.showError(document.getElementById("property-area"), areaVal.message);
          hasError = true;
        }
        if (!description) {
          Validation.showError(document.getElementById("property-description"), "Property description is required.");
          hasError = true;
        }

        if (hasError) {
          Components.showToast("error", "Validation Error", "Please resolve the highlighted issues.");
          return;
        }

        const payload = {
          ownerId: user.userId,
          title,
          location,
          propertyType,
          purpose,
          price: Number(price),
          area: Number(area),
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          amenities: checkedAmenities,
          description,
          images: this._stagedImagePreviews.map(p => p.url).length > 0
            ? this._stagedImagePreviews.map(p => p.url)
            : ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600"]
        };

        const res = await apiPost("/api/properties", payload);
        if (res && (res.success || res.status === 201 || res.status === 200 || res.data)) {
          Components.showToast("success", "Listing Submitted", "Your property has been submitted with PENDING status to TANSU Admin for verification.");
          setTimeout(() => {
            window.location.href = "owner-dashboard.html";
          }, 1200);
        } else {
          Components.showToast("error", "Submission Failed", (res && res.message) || "Could not submit property listing.");
        }
      };
    }
  },

  renderImagePreviews() {
    const container = document.getElementById("image-previews-container");
    if (!container) return;

    if (this._stagedImagePreviews.length === 0) {
      container.innerHTML = `<p class="text-muted" style="font-size:0.85rem;">No images selected yet. Max 5MB per file (JPG, PNG, WEBP).</p>`;
      return;
    }

    container.innerHTML = this._stagedImagePreviews.map(item => `
      <div class="image-preview-card" style="position:relative;width:90px;height:70px;border-radius:var(--radius-md);overflow:hidden;border:1px solid var(--color-border);display:inline-block;margin-right:0.5rem;margin-bottom:0.5rem;">
        <img src="${item.url}" style="width:100%;height:100%;object-fit:cover;">
        <button type="button" onclick="OwnerController.removePreview(${item.id})" style="position:absolute;top:2px;right:2px;background:rgba(239,68,68,0.85);color:#FFF;border:none;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;line-height:1;">&times;</button>
      </div>
    `).join("");
  },

  removePreview(id) {
    this._stagedImagePreviews = this._stagedImagePreviews.filter(p => p.id !== id);
    this.renderImagePreviews();
  }
};
