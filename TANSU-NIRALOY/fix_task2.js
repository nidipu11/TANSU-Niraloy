const fs = require('fs');
let apiJs = fs.readFileSync('js/api.js', 'utf8');

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
      if (sets.length < origLen) localStorage.setItem("tansu_settlements", JSON.stringify(sets));
    }
    if (localStorage.getItem("tansu_requests")) {
      let reqs = JSON.parse(localStorage.getItem("tansu_requests"));
      let origLen = reqs.length;
      reqs = reqs.filter(r => r.propertyId !== "PROP-8288");
      if (reqs.length < origLen) localStorage.setItem("tansu_requests", JSON.stringify(reqs));
    }
`;

if (!apiJs.includes('PROP-8288')) {
  apiJs = apiJs.replace('_init() {', '_init() {' + cleanupCode);
  fs.writeFileSync('js/api.js', apiJs, 'utf8');
}
console.log('Added cleanup for PROP-8288');
