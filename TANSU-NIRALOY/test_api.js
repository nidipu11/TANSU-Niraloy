const fs = require('fs');

const mockLocalStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; }
};

global.localStorage = mockLocalStorage;
global.window = { location: { origin: 'http://localhost' } };

const apiCode = fs.readFileSync('js/api.js', 'utf8');
eval(apiCode);

async function run() {
  let res = await apiGet("/api/properties", { propertyType: "FAMILY_HOUSE", purpose: "RENT" });
  console.log("Filtered Count:", res.count);

  res = await apiGet("/api/properties", { propertyType: "FAMILY_HOUSE" });
  console.log("Only propertyType Count:", res.count);

  res = await apiGet("/api/properties", {});
  console.log("All Count:", res.count);
}

run();
