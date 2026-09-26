const fs = require('fs');
const content = fs.readFileSync('js/owner.js', 'utf8');
const index = content.indexOf('property-type');
if (index !== -1) {
  console.log(content.substring(index - 200, index + 500));
}
