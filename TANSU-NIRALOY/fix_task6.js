const fs = require('fs');
let content = fs.readFileSync('js/api.js', 'utf8');

const cleanupCode = `
    // Purge PROP-8288 if it exists in local storage
    if (localStorage.getItem("tansu_properties")) {
      let props = JSON.parse(localStorage.getItem("tansu_properties"));
      let origLen = props.length;
      props = props.filter(p => p.propertyId !== "PROP-8288");
      if (props.length < origLen) localStorage.setItem("tansu_properties", JSON.stringify(props));
    }
    if (localStorage.getItem("tansu_settlements")) {
      let sets = JSON.parse(localStorage.getItem("tansu_settlements"));
      let origLen = sets.length;
      sets = sets.filter(s => s.propertyId !== "PROP-8288");
      
      // Also retroactively fix existing settlements missing totalCollected
      sets = sets.map(s => {
        if (!s.totalCollected && (s.type === 'RENTAL_INCOME' || s.type === 'SALE_PROCEEDS')) {
           const collected = s.entitledAmount; // they mistakenly saved 100% here
           return {
             ...s,
             totalCollected: collected,
             systemCommission: collected * 0.2,
             commissionRate: "20%",
             entitledAmount: collected * 0.8,
             disbursed: s.disbursed > 0 ? (collected * 0.8) : 0,
             remaining: s.remaining > 0 ? (collected * 0.8) : 0
           };
        }
        return s;
      });

      localStorage.setItem("tansu_settlements", JSON.stringify(sets));
    }
    if (localStorage.getItem("tansu_requests")) {
      let reqs = JSON.parse(localStorage.getItem("tansu_requests"));
      let origLen = reqs.length;
      reqs = reqs.filter(r => r.propertyId !== "PROP-8288");
      if (reqs.length < origLen) localStorage.setItem("tansu_requests", JSON.stringify(reqs));
    }
`;

// Replace the previous cleanup code with this upgraded one
content = content.replace(/\/\/ Purge PROP-8288[\s\S]*?if \(reqs\.length < origLen\) localStorage\.setItem\("tansu_requests", JSON\.stringify\(reqs\)\);\n    }/, cleanupCode);

fs.writeFileSync('js/api.js', content, 'utf8');
console.log('Upgraded cleanup logic in api.js');
