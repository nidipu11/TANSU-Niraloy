const fs = require('fs');

const mockLocalStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; }
};

global.localStorage = mockLocalStorage;
global.window = { location: { search: '' } };

const gridEl = { innerHTML: '' };
const countEl = { innerHTML: '' };
const titleEl = { textContent: '' };

function makeEl(val) {
  return { value: val, addEventListener: () => {} };
}

global.document = {
  getElementById: (id) => {
    if (id === 'filter-location') return makeEl('ALL');
    if (id === 'filter-type') return makeEl('FAMILY_HOUSE');
    if (id === 'filter-purpose') return makeEl('RENT');
    if (id === 'filter-max-price') return makeEl('100000');
    if (id === 'filter-bedrooms') return makeEl('ALL');
    if (id === 'properties-grid') return gridEl;
    if (id === 'properties-count') return countEl;
    if (id === 'catalog-title') return titleEl;
    return null;
  },
  querySelectorAll: () => []
};
global.Components = { renderPropertyCard: (p) => p.propertyId + ',' };

let apiCode = fs.readFileSync('js/api.js', 'utf8');
apiCode = apiCode.replace(/const url = new URL\([\s\S]*?\);/, 'const url = { pathname: endpoint };');
eval(apiCode);

let propsCode = fs.readFileSync('js/properties.js', 'utf8');
propsCode = propsCode.replace('const PropertiesController =', 'global.PropertiesController =');
eval(propsCode);

async function test() {
  apiGet("/api/properties", {}).then(() => {}).catch(()=>{}); // suppress
  
  let props = JSON.parse(localStorage.getItem('tansu_properties') || '[]');
  props.unshift({
    propertyId: "PROP-9999",
    location: "Dhanmondi",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 45000,
    status: "APPROVED",
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT"
  });
  localStorage.setItem('tansu_properties', JSON.stringify(props));

  await global.PropertiesController.initCatalog("FAMILY_HOUSE");
  console.log("Grid Output:", gridEl.innerHTML);
}

test().catch(console.error);
