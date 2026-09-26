const fs = require('fs');
let content = fs.readFileSync('js/api.js', 'utf8');

const regex = /entitledAmount: rent,\s*disbursed: 0,\s*remaining: rent,/;
const replacement = `totalCollected: rent,
              systemCommission: rent * 0.2,
              commissionRate: "20%",
              entitledAmount: rent * 0.8,
              disbursed: 0,
              remaining: rent * 0.8,`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('js/api.js', content, 'utf8');
  console.log('Fixed settlement calculation');
} else {
  console.log('Could not find target strings');
}
