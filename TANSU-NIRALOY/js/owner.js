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
   * If a property was rejected or removed by Admin:
   *  - verificationStatus is displayed as REJECTED (badge-rejected)
   *  - availability is displayed as INACTIVE (badge-rejected)
   * Only VERIFIED / APPROVED properties count toward verified KPIs and public listing.
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
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">You haven\'t listed any properties yet.</td></tr>';
        return;
      }

      tableBody.innerHTML = properties.map(p => {
        let statusBadge = '';
        if (p.status === 'REJECTED' || p.verificationStatus === 'REJECTED') {
            statusBadge = '<span class="badge badge-rejected">REJECTED</span>';
        } else if (p.status === 'APPROVED' || p.verificationStatus === 'VERIFIED') {
            statusBadge = '<span class="badge badge-success">VERIFIED</span>';
        } else {
            statusBadge = '<span class="badge badge-warning">PENDING</span>';
        }

        const isInactive = p.availabilityStatus === 'INACTIVE';
        const availBadge = isInactive 
            ? '<span class="badge badge-rejected">INACTIVE</span>' 
            : '<span class="badge badge-success">ACTIVE</span>';
            
        const toggleBtn = isInactive 
            ? `<button class="btn btn-sm btn-outline" onclick="OwnerController.togglePropertyStatus('${p.propertyId}', 'AVAILABLE')">Activate</button>`
            : `<button class="btn btn-sm btn-outline" onclick="OwnerController.togglePropertyStatus('${p.propertyId}', 'INACTIVE')">Deactivate</button>`;

        return `
        <tr>
          <td>
            <div style="font-weight:700; color:var(--color-primary);">${p.propertyId}</div>
            <div style="font-size:0.85rem; color:var(--color-text-muted);">${p.location || ''}</div>
          </td>
          <td>${p.title}</td>
          <td>${p.purpose === 'SALE' ? 'PROPERTY SALE' : 'RENTAL LEASE'}</td>
          <td><strong>BDT ${p.price ? p.price.toLocaleString() : 0}</strong> ${p.purpose === 'SALE' ? '' : '/ month'}</td>
          <td>${statusBadge}</td>
          <td>${availBadge}</td>
          <td>
            <div class="flex gap-1">
              ${toggleBtn}
              <button class="btn btn-sm btn-outline" style="color:var(--color-danger); border-color:var(--color-danger);" onclick="OwnerController.deleteProperty('${p.propertyId}')">Remove</button>
            </div>
          </td>
        </tr>`;
      }).join('');
    } catch (e) {
      console.warn('Error loading properties:', e);
      if (tableBody) tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Failed to load properties.</td></tr>';
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


