const fs = require('fs');

// 1. Fix admin.js to show PURCHASE requests in BUY tab
let admin = fs.readFileSync('js/admin.js', 'utf8');
admin = admin.replace(
  /if \(filterType === "BUY"\) return t\.includes\("BUY"\) \|\| t\.includes\("SALE"\);/g,
  'if (filterType === "BUY") return t.includes("BUY") || t.includes("SALE") || t.includes("PURCHASE");'
);
fs.writeFileSync('js/admin.js', admin, 'utf8');

// 2. Fix api.js to ensure SALE_PROCEEDS is properly formatted
// Actually api.js is fine. It already creates "SALE_PROCEEDS" settlement with the rent (price) value.
// Let's verify owner.js shows SALE_PROCEEDS as SALE PROCEEDS instead of RENTAL REMITTANCE.

let owner = fs.readFileSync('js/owner.js', 'utf8');
// Fix loadOwnerSettlements badges
owner = owner.replace(
  /\$\{isWithdrawal \? 'badge-rent' : 'badge-available'\}/g,
  "${isWithdrawal ? 'badge-rent' : (s.type === 'SALE_PROCEEDS' ? 'badge-sale' : 'badge-available')}"
);
owner = owner.replace(
  /\$\{isWithdrawal \? 'WITHDRAWAL REQUEST' : 'RENTAL REMITTANCE'\}/g,
  "${isWithdrawal ? 'WITHDRAWAL REQUEST' : (s.type === 'SALE_PROCEEDS' ? 'SALE PROCEEDS' : 'RENTAL REMITTANCE')}"
);

// In the amount column, it says:
// <div style="font-size:0.78rem; color:var(--color-text-muted); margin-bottom:0.15rem;">Listing Amount: <strong>BDT  ${totalCollected.toLocaleString()}</strong></div>
// <div style="font-size:0.78rem; color:var(--color-danger); margin-bottom:0.15rem;">Commission (${commissionRate}): − BDT  ${commission.toLocaleString()}</div>
// This is already perfectly fine for sales as well, as it shows total price and commission.

fs.writeFileSync('js/owner.js', owner, 'utf8');

console.log('Fixed admin.js and owner.js display bugs');
