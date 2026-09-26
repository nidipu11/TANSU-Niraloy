const fs = require('fs');

// 1. Fix owner-dashboard.html input
let dash = fs.readFileSync('owner-dashboard.html', 'utf8');
dash = dash.replace(
  /<input type="number" id="withdraw-amount" class="form-control" placeholder="Enter amount to withdraw \(e.g\. 45000\)" style="padding-left: 12px;" required min="500">/g,
  '<input type="number" id="withdraw-amount" class="form-control" placeholder="e.g. 45000" style="padding: 10px;" required>'
);
// Make sure "BDT " label is clean
dash = dash.replace(/Withdrawal Amount \(BDT \)/g, 'Withdrawal Amount (BDT)');
fs.writeFileSync('owner-dashboard.html', dash, 'utf8');

// 2. Fix owner.js min/max logic to be foolproof
let owner = fs.readFileSync('js/owner.js', 'utf8');
owner = owner.replace(
  /amountInput\.max = this\._availableBalance; if \(this\._availableBalance < 500\) \{ amountInput\.min = 0; amountInput\.disabled = true; \} else \{ amountInput\.min = 500; amountInput\.disabled = false; \}/g,
  `amountInput.max = Math.max(0, this._availableBalance);
        if (this._availableBalance < 500) {
          amountInput.min = 0;
          amountInput.disabled = true;
          amountInput.value = 0;
        } else {
          amountInput.min = 500;
          amountInput.disabled = false;
        }`
);
fs.writeFileSync('js/owner.js', owner, 'utf8');

// 3. Fix the Filtering bug by enforcing upper case matching on propertyType and resolving 'Bashundhara' vs 'Bashundhara R/A' in owner-add-property
let addProp = fs.readFileSync('owner-add-property.html', 'utf8');
addProp = addProp.replace(/<option value="Bashundhara R\/A">Bashundhara R\/A<\/option>/g, '<option value="Bashundhara">Bashundhara</option>');
// Fix Premium Housing value to match
addProp = addProp.replace(/<option value="PREMIUM_FAMILY_HOUSING">Premium Family Housing<\/option>/g, '<option value="PREMIUM_FAMILY_HOUSING">Premium Housing</option>');
fs.writeFileSync('owner-add-property.html', addProp, 'utf8');

console.log('Fixed owner dashboard, owner.js, and owner-add-property.html');
