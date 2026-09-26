const fs = require('fs');

// 1. Admin View Details Button
let adminJs = fs.readFileSync('js/admin.js', 'utf8');
adminJs = adminJs.replace(
  /<button class="btn btn-sm btn-primary" onclick="AdminController\.verifyListing\('\$\{p\.propertyId\}'\)">Approve<\/button>/g,
  '<a href="property-details.html?id=${p.propertyId}&preview=true" target="_blank" class="btn btn-sm btn-outline">View Details</a> <button class="btn btn-sm btn-primary" onclick="AdminController.verifyListing(\'${p.propertyId}\')">Approve</button>'
);
fs.writeFileSync('js/admin.js', adminJs, 'utf8');

// 2. Remove Tenant column from Owner dashboard HTML
let ownerHtml = fs.readFileSync('owner-dashboard.html', 'utf8');
ownerHtml = ownerHtml.replace('<th>Tenant / Buyer</th>', '');

// Also add styles for smaller metric amounts
if (!ownerHtml.includes('.metric-value-adjusted')) {
  ownerHtml = ownerHtml.replace('</head>', `
<style>
  .metric-card { padding: 1.25rem !important; }
  .metric-value { font-size: 1.5rem !important; font-weight: 700 !important; }
  .metric-label { font-size: 0.75rem !important; text-transform: uppercase; letter-spacing: 0.5px; }
  .metric-subtext { font-size: 0.65rem !important; }
</style>
</head>`);
}
fs.writeFileSync('owner-dashboard.html', ownerHtml, 'utf8');

// 3. Remove Tenant column from Owner JS
let ownerJs = fs.readFileSync('js/owner.js', 'utf8');
ownerJs = ownerJs.replace(/<td><strong>\$\{item\.tenant\}<\/strong><\/td>/g, '');
fs.writeFileSync('js/owner.js', ownerJs, 'utf8');

console.log('Fixed admin, owner html and owner js');
