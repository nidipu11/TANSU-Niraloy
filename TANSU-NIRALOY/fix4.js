const fs = require('fs');
let content = fs.readFileSync('js/admin.js', 'utf8');

const injectHooks = [
  'async loadVerifiedProperties() {', 
  'async loadRequestsQueue(filterType = "ALL") {', 
  'async initFinanceHub() {', 
  'async processRequest(requestId, action) {', 
  'async verifyListing(propertyId) {', 
  'async rejectListing(propertyId) {'
];

injectHooks.forEach(hook => {
  if (content.includes(hook) && !content.includes(hook + '\n    this.updateSidebarCounts();')) {
    content = content.replace(hook, hook + '\n    this.updateSidebarCounts();');
  }
});

fs.writeFileSync('js/admin.js', content, 'utf8');
console.log('Injected safely');
