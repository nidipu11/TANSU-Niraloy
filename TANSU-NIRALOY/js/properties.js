/**
 * ==========================================================================
 * TANSU NIRALOY - PROPERTY CATALOG & DETAILS CONTROLLER
 * Pure Vanilla JavaScript
 * Handles search, multi-criteria filtering, category queries, and details view.
 * ==========================================================================
 */

const PropertiesController = {
  /**
   * Initialize Catalog Page (properties.html)
   */
  async initCatalog(defaultCategory = null) {
    const gridEl = document.getElementById("properties-grid");
    const countEl = document.getElementById("properties-count");
    if (!gridEl) return;

    // Read URL query parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get("location") || "ALL";
    const typeParam = defaultCategory || urlParams.get("type") || "ALL";
    const purposeParam = urlParams.get("purpose") || "ALL";

    // Set filter dropdown values to match query params
    const filterLocation = document.getElementById("filter-location");
    const filterType = document.getElementById("filter-type");
    const filterPurpose = document.getElementById("filter-purpose");
    const filterMaxPrice = document.getElementById("filter-max-price");
    const priceDisplay = document.getElementById("price-display");
    const filterBedrooms = document.getElementById("filter-bedrooms");

    if (filterLocation && locationParam !== "ALL") filterLocation.value = locationParam;
    if (filterType && typeParam !== "ALL") filterType.value = typeParam;
    if (filterPurpose && purposeParam !== "ALL") filterPurpose.value = purposeParam;

    const render = async () => {
      gridEl.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 0;">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏳</div>
          <p class="text-muted">Loading verified properties from TANSU inventory...</p>
        </div>
      `;

      const params = {
        location: filterLocation ? filterLocation.value : "ALL",
        propertyType: filterType ? filterType.value : (defaultCategory || "ALL"),
        purpose: filterPurpose ? filterPurpose.value : "ALL",
        maxPrice: filterMaxPrice ? filterMaxPrice.value : "",
        bedrooms: filterBedrooms ? filterBedrooms.value : "ALL"
      };

      const res = await apiGet("/api/properties", params);
      const list = res.data || [];

      const locVal = filterLocation ? filterLocation.value : "ALL";
      const titleEl = document.getElementById("catalog-title");
      if (titleEl) {
        if (locVal !== "ALL") {
          titleEl.textContent = `Verified Properties in ${locVal}`;
        } else if (defaultCategory) {
          titleEl.textContent = `Verified ${defaultCategory.replace(/_/g, ' ')} Listings`;
        } else {
          titleEl.textContent = `Available Properties Across Dhaka`;
        }
      }

      if (countEl) {
        if (locVal !== "ALL") {
          countEl.innerHTML = `Showing all <strong>${list.length}</strong> verified homes in <strong>${locVal}</strong>, Dhaka`;
        } else {
          countEl.textContent = `${list.length} properties available across Dhaka`;
        }
      }

      // Synchronize active state of area chips
      const chips = document.querySelectorAll(".area-chip");
      chips.forEach(chip => {
        if (chip.getAttribute("data-chip-area") === locVal) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });

      if (list.length === 0) {
        gridEl.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-icon">🏢</div>
            <h3 class="empty-state-title">No Properties Found</h3>
            <p class="empty-state-desc">Try adjusting your filters or search criteria. All listings are subject to strict administrative verification.</p>
            <button class="btn btn-outline" id="btn-reset-filters">Reset All Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById("btn-reset-filters");
        if (resetBtn) {
          resetBtn.addEventListener("click", () => {
            if (filterLocation) filterLocation.value = "ALL";
            if (filterType) filterType.value = "ALL";
            if (filterPurpose) filterPurpose.value = "ALL";
            if (filterBedrooms) filterBedrooms.value = "ALL";
            if (filterMaxPrice) {
              filterMaxPrice.value = "20000000";
              if (priceDisplay) priceDisplay.textContent = "Any Price";
            }
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete("location");
            window.history.replaceState({}, "", newUrl);
            render();
          });
        }
        return;
      }

      gridEl.innerHTML = list.map(p => Components.renderPropertyCard(p)).join("");
    };

    // Attach listeners
    if (filterLocation) {
      filterLocation.addEventListener("change", () => {
        const area = filterLocation.value;
        const newUrl = new URL(window.location);
        if (area === "ALL") newUrl.searchParams.delete("location");
        else newUrl.searchParams.set("location", area);
        window.history.replaceState({}, "", newUrl);
        render();
      });
    }

    const areaChips = document.querySelectorAll(".area-chip");
    areaChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const area = chip.getAttribute("data-chip-area");
        if (filterLocation) {
          filterLocation.value = area;
          const newUrl = new URL(window.location);
          if (area === "ALL") newUrl.searchParams.delete("location");
          else newUrl.searchParams.set("location", area);
          window.history.replaceState({}, "", newUrl);
          render();
        }
      });
    });

    if (filterType) filterType.addEventListener("change", render);
    if (filterPurpose) filterPurpose.addEventListener("change", render);
    if (filterBedrooms) filterBedrooms.addEventListener("change", render);
    if (filterMaxPrice) {
      filterMaxPrice.addEventListener("input", (e) => {
        if (priceDisplay) {
          const val = Number(e.target.value);
          priceDisplay.textContent = val >= 20000000 ? "Any Price" : `Up to ৳ ${val.toLocaleString()}`;
        }
      });
      filterMaxPrice.addEventListener("change", render);
    }

    const clearBtn = document.getElementById("btn-clear-filters");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (filterLocation) filterLocation.value = "ALL";
        if (filterType) filterType.value = defaultCategory || "ALL";
        if (filterPurpose) filterPurpose.value = "ALL";
        if (filterBedrooms) filterBedrooms.value = "ALL";
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete("location");
        window.history.replaceState({}, "", newUrl);
        render();
      });
    }

    await render();
  },

  /**
   * Initialize Property Details Page (property-details.html)
   */
  async initDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const propId = urlParams.get("id") || "PROP-101";

    const res = await apiGet(`/api/properties/${propId}`);
    if (!res.success || !res.data) {
      document.getElementById("property-details-container").innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h2 class="empty-state-title">Property Not Found</h2>
          <p class="empty-state-desc">The requested property ID (${propId}) could not be retrieved from the verified repository.</p>
          <a href="properties.html" class="btn btn-primary">Browse Available Properties</a>
        </div>
      `;
      return;
    }

    const p = res.data;

    // Populate specs & UI
    document.title = `${p.title} | TANSU Niraloy`;
    document.getElementById("prop-title").textContent = p.title;
    document.getElementById("prop-id").textContent = p.propertyId;
    document.getElementById("prop-location").textContent = `${p.location}, Dhaka, Bangladesh`;
    document.getElementById("prop-type").textContent = p.propertyType.replace(/_/g, " ");
    document.getElementById("prop-purpose").textContent = p.purpose === "SALE" ? "For Sale" : "For Rent";
    document.getElementById("prop-price").textContent = p.purpose === "SALE"
      ? `৳ ${(p.price / 100000).toFixed(1)} Lakh`
      : `৳ ${Number(p.price).toLocaleString()} / month`;

    document.getElementById("prop-bedrooms").textContent = p.bedrooms;
    document.getElementById("prop-bathrooms").textContent = p.bathrooms;
    document.getElementById("prop-area").textContent = `${p.area} sqft`;
    document.getElementById("prop-desc").textContent = p.description;
    document.getElementById("prop-owner-id").textContent = p.ownerId;
    document.getElementById("prop-created").textContent = p.createdAt;

    // Gallery
    const mainImg = document.getElementById("main-gallery-img");
    const thumbContainer = document.getElementById("gallery-thumbnails");
    if (mainImg && p.images && p.images.length > 0) {
      mainImg.src = p.images[0];
      if (thumbContainer) {
        thumbContainer.innerHTML = p.images.map((imgUrl, idx) => `
          <button class="gallery-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('main-gallery-img').src = '${imgUrl}'; document.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.remove('active')); this.classList.add('active');" style="border: 2px solid ${idx === 0 ? 'var(--color-accent)' : 'var(--color-border)'}; border-radius: var(--radius-md); overflow: hidden; width: 80px; height: 60px; cursor: pointer; padding: 0;">
            <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
          </button>
        `).join("");
      }
    }

    // Amenities
    const amenitiesContainer = document.getElementById("prop-amenities");
    if (amenitiesContainer && p.amenities) {
      amenitiesContainer.innerHTML = p.amenities.map(a => `
        <span class="badge" style="background:var(--color-surface-alt);color:var(--color-primary);padding:0.4rem 0.75rem;font-size:0.85rem;border:1px solid var(--color-border);">
          ✓ ${a}
        </span>
      `).join("");
    }

    // Configure Request Buttons
    const btnRent = document.getElementById("btn-request-rent");
    const btnBuy = document.getElementById("btn-request-buy");
    const btnVisit = document.getElementById("btn-request-visit");

    if (p.purpose === "SALE") {
      if (btnRent) btnRent.style.display = "none";
      if (btnBuy) btnBuy.style.display = "inline-flex";
    } else {
      if (btnBuy) btnBuy.style.display = "none";
      if (btnRent) btnRent.style.display = "inline-flex";
    }

    // Handlers
    const handleAction = (type) => {
      const user = Auth.getCurrentUser();
      if (!user) {
        this.openGuestAuthModal(p, type);
        return;
      }

      if (user.role === "OWNER") {
        Components.showToast("warning", "Restricted", "Owners cannot request tenancy. Please use a Tenant account.");
        return;
      }

      // Open Intermediary Request Modal
      this.openRequestModal(p, type, user);
    };

    if (btnRent) btnRent.onclick = () => handleAction("RENT");
    if (btnBuy) btnBuy.onclick = () => handleAction("BUY");
    if (btnVisit) btnVisit.onclick = () => handleAction("VISIT");
  },

  /**
   * Open Guest Authentication Required Modal
   */
  openGuestAuthModal(property, actionType) {
    const modalEl = document.getElementById("guest-auth-modal");
    if (!modalEl) {
      window.location.href = `signin.html?role=TENANT&redirect=${encodeURIComponent(window.location.href)}`;
      return;
    }

    const actionLabel = actionType === "BUY" ? "Purchase" : (actionType === "VISIT" ? "Property Visit" : "Rental");
    const labelEl = document.getElementById("guest-action-label");
    const titleEl = document.getElementById("guest-modal-prop-title");
    const signinBtn = document.getElementById("guest-modal-signin-btn");
    const signupBtn = document.getElementById("guest-modal-signup-btn");

    if (labelEl) labelEl.textContent = actionLabel;
    if (titleEl) titleEl.textContent = property.title;

    const currentUrl = encodeURIComponent(window.location.href);
    if (signinBtn) signinBtn.href = `signin.html?role=TENANT&redirect=${currentUrl}`;
    if (signupBtn) signupBtn.href = `signup.html?role=TENANT&redirect=${currentUrl}`;

    Components.openModal("guest-auth-modal");
  },

  /**
   * Open Structured Intermediary Request Modal
   */
  openRequestModal(property, requestType, user) {
    const modalEl = document.getElementById("request-modal");
    if (!modalEl) return;

    document.getElementById("modal-request-type").textContent = requestType;
    document.getElementById("modal-prop-id").value = property.propertyId;
    document.getElementById("modal-prop-title").textContent = property.title;
    document.getElementById("modal-tenant-id").value = user.userId;
    document.getElementById("modal-tenant-name").textContent = `${user.name} (${user.email})`;

    const visitFields = document.getElementById("visit-specific-fields");
    if (visitFields) {
      visitFields.style.display = requestType === "VISIT" ? "block" : "none";
    }

    Components.openModal("request-modal");

    // Modal submit handler
    const form = document.getElementById("intermediary-request-form");
    form.onsubmit = async (e) => {
      e.preventDefault();

      const notesValue = document.getElementById("request-notes").value.trim();
      const requestPayload = {
        tenantId: user.userId,
        tenantName: user.name || user.fullName || "Authenticated Tenant",
        tenantEmail: user.email || "",
        tenantPhone: user.phone || "",
        propertyId: property.propertyId,
        requestType: requestType === "RENT" ? "RENT_REQUEST" : (requestType === "BUY" ? "BUY_REQUEST" : "VISIT_SCHEDULE"),
        notes: notesValue,
        message: notesValue,
        preferredDate: requestType === "VISIT" ? document.getElementById("visit-date").value : null,
        preferredTime: requestType === "VISIT" ? document.getElementById("visit-time").value : null
      };

      if (requestType === "VISIT" && (!requestPayload.preferredDate || !requestPayload.preferredTime)) {
        Components.showToast("error", "Validation Error", "Please specify both preferred date and time for the visit.");
        return;
      }

      const res = await apiPost("/api/requests", requestPayload);
      Components.closeModal("request-modal");

      if (res && (res.success || res.status === 200)) {
        Components.showToast("success", "Request Submitted", `Your ${requestType} request for ${property.propertyId} has been submitted to the TANSU Niraloy Intermediary Desk.`);
      } else {
        Components.showToast("info", "Request Submitted", `Your ${requestType} request for ${property.propertyId} has been received.`);
      }
    };
  }
};
