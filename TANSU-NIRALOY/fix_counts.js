const fs = require('fs');

// 1. Remove (5) from area chips in properties.html
let props = fs.readFileSync('properties.html', 'utf8');
props = props.replace(/Gulshan \(5\)/g, 'Gulshan');
props = props.replace(/Banani \(5\)/g, 'Banani');
props = props.replace(/Dhanmondi \(5\)/g, 'Dhanmondi');
props = props.replace(/Bashundhara \(5\)/g, 'Bashundhara');
props = props.replace(/Mirpur \(5\)/g, 'Mirpur');
props = props.replace(/Uttara \(5\)/g, 'Uttara');
props = props.replace(/Mohammadpur \(5\)/g, 'Mohammadpur');
fs.writeFileSync('properties.html', props, 'utf8');

// 2. Remove "5 Homes" from index.html area cards just in case
let idx = fs.readFileSync('index.html', 'utf8');
idx = idx.replace(/<span class="area-card-badge">5 Homes<\/span>/g, '<span class="area-card-badge"></span>');
// Also remove the "35 Homes"
idx = idx.replace(/<span class="area-card-badge">35 Homes<\/span>/g, '<span class="area-card-badge"></span>');
// Disable updateAreaCounts in index.html
idx = idx.replace(/badge\.textContent = \`\$\{count\} Homes\`;/g, 'badge.style.display = "none";');
idx = idx.replace(/allCard\.textContent = \`\$\{totalVerified\} Homes\`;/g, 'allCard.style.display = "none";');
fs.writeFileSync('index.html', idx, 'utf8');

// 3. Make JS NOT append counts
let js = fs.readFileSync('js/properties.js', 'utf8');
js = js.replace(/chip\.textContent = \`\$\{area\} \(\$\{count\}\)\`;/g, 'chip.textContent = area;');
js = js.replace(/chip\.textContent = \`All Zones \(\$\{verifiedProps\.length\}\)\`;/g, 'chip.textContent = "All Zones";');
fs.writeFileSync('js/properties.js', js, 'utf8');

// 4. Fix bachelor and family house filter-purpose
const fixPurpose = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<select id="filter-purpose" class="form-select">\s*<option value="RENT">Rent Only<\/option>\s*<\/select>/g,
    '<select id="filter-purpose" class="form-select"><option value="ALL">Rent & Sale</option><option value="RENT">Rent</option><option value="SALE">Sale</option></select>'
  );
  fs.writeFileSync(file, content, 'utf8');
};
fixPurpose('bachelor-house.html');
fixPurpose('family-house.html');

console.log('Removed all hardcoded area counts and fixed purpose filters');
