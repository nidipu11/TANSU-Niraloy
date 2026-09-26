const fs = require('fs');
let html = fs.readFileSync('payment-success.html', 'utf8');
html = html.replace(/<!-- System Note -->[\s\S]*?<\/div>/, '');
// Also fix weird char at the end "Back to Dashboard"
html = html.replace(/Back to Dashboard[^<]*/g, 'Back to Dashboard');
fs.writeFileSync('payment-success.html', html, 'utf8');
console.log('Removed from payment-success.html');
