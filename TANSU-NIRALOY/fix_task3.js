const fs = require('fs');

const source = 'C:/Users/Nurul Islam Dipu/.gemini/antigravity/brain/f8ab123e-d9c5-4aac-9a97-6ba10f7c2c86/.user_uploaded/media_1790275578863.png';
const target = 'assets/logo.png';

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

fs.copyFileSync(source, target);

['js/components.js', 'admin-finance.html', 'signin.html', 'signup.html'].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/assets\/logo\.svg/g, 'assets/logo.png');
    // adjust sizing for the new logo shape slightly in auth pages
    content = content.replace(/width: 52px; height: 52px;/g, 'height: 64px;');
    fs.writeFileSync(file, content, 'utf8');
  }
});

// Also remove emojis from tenant-dashboard.html sidebar
let tenantDash = fs.readFileSync('tenant-dashboard.html', 'utf8');
tenantDash = tenantDash.replace(/<span.*?>.*?Payments &amp; Receipts<\/span>/g, '<span>Payments &amp; Receipts</span>');
tenantDash = tenantDash.replace(/<span.*?>.*?Support &amp; Complaints<\/span>/g, '<span>Support &amp; Complaints</span>');
tenantDash = tenantDash.replace(/🧾|🛠️|📢|📞/g, '');
fs.writeFileSync('tenant-dashboard.html', tenantDash, 'utf8');

console.log('Done script 3');
