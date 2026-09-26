const fs = require('fs');
const content = fs.readFileSync('js/properties.js', 'utf8');
const lines = content.split('\n');
for(let i=0; i<lines.length; i++){
  if (lines[i].includes('renderPropertyGrid(')) {
    console.log(lines.slice(Math.max(0, i-5), i+5).join('\n'));
  }
}
