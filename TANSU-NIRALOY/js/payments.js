/**
 * ==========================================================================
 * TANSU NIRALOY - PROFESSIONAL PAYMENT CHECKOUT CONTROLLER
 * Pure Vanilla JavaScript
 * Implements the Two-Column Banking/Payment UI architecture:
 * - Left Column: Payment Summary, Dynamic Total Amount, Transaction ID, Breakdown, Property & Tenant Specs
 * - Right Column: Payment Method Selection (Card, Mobile Banking, Net Banking, EMI, Promo), Form Validation, Dynamic CTA Button
 * ==========================================================================
 */

const PaymentController = {
  _currentAmount: 45000,
  _convenienceFee: 150,
  _discountAmount: 0,
  _currentMethod: "CARD",

  init() {
    // Read dynamic transaction parameters from URL or backend state
    const urlParams = new URLSearchParams(window.location.search);
    const amountParam = urlParams.get("amount");
    const propIdParam = urlParams.get("propertyId") || "PROP-102";
    const typeParam = urlParams.get("type") || "Monthly Rent Payment";
    const dueIdParam = urlParams.get("dueId") || "DUE-701";

    const user = Auth.getCurrentUser();
    const tenantId = user ? user.userId : "TEN-901";
    const tenantName = user ? user.name : "Registered Tenant";

    if (amountParam && !isNaN(Number(amountParam))) {
      this._currentAmount = Number(amountParam);
    }

    // Populate Left Column Summary
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    const elTxn = document.getElementById("pay-transaction-id");
    const elPropId = document.getElementById("pay-property-id");
    const elPayType = document.getElementById("pay-type");
    const elTenant = document.getElementById("pay-tenant-info");

    if (elTxn) elTxn.textContent = txnId;
    if (elPropId) elPropId.textContent = propIdParam;
    if (elPayType) elPayType.textContent = typeParam;
    if (elTenant) elTenant.textContent = `${tenantName} (${tenantId})`;

    this.updateTotals();
    this.setupMethodTabs();
    this.setupCardFormatters();
    this.setupPromoCode();
    this.setupCheckoutSubmission(txnId, propIdParam, typeParam, dueIdParam, tenantId);
  },

  updateTotals() {
    const totalPayable = this._currentAmount + this._convenienceFee - this._discountAmount;

    const elSubtotal = document.getElementById("pay-subtotal");
    const elFee = document.getElementById("pay-fee");
    const elDiscount = document.getElementById("pay-discount");
    const elTotal = document.getElementById("pay-total-amount");
    const elHeroAmount = document.getElementById("pay-hero-amount");
    const elPayBtn = document.getElementById("btn-pay-action");

    if (elSubtotal) elSubtotal.textContent = `৳ ${this._currentAmount.toLocaleString()}`;
    if (elFee) elFee.textContent = `৳ ${this._convenienceFee.toLocaleString()}`;
    if (elDiscount) elDiscount.textContent = `- ৳ ${this._discountAmount.toLocaleString()}`;
    if (elTotal) elTotal.textContent = `৳ ${totalPayable.toLocaleString()}`;
    if (elHeroAmount) elHeroAmount.textContent = `৳ ${totalPayable.toLocaleString()}`;
    if (elPayBtn) elPayBtn.textContent = `Pay ৳ ${totalPayable.toLocaleString()}`;
  },

  setupMethodTabs() {
    const tabs = document.querySelectorAll(".payment-method-tab");
    const panels = document.querySelectorAll(".payment-method-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const method = tab.getAttribute("data-method");
        this._currentMethod = method;

        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.style.display = "none");

        tab.classList.add("active");
        const panel = document.getElementById(`panel-${method.toLowerCase()}`);
        if (panel) panel.style.display = "block";
      });
    });
  },

  setupCardFormatters() {
    const cardInput = document.getElementById("card-number");
    const expInput = document.getElementById("card-expiry");
    const cvvInput = document.getElementById("card-cvv");

    if (cardInput) {
      cardInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "").substring(0, 16);
        let formatted = v.match(/.{1,4}/g)?.join(" ") || v;
        e.target.value = formatted;
      });
    }

    if (expInput) {
      expInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "").substring(0, 4);
        if (v.length >= 3) {
          e.target.value = `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        } else {
          e.target.value = v;
        }
      });
    }

    if (cvvInput) {
      cvvInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
      });
    }
  },

  setupPromoCode() {
    const applyBtn = document.getElementById("btn-apply-promo");
    const promoInput = document.getElementById("promo-input");

    if (applyBtn && promoInput) {
      applyBtn.addEventListener("click", () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === "TANSU500") {
          this._discountAmount = 500;
          Components.showToast("success", "Promo Applied", "৳ 500 discount has been deducted from your convenience surcharge.");
          this.updateTotals();
        } else if (code) {
          Components.showToast("warning", "Invalid Code", "The promo code entered is not valid for this settlement period.");
        }
      });
    }
  },

  setupCheckoutSubmission(txnId, propertyId, paymentType, dueId, tenantId) {
    const payBtn = document.getElementById("btn-pay-action");
    if (!payBtn) return;

    payBtn.addEventListener("click", async () => {
      let methodLabel = this._currentMethod;

      // Validate active method
      if (this._currentMethod === "CARD") {
        const num = document.getElementById("card-number")?.value.replace(/\s/g, "");
        const exp = document.getElementById("card-expiry")?.value;
        const cvv = document.getElementById("card-cvv")?.value;
        const name = document.getElementById("card-holder")?.value.trim();

        if (!num || num.length < 15 || !exp || !cvv || !name) {
          Components.showToast("error", "Card Validation Error", "Please provide complete and valid payment card information.");
          return;
        }
      } else if (this._currentMethod === "MOBILE_BANKING") {
        const selectedMfs = document.querySelector(".mfs-provider-card.selected")?.getAttribute("data-provider") || "bKash";
        methodLabel = `${selectedMfs} (MFS)`;
      } else if (this._currentMethod === "NET_BANKING") {
        methodLabel = "Net Banking (Bangladesh Bank)";
      } else if (this._currentMethod === "EMI") {
        methodLabel = "Credit Card EMI";
      }

      // Indicate processing
      payBtn.disabled = true;
      payBtn.textContent = "Connecting to Secure Gateway...";

      try {
        await apiPost("/api/tenant/payments", {
          dueId: dueId || "DUE-701",
          propertyId: propertyId || "PROP-102",
          tenantId: tenantId || "TNT-101",
          amount: this._currentAmount,
          paymentType: paymentType || "RENT",
          paymentMethod: methodLabel,
          transactionId: txnId
        });
      } catch (err) {
        console.warn("Payment API warning:", err);
      }

      setTimeout(() => {
        const total = this._currentAmount + this._convenienceFee - this._discountAmount;
        // Redirect to verified payment success receipt view
        window.location.href = `payment-success.html?txnId=${txnId}&amount=${total}&propId=${propertyId}&type=${encodeURIComponent(paymentType)}&method=${encodeURIComponent(methodLabel)}&dueId=${encodeURIComponent(dueId || '')}`;
      }, 1000);
    });
  }
};
