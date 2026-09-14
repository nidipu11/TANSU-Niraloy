/**
 * ==========================================================================
 * TANSU NIRALOY - REUSABLE SHARED COMPONENTS
 * Pure Vanilla JavaScript
 * Dynamically mounts Header, Footer, Toast notifications, Modals, and Role Helpers.
 * ==========================================================================
 */

const Components = {
  /**
   * Mount Global Header
   * @param {string} activePage - e.g. 'home', 'properties', 'family', 'bachelor', 'sale', 'premium'
   */
  mountHeader(activePage = "") {
    const headerPlaceholder = document.getElementById("site-header-container");
    if (!headerPlaceholder) return;

    const user = Auth.getCurrentUser();
    const isAuth = !!user;

    const navItems = [
      { id: "home", label: "Home", href: "index.html" },
      { id: "properties", label: "All Properties", href: "properties.html" },
      { id: "family", label: "Family House", href: "family-house.html" },
      { id: "bachelor", label: "Bachelor House", href: "bachelor-house.html" },
      { id: "sale", label: "Flat Sale", href: "flat-sale.html" },
      { id: "premium", label: "Premium Housing", href: "premium-family.html" }
    ];

    let userDashboardUrl = "tenant-dashboard.html";
    if (user) {
      if (user.role === "OWNER") userDashboardUrl = "owner-dashboard.html";
      else if (user.role === "ADMIN") userDashboardUrl = "admin-dashboard.html";
    }

    const html = `
      <div class="intermediary-badge-banner" style="background: #0F1E36; border-bottom: 1px solid rgba(200, 157, 60, 0.3); padding: 0.35rem 1.25rem;">
        <div class="container flex justify-between items-center" style="font-size: 0.76rem; color: #E2E8F0;">
          <div class="flex items-center gap-2">
            <span>🛡️ <strong>TANSU Niraloy Intermediary Authority:</strong> Owner &amp; Tenant never transact directly. Centralized verification &amp; escort.</span>
          </div>
          <div class="flex items-center gap-3" style="color: #E2E8F0;">
            <a href="mailto:desk@tansu-niraloy.com.bd" style="color: #38BDF8; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.25rem;">
              ✉️ <span style="text-decoration: underline;">desk@tansu-niraloy.com.bd</span>
            </a>
            <span style="color: rgba(255,255,255,0.3);">|</span>
            <span style="color: #CBD5E1;">📞 01700-000000</span>
          </div>
        </div>
      </div>
      <header class="site-header">
        <div class="container header-inner">
          <a href="index.html" class="brand-logo" aria-label="TANSU Niraloy Home">
            <img src="assets/logo.svg" alt="TANSU Niraloy Building Architecture Logo" class="brand-logo-img">
            <div class="brand-text-wrap">
              <span class="brand-name">TANSU Niraloy</span>
              <span class="brand-tagline">Property Rental &amp; Sale Management System</span>
            </div>
          </a>

          <nav class="main-nav" id="main-nav-links">
            ${navItems.map(item => `
              <a href="${item.href}" class="nav-link ${activePage === item.id ? 'active' : ''}">
                ${item.label}
              </a>
            `).join("")}
          </nav>

          <div class="header-actions">
            ${!isAuth ? `
              <span class="guest-mode-tag">
                🌐 Guest Mode
              </span>
              <a href="signin.html" class="btn btn-sm btn-outline">Sign In</a>
              <a href="signup.html" class="btn btn-sm btn-primary">Sign Up</a>
            ` : `
              <div class="user-menu-wrap">
                <button class="avatar-btn" id="user-dropdown-trigger" aria-haspopup="true" aria-expanded="false">
                  <div class="avatar-img-placeholder">
                    ${user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span class="avatar-role-tag">${user.role}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <div class="dropdown-menu" id="user-dropdown-menu">
                  <div class="dropdown-header">
                    <div class="dropdown-user-name">${user.name || "Authenticated User"}</div>
                    <div class="dropdown-user-role">${user.role} &bull; ${user.userId || ''}</div>
                  </div>
                  <a href="${userDashboardUrl}" class="dropdown-item">
                    <span>📊 Dashboard</span>
                  </a>
                  <a href="profile.html" class="dropdown-item">
                    <span>👤 Profile Settings</span>
                  </a>
                  <div class="dropdown-divider"></div>
                  <button type="button" class="dropdown-item w-full text-left" id="btn-logout" style="border:none;background:none;cursor:pointer;color:var(--color-danger);">
                    <span>🚪 Sign Out</span>
                  </button>
                </div>
              </div>
            `}
            <button class="mobile-nav-toggle" id="mobile-nav-toggle" aria-label="Toggle navigation" style="display:none;">
              ☰
            </button>
          </div>
        </div>
      </header>
    `;

    headerPlaceholder.innerHTML = html;

    // Mobile nav toggle
    const toggleBtn = document.getElementById("mobile-nav-toggle");
    const navLinks = document.getElementById("main-nav-links");
    if (toggleBtn && navLinks) {
      if (window.innerWidth <= 768) toggleBtn.style.display = "block";
      toggleBtn.addEventListener("click", () => navLinks.classList.toggle("show"));
    }

    // Avatar Dropdown Toggle
    const dropdownTrigger = document.getElementById("user-dropdown-trigger");
    const dropdownMenu = document.getElementById("user-dropdown-menu");
    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.classList.toggle("show");
        dropdownTrigger.setAttribute("aria-expanded", isOpen);
      });

      // Click outside to close
      document.addEventListener("click", (e) => {
        if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.classList.remove("show");
          dropdownTrigger.setAttribute("aria-expanded", "false");
        }
      });

      const logoutBtn = document.getElementById("btn-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => Auth.logout());
      }
    }
  },

  /**
   * Mount Global Footer
   */
  mountFooter() {
    const footerPlaceholder = document.getElementById("site-footer-container");
    if (!footerPlaceholder) return;

    const html = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <div class="brand-logo" style="margin-bottom: 1rem;">
                <img src="assets/logo.svg" alt="TANSU Niraloy Building Architecture Logo" class="brand-logo-img">
                <div class="brand-text-wrap">
                  <span class="brand-name" style="color:#FFFFFF;">TANSU Niraloy</span>
                  <span class="brand-tagline" style="color:var(--color-accent-light);">Property Rental &amp; Sale Management System</span>
                </div>
              </div>
              <p style="font-size:0.9rem;color:#94A3B8;line-height:1.6;">
                Centralized Property Rental & Property Sale Management Platform. Mediating transparent, legally vetted, and secure property deals across Dhaka, Bangladesh.
              </p>
              <div style="font-size:0.85rem;color:#64748B;margin-top:1rem;">
                📍 Gulshan-2, Dhaka-1212, Bangladesh<br>
                📞 Intermediary Desk: +880 2 9876543<br>
                ✉️ desk@tansu-niraloy.com.bd
              </div>
            </div>

            <div class="footer-col">
              <h4>Property Categories</h4>
              <ul class="footer-links">
                <li><a href="family-house.html">Family Houses</a></li>
                <li><a href="bachelor-house.html">Bachelor Accommodations</a></li>
                <li><a href="flat-sale.html">Flats & Apartments for Sale</a></li>
                <li><a href="premium-family.html">Premium Luxury Housing</a></li>
                <li><a href="properties.html">All Available Listings</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Portals & Governance</h4>
              <ul class="footer-links">
                <li><a href="signin.html">Tenant Portal</a></li>
                <li><a href="signin.html">Owner Portal</a></li>
                <li><a href="signin.html">Admin Central Desk</a></li>
                <li><a href="payment.html">Payment Gateway Checkout</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>Intermediary Guarantee</h4>
              <p style="font-size:0.85rem;color:#94A3B8;">
                Owner and Tenant never transact directly. Every listing undergoes mandatory verification, visit scheduling is escorted, and payments are securely cleared via official settlement accounts.
              </p>
              <div style="background:rgba(255,255,255,0.05);padding:0.75rem;border-radius:var(--radius-md);border:1px solid rgba(255,255,255,0.1);font-size:0.78rem;color:#CBD5E1;">
                🔒 SSL Encrypted &bull; RAJUK Verified Records &bull; Java Backend Ready
              </div>
            </div>
          </div>

          <div class="footer-bottom">
            <div>&copy; ${new Date().getFullYear()} TANSU Niraloy. All rights reserved. Built with Pure Vanilla Web Standards.</div>
            <div class="flex gap-4">
              <span>Dhaka City Urban Real Estate Authority</span>
              <span>&bull;</span>
              <span>Java Spring Boot Architecture</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    footerPlaceholder.innerHTML = html;
  },

  /**
   * Toast Notification Helper
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {string} title
   * @param {string} message
   */
  showToast(type = "info", title = "Notification", message = "") {
    let container = document.getElementById("tansu-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "tansu-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <p class="toast-message">${message}</p>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  /**
   * Modal Open Helper
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  },

  /**
   * Modal Close Helper
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  },

  /**
   * Render Standard Property Card
   * @param {object} p - Property Object
   * @returns {string} HTML string
   */
  renderPropertyCard(p) {
    const formattedPrice = p.purpose === "SALE"
      ? `৳ ${(p.price / 100000).toFixed(1)} Lakh`
      : `৳ ${Number(p.price).toLocaleString()} <small>/ month</small>`;

    const purposeBadgeClass = p.purpose === "SALE" ? "badge-sale" : "badge-rent";
    const purposeLabel = p.purpose === "SALE" ? "For Sale" : "For Rent";

    return `
      <div class="property-card" data-property-id="${p.propertyId}">
        <div class="property-card-img-wrap">
          <img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600'}" alt="${p.title}" class="property-card-img" loading="lazy">
          <div class="property-badges-overlay">
            <span class="badge ${purposeBadgeClass}">${purposeLabel}</span>
            <span class="badge badge-verified">✓ ${p.verificationStatus === 'VERIFIED' ? 'Verified' : 'Review'}</span>
          </div>
        </div>
        <div class="property-card-body">
          <div class="property-price">${formattedPrice}</div>
          <h3 class="property-title" title="${p.title}">
            <a href="property-details.html?id=${p.propertyId}" style="color:inherit;">${p.title}</a>
          </h3>
          <div class="property-location">
            <span>📍</span>
            <span>${p.location}, Dhaka</span>
          </div>
          <div class="property-specs">
            <span class="property-spec-item">🛏️ ${p.bedrooms} Beds</span>
            <span class="property-spec-item">🚿 ${p.bathrooms} Baths</span>
            <span class="property-spec-item">📐 ${p.area} sqft</span>
          </div>
          <div class="property-card-footer">
            <span class="badge badge-available" style="font-size:0.7rem;">${p.propertyType.replace(/_/g, ' ')}</span>
            <a href="property-details.html?id=${p.propertyId}" class="btn btn-sm btn-outline-primary">
              View Details &rarr;
            </a>
          </div>
        </div>
      </div>
    `;
  }
};
