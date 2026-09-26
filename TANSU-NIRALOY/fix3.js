const fs = require('fs');

// 1. Remove metric icons and weird chars from HTML files
const files = fs.readdirSync('.');
for (const file of files) {
  if (file.endsWith('.html')) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/<div class="metric-icon"[\s\S]*?<\/div>/g, '');
    html = html.replace(/<span>dY _ /g, '<span>');
    html = html.replace(/<span>dY>,\? /g, '<span>');
    html = html.replace(/<span>dY>,\?\? /g, '<span>');
    
    // Fix weird chars if they appear differently
    html = html.replace(/dY _ /g, '');
    html = html.replace(/dY>,\?/g, '');
    html = html.replace(/dY>,\?\?/g, '');
    
    if (file === 'owner-dashboard.html') {
      html = html.replace('<span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-weight: 700; color: var(--color-text-muted);">BDT </span>', '');
      html = html.replace('padding-left: 28px;', 'padding-left: 12px;');
    }
    fs.writeFileSync(file, html, 'utf8');
  }
}

// 2. Admin Sidebar Counts
let adminJs = fs.readFileSync('js/admin.js', 'utf8');
const countLogic = `
  async updateSidebarCounts() {
    try {
      const pendingProps = (await apiGet("/api/admin/listings/pending")).data || [];
      const navVerify = document.querySelector('a[href="admin-verify-listings.html"] span');
      if (navVerify) navVerify.innerHTML = 'Verify Listings' + (pendingProps.length > 0 ? ' <strong>( ' + pendingProps.length + ' )</strong>' : '');

      const reqsRes = (await apiGet("/api/admin/requests")).data || [];
      const pendingRentals = reqsRes.filter(r => r.requestType === "RENTAL" && r.status === "PENDING").length;
      const pendingPurchases = reqsRes.filter(r => r.requestType === "PURCHASE" && r.status === "PENDING").length;
      const pendingVisits = reqsRes.filter(r => r.requestType === "VISIT" && r.status === "PENDING").length;

      const navRent = document.querySelector('a[href="admin-rental-requests.html"] span');
      if (navRent) navRent.innerHTML = 'Rental Requests' + (pendingRentals > 0 ? ' <strong>( ' + pendingRentals + ' )</strong>' : '');

      const navPurchase = document.querySelector('a[href="admin-purchase-requests.html"] span');
      if (navPurchase) navPurchase.innerHTML = 'Purchase Requests' + (pendingPurchases > 0 ? ' <strong>( ' + pendingPurchases + ' )</strong>' : '');

      const navVisit = document.querySelector('a[href="admin-visit-requests.html"] span');
      if (navVisit) navVisit.innerHTML = 'Visit Requests' + (pendingVisits > 0 ? ' <strong>( ' + pendingVisits + ' )</strong>' : '');
    } catch(e){}
  },
`;

if (!adminJs.includes('updateSidebarCounts() {')) {
  adminJs = adminJs.replace('initDashboard() {', countLogic + '\n  initDashboard() {');
  adminJs = adminJs.replace(/initDashboard\(\) \{/g, 'initDashboard() {\n    this.updateSidebarCounts();');
  adminJs = adminJs.replace(/loadVerificationQueue\(\) \{/g, 'loadVerificationQueue() {\n    this.updateSidebarCounts();');
  adminJs = adminJs.replace(/loadRentalQueue\(\) \{/g, 'loadRentalQueue() {\n    this.updateSidebarCounts();');
  adminJs = adminJs.replace(/loadPurchaseQueue\(\) \{/g, 'loadPurchaseQueue() {\n    this.updateSidebarCounts();');
  adminJs = adminJs.replace(/loadVisitQueue\(\) \{/g, 'loadVisitQueue() {\n    this.updateSidebarCounts();');
  fs.writeFileSync('js/admin.js', adminJs, 'utf8');
}

// 3. Tenant Dashboard Purchase rendering
let tenantJs = fs.readFileSync('js/tenant.js', 'utf8');
tenantJs = tenantJs.replace(
  "approvedReq = reqs.find(r => r.status === 'APPROVED' && (r.requestType || '').includes('RENT'));",
  "approvedReq = reqs.find(r => r.status === 'APPROVED' && ((r.requestType || '').includes('RENT') || (r.requestType || '').includes('PURCHASE')));"
);
// Make sure it says Purchase Verified & Active for purchases
tenantJs = tenantJs.replace(
  '<span class="badge badge-verified">Lease Verified &amp; Active</span>',
  '<span class="badge badge-verified">${approvedReq && (approvedReq.requestType || \'\').includes(\'PURCHASE\') ? \'Purchase Verified &amp; Active\' : \'Lease Verified &amp; Active\'}</span>'
);
tenantJs = tenantJs.replace(
  '<div class="text-muted" style="font-size: 0.8rem;">Monthly Base Rent</div>',
  '<div class="text-muted" style="font-size: 0.8rem;">${approvedReq && (approvedReq.requestType || \'\').includes(\'PURCHASE\') ? \'Purchased Amount\' : \'Monthly Base Rent\'}</div>'
);
fs.writeFileSync('js/tenant.js', tenantJs, 'utf8');

console.log('fix3.js complete');
