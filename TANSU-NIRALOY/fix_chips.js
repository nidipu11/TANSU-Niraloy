const fs = require('fs');

let content = fs.readFileSync('js/properties.js', 'utf8');

const updateChipsCode = `
      // Update area chips counts
      const allProps = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
      const verifiedProps = allProps.filter(p => p.verified === true || p.verificationStatus === "VERIFIED" || p.status === "VERIFIED");
      const countByArea = {};
      verifiedProps.forEach(p => {
        const loc = (p.location || "").trim();
        countByArea[loc] = (countByArea[loc] || 0) + 1;
      });
      document.querySelectorAll(".area-chip").forEach(chip => {
        const area = chip.getAttribute("data-chip-area");
        if (area === "ALL") {
          chip.textContent = \`All Zones (\${verifiedProps.length})\`;
        } else if (area) {
          const count = countByArea[area] || 0;
          chip.textContent = \`\${area} (\${count})\`;
        }
      });
`;

if (!content.includes('// Update area chips counts')) {
  // Insert it after `gridEl.innerHTML = list.map...` inside `render()`
  content = content.replace(
    /gridEl\.innerHTML = list\.map\(p => Components\.renderPropertyCard\(p\)\)\.join\(""\);/g,
    `gridEl.innerHTML = list.map(p => Components.renderPropertyCard(p)).join("");\n${updateChipsCode}`
  );
  fs.writeFileSync('js/properties.js', content, 'utf8');
  console.log('Added updateChipsCode to properties.js');
} else {
  console.log('Already exists');
}
