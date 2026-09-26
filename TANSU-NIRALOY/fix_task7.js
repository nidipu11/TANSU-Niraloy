const fs = require('fs');
const path = require('path');

const source = 'C:/Users/Nurul Islam Dipu/.gemini/antigravity/brain/f8ab123e-d9c5-4aac-9a97-6ba10f7c2c86/.user_uploaded/media_1790277603866.jpg';
const target = 'assets/logo.jpg';

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}

fs.copyFileSync(source, target);

// Update references from logo.png (or logo.svg just in case) to logo.jpg
const dir = '.';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    if (content.includes('assets/logo.png')) {
      content = content.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
      changed = true;
    }
    if (content.includes('assets/logo.svg')) {
      content = content.replace(/assets\/logo\.svg/g, 'assets/logo.jpg');
      changed = true;
    }
    if (changed) {
      fs.writeFileSync(file, content, 'utf8');
    }
  }
});

let components = fs.readFileSync('js/components.js', 'utf8');
if (components.includes('assets/logo.png') || components.includes('assets/logo.svg')) {
  components = components.replace(/assets\/logo\.png/g, 'assets/logo.jpg');
  components = components.replace(/assets\/logo\.svg/g, 'assets/logo.jpg');
  fs.writeFileSync('js/components.js', components, 'utf8');
}

console.log('Logo updated to new JPG');
