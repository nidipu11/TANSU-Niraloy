const fs = require('fs');
let content = fs.readFileSync('js/api.js', 'utf8');

const oldLogic = `if (params.location && params.location !== "ALL") {
          filtered = filtered.filter(p => p.location.toLowerCase() === params.location.toLowerCase());
        }
        if (params.propertyType && params.propertyType !== "ALL") {
          filtered = filtered.filter(p => p.propertyType === params.propertyType);
        }
        if (params.purpose && params.purpose !== "ALL") {
          filtered = filtered.filter(p => p.purpose === params.purpose);
        }`;

const newLogic = `if (params.location && params.location !== "ALL") {
          filtered = filtered.filter(p => (p.location || "").trim().toLowerCase() === params.location.trim().toLowerCase());
        }
        if (params.propertyType && params.propertyType !== "ALL") {
          filtered = filtered.filter(p => (p.propertyType || "").trim().toUpperCase() === params.propertyType.trim().toUpperCase());
        }
        if (params.purpose && params.purpose !== "ALL") {
          filtered = filtered.filter(p => (p.purpose || "").trim().toUpperCase() === params.purpose.trim().toUpperCase());
        }`;

if (content.includes(oldLogic)) {
  content = content.replace(oldLogic, newLogic);
  fs.writeFileSync('js/api.js', content, 'utf8');
  console.log('Replaced filter logic successfully');
} else {
  console.log('Could not find old logic, trying fallback');
  
  // Just in case it's slightly different formatting:
  // Let's use regex
  const regex = /if\s*\(params\.location\s*&&\s*params\.location\s*!==\s*"ALL"\)\s*\{\s*filtered\s*=\s*filtered\.filter\(p\s*=>\s*p\.location\.toLowerCase\(\)\s*===\s*params\.location\.toLowerCase\(\)\);\s*\}/g;
  
  if (regex.test(content)) {
     content = content.replace(regex, `if (params.location && params.location !== "ALL") {
          filtered = filtered.filter(p => (p.location || "").trim().toLowerCase() === params.location.trim().toLowerCase());
        }`);
     console.log('Replaced location logic via regex');
  }
  
  const regex2 = /if\s*\(params\.propertyType\s*&&\s*params\.propertyType\s*!==\s*"ALL"\)\s*\{\s*filtered\s*=\s*filtered\.filter\(p\s*=>\s*p\.propertyType\s*===\s*params\.propertyType\);\s*\}/g;
  if (regex2.test(content)) {
     content = content.replace(regex2, `if (params.propertyType && params.propertyType !== "ALL") {
          filtered = filtered.filter(p => (p.propertyType || "").trim().toUpperCase() === params.propertyType.trim().toUpperCase());
        }`);
     console.log('Replaced propertyType logic via regex');
  }
  
  fs.writeFileSync('js/api.js', content, 'utf8');
}

// Also check updateAreaCounts in index.html to ensure it matches case
let indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('countByArea[loc] = (countByArea[loc] || 0) + 1;')) {
    indexHtml = indexHtml.replace(
        'countByArea[loc] = (countByArea[loc] || 0) + 1;',
        'const key = loc.trim(); countByArea[key] = (countByArea[key] || 0) + 1;'
    );
    indexHtml = indexHtml.replace(
        'const count = countByArea[area] || 0;',
        'const count = countByArea[area.trim()] || 0;'
    );
    fs.writeFileSync('index.html', indexHtml, 'utf8');
    console.log('Updated index.html counts');
}

