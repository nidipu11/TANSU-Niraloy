const fs = require('fs');

// 1. Enlarge Logo
let cssPath = 'css/components.css';
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/width: 38px;\s*height: 38px;/g, 'width: 50px;\n    height: 50px;');
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Logo size increased in css/components.css');

// Just to be sure, check style.css
let stylePath = 'css/style.css';
let style = fs.readFileSync(stylePath, 'utf8');
style = style.replace(/width: 38px;\s*height: 38px;/g, 'width: 50px;\n    height: 50px;');
fs.writeFileSync(stylePath, style, 'utf8');

// 2. Remove any lingering metric-icon divs across all HTML files
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  
  // Remove metric-icon blocks
  html = html.replace(/<div class="metric-icon[^>]*>[\s\S]*?<\/div>/g, '');
  
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    console.log(`Cleaned metric icons from ${file}`);
  }
}
