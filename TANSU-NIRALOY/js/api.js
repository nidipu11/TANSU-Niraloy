/**
 * ==========================================================================
 * TANSU NIRALOY - CENTRALIZED API CLIENT ARCHITECTURE
 * Pure Vanilla JavaScript (ES6)
 * Prepares the frontend for future Java (Spring Boot) REST API integration.
 * Includes 35 authentic verified Dhaka city demo properties with 35 COMPLETELY UNIQUE,
 * non-repeating high-definition photos across the 7 major residential zones.
 * ==========================================================================
 */

// Centralized API Base URL (Connected directly to Spring Boot backend on port 8080)
const API_BASE_URL = "http://localhost:8080";

/**
 * Standard HTTP GET Request Wrapper
 */
async function apiGet(endpoint, params = {}) {
  const url = new URL(endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`, window.location.origin);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  try {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("tansu_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (API_BASE_URL) {
      const response = await fetch(url.toString(), { method: "GET", headers });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      return await response.json();
    }
  } catch (error) {
    console.warn(`[TANSU API] Backend unavailable at ${endpoint}. Using local repository.`, error);
  }

  return LocalDataStore.get(endpoint, params);
}

/**
 * Standard HTTP POST Request Wrapper
 */
async function apiPost(endpoint, body = {}) {
  const baseUrl = (typeof API_BASE_URL !== "undefined" && API_BASE_URL) ? API_BASE_URL : "http://localhost:8080";
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("tansu_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return data || { success: false, status: response.status, message: `HTTP Error ${response.status}: ${response.statusText}` };
    }
    return data;
  } catch (error) {
    console.warn(`[TANSU API] Backend POST network error at ${endpoint}.`, error);
    // For authentication and registration, return explicit server error rather than silent fallback
    if (endpoint.includes("/api/auth")) {
      return {
        success: false,
        status: 503,
        message: `Unable to connect to backend server at ${baseUrl}. Please ensure the Spring Boot backend is running on port 8080.`
      };
    }
  }

  return LocalDataStore.post(endpoint, body);
}

/**
 * Standard HTTP PUT Request Wrapper
 */
async function apiPut(endpoint, body = {}) {
  const baseUrl = (typeof API_BASE_URL !== "undefined" && API_BASE_URL) ? API_BASE_URL : "http://localhost:8080";
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("tansu_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => null);
    // Also sync local data store so offline/cache fallback remains 100% consistent
    LocalDataStore.put(endpoint, body);
    if (!response.ok) {
      return data || { success: false, status: response.status, message: `HTTP Error ${response.status}: ${response.statusText}` };
    }
    return data;
  } catch (error) {
    console.warn(`[TANSU API] Backend PUT error at ${endpoint}. Using local repository.`, error);
  }

  return LocalDataStore.put(endpoint, body);
}

/**
 * Standard HTTP DELETE Request Wrapper
 */
async function apiDelete(endpoint) {
  try {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("tansu_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (API_BASE_URL) {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers
      });
      if (!response.ok) throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      return await response.json();
    }
  } catch (error) {
    console.warn(`[TANSU API] Backend DELETE unavailable at ${endpoint}. Using local repository.`, error);
  }

  return LocalDataStore.delete(endpoint);
}

/**
 * 35 Authentic Verified Dhaka Properties (5 properties per area across 7 areas)
 * EVERY PROPERTY HAS ITS OWN UNIQUE, DISTINCT PHOTOGRAPHY!
 */
const DEFAULT_DHAKA_PROPERTIES = [
  // -------------------------------------------------------------
  // 1. GULSHAN (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-GLS-01",
    ownerId: "OWN-501",
    title: "Luxury 3-BHK Lakeview Apartment in Gulshan-2",
    location: "Gulshan",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "RENT",
    price: 95000,
    area: 2550,
    bedrooms: 3,
    bathrooms: 4,
    amenities: ["Lake View", "Elevator", "24/7 Generator", "Gym", "Car Parking", "Security Guard", "CCTV", "Balcony"],
    description: "Serene lakeside residence on Road 71, Gulshan-2. Imported Turkish marble, floor-to-ceiling soundproof glass, fitted Italian kitchen, and 2 designated covered parking slots.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-10",
    updatedAt: "2026-08-12"
  },
  {
    propertyId: "PROP-GLS-02",
    ownerId: "OWN-501",
    title: "Peaceful Family Residence near Gulshan Club",
    location: "Gulshan",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 75000,
    area: 2100,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Elevator", "Generator Backup", "2 Car Parking", "Guard Patrol", "South Facing"],
    description: "Quiet green ambiance on Gulshan-1 Road 132. Spacious living and dining area with private servant quarter and uninterrupted utilities.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-14",
    updatedAt: "2026-08-15"
  },
  {
    propertyId: "PROP-GLS-03",
    ownerId: "OWN-506",
    title: "Executive Studio Suite for Diplomats & Bankers",
    location: "Gulshan",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 38000,
    area: 900,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Furnished", "High-Speed WiFi", "Central AC", "Rooftop Pool", "Housekeeping Support"],
    description: "Fully furnished executive studio flat in Gulshan-1. Suitable for corporate bachelors and foreign delegates with round-the-clock TANSU security.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-18",
    updatedAt: "2026-08-20"
  },
  {
    propertyId: "PROP-GLS-04",
    ownerId: "OWN-507",
    title: "Brand New Ultra-Luxury Duplex Penthouse",
    location: "Gulshan",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "SALE",
    price: 36000000,
    area: 4200,
    bedrooms: 5,
    bathrooms: 6,
    amenities: ["Private Rooftop Lawn", "Smart Automation", "3 Parking", "Private Lift Access", "RAJUK Approved"],
    description: "Masterpiece duplex in Gulshan-2 with 360-degree skyline views. Complete legal vetting and RAJUK sanction verified by TANSU legal team.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-08-22",
    updatedAt: "2026-08-25"
  },
  {
    propertyId: "PROP-GLS-05",
    ownerId: "OWN-508",
    title: "South-Facing 3-Bed Apartment for Sale",
    location: "Gulshan",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 24500000,
    area: 2300,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Modern Lobby", "Substation", "Fire Hydrant System", "Community Lounge", "2 Parking"],
    description: "Ready for immediate registration in Gulshan-1. Clean property chain, no bank encumbrance, and guaranteed deed transfer mediated by TANSU.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-08-26",
    updatedAt: "2026-08-28"
  },

  // -------------------------------------------------------------
  // 2. BANANI (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-BNN-01",
    ownerId: "OWN-502",
    title: "Chic Modern 3-BHK Flat in Banani Road 11",
    location: "Banani",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 65000,
    area: 1950,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Elevator", "Gas Connection", "Car Parking", "24/7 Security", "Wide Balconies"],
    description: "Walking distance to Banani's best cafes and supermarkets while maintaining peaceful residential tranquility. Double glazed windows and modern kitchen.",
    images: [
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-11",
    updatedAt: "2026-08-13"
  },
  {
    propertyId: "PROP-BNN-02",
    ownerId: "OWN-503",
    title: "Bachelor Studio Unit with High-Speed Internet",
    location: "Banani",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 24000,
    area: 800,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Furnished", "WiFi Included", "Elevator", "Rooftop Garden", "No Curfew Hassle"],
    description: "Ideal for tech engineers and corporate executives in Banani Block D. Clean, quiet, and legally registered with tenant-friendly guidelines.",
    images: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-16",
    updatedAt: "2026-08-17"
  },
  {
    propertyId: "PROP-BNN-03",
    ownerId: "OWN-509",
    title: "Premium 4-BHK Residence overlooking Banani Lake",
    location: "Banani",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "RENT",
    price: 105000,
    area: 2850,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Lake Panorama", "Servant Room", "Gym", "Full Generator", "Intercom", "2 Parking"],
    description: "Spectacular lake views in Banani Block I. Modern architecture, timber flooring in master bed, and 24-hour guarded gate.",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-20",
    updatedAt: "2026-08-21"
  },
  {
    propertyId: "PROP-BNN-04",
    ownerId: "OWN-510",
    title: "Cozy 2-Bed Bachelor Shared Suite in Banani",
    location: "Banani",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 30000,
    area: 1100,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Elevator", "Security", "Separate Kitchenette", "Balcony", "Individual Meters"],
    description: "Designed for two university students or young professionals sharing. Prime location near Kemal Ataturk Avenue with fast access to metro and bus corridors.",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-23",
    updatedAt: "2026-08-24"
  },
  {
    propertyId: "PROP-BNN-05",
    ownerId: "OWN-511",
    title: "Ready Luxury Flat for Sale in Banani Block E",
    location: "Banani",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 21500000,
    area: 2100,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["RAJUK Approved", "Substation", "Generator", "Parking", "Community Rooftop"],
    description: "Spacious north-east facing corner flat with abundant natural daylight. Legal papers scrutinized and certified by TANSU Property Verification Cell.",
    images: [
      "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-08-27",
    updatedAt: "2026-08-29"
  },

  // -------------------------------------------------------------
  // 3. DHANMONDI (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-DHN-01",
    ownerId: "OWN-502",
    title: "Serene Family Flat Facing Road 8A Park",
    location: "Dhanmondi",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 45000,
    area: 1750,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Park View", "Elevator", "Gas Connection", "Car Parking", "Security Guard", "Balcony"],
    description: "Quiet residential sanctuary on Dhanmondi Road 8A. Minutes from reputed schools, universities, healthcare centers, and lakeside walking tracks.",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-15",
    updatedAt: "2026-08-16"
  },
  {
    propertyId: "PROP-DHN-02",
    ownerId: "OWN-512",
    title: "Peaceful 4-BHK Lakeside Residence on Road 4",
    location: "Dhanmondi",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "RENT",
    price: 70000,
    area: 2350,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Lakeside Breeze", "Generator", "2 Car Parking", "CCTV", "Modern Bathrooms"],
    description: "Beautifully maintained home with lush green surroundings in old Dhanmondi. Expansive balconies and separate drawing-dining configuration.",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-17",
    updatedAt: "2026-08-18"
  },
  {
    propertyId: "PROP-DHN-03",
    ownerId: "OWN-513",
    title: "Quiet Bachelor Studio near Medical Colleges",
    location: "Dhanmondi",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 21000,
    area: 720,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi", "Water Filter", "Lift", "Security Guard", "Balcony"],
    description: "Specially verified unit near Ibn Sina and Bangladesh Medical College. Welcoming doctor interns, researchers, and professional bachelors.",
    images: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-19",
    updatedAt: "2026-08-20"
  },
  {
    propertyId: "PROP-DHN-04",
    ownerId: "OWN-514",
    title: "Elegant Family Flat near Satmasjid Road",
    location: "Dhanmondi",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 48000,
    area: 1850,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Generator", "Dedicated Parking", "Titas Gas", "24/7 Guard"],
    description: "Quiet residential by-lane off Satmasjid Road. Ideal for families wanting proximity to shopping malls, schools, and medical hubs.",
    images: [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-24",
    updatedAt: "2026-08-25"
  },
  {
    propertyId: "PROP-DHN-05",
    ownerId: "OWN-515",
    title: "Prime 3-Bed Apartment for Sale on Road 27",
    location: "Dhanmondi",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 19500000,
    area: 2050,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["RAJUK Approved", "Substation", "Generator", "Parking", "Intercom System"],
    description: "South-facing apartment on Dhanmondi 27. Freehold land ownership, all mutation and tax tokens verified clean by TANSU.",
    images: [
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-08-29",
    updatedAt: "2026-08-30"
  },

  // -------------------------------------------------------------
  // 4. UTTARA (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-UTR-01",
    ownerId: "OWN-501",
    title: "Executive Modern Duplex Penthouse in Sector 4",
    location: "Uttara",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "RENT",
    price: 110000,
    area: 3200,
    bedrooms: 4,
    bathrooms: 5,
    amenities: ["Private Terrace", "Duplex Stairs", "3 Parking", "Smart Locks", "Full Generator Backup", "Servant Room"],
    description: "Sector 4 Uttara duplex penthouse. Private roof garden, uninterrupted utilities, modern imported fittings, and round-the-clock TANSU-managed security.",
    images: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-01",
    updatedAt: "2026-09-02"
  },
  {
    propertyId: "PROP-UTR-02",
    ownerId: "OWN-516",
    title: "Peaceful 3-BHK Family Flat in Sector 7",
    location: "Uttara",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 36000,
    area: 1650,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Gas Connection", "Covered Parking", "CCTV", "Balcony"],
    description: "Walking distance to Sector 7 park and Rabindra Sarani. Beautiful neighborhood with wide avenues, trees, and quiet residential ambiance.",
    images: [
      "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-03",
    updatedAt: "2026-09-04"
  },
  {
    propertyId: "PROP-UTR-03",
    ownerId: "OWN-517",
    title: "Airy 3-Bed Family Apartment in Sector 13",
    location: "Uttara",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 32000,
    area: 1550,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Elevator", "Generator", "Security Guard", "Balcony"],
    description: "South-facing cross ventilation apartment in Sector 13. Close to renowned schools and modern shopping outlets.",
    images: [
      "https://images.unsplash.com/photo-1617098900591-3f90928e8c54?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-04",
    updatedAt: "2026-09-05"
  },
  {
    propertyId: "PROP-UTR-04",
    ownerId: "OWN-518",
    title: "Smart Bachelor Flat near Metro Station Sector 11",
    location: "Uttara",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 19000,
    area: 750,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Near Metro", "WiFi", "Lift", "Security", "Separate Sub-Meter"],
    description: "Quick 2-minute stroll to MRT-6 Uttara North Station. Perfect for airline crew, airport personnel, or corporate professionals.",
    images: [
      "https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-06",
    updatedAt: "2026-09-07"
  },
  {
    propertyId: "PROP-UTR-05",
    ownerId: "OWN-519",
    title: "Spacious 3-BHK Flat for Sale in Sector 14",
    location: "Uttara",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 13500000,
    area: 1780,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["RAJUK Approved", "Covered Parking", "Lift", "Generator", "Intercom"],
    description: "Brand new ready flat. Full legal clearance and transparent paperwork with TANSU administrative intermediary escrow support.",
    images: [
      "https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-09-08",
    updatedAt: "2026-09-09"
  },

  // -------------------------------------------------------------
  // 5. MIRPUR (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-MIR-01",
    ownerId: "OWN-505",
    title: "Cozy Family Apartment Near Metro Station Mirpur-10",
    location: "Mirpur",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 28000,
    area: 1350,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Lift", "Generator", "Security", "Balcony", "Titas Gas"],
    description: "Situated 3 minutes walk from the MRT-6 Metro Rail Station. Fast, reliable commute across Dhaka with modern residential finishes.",
    images: [
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-05",
    updatedAt: "2026-09-06"
  },
  {
    propertyId: "PROP-MIR-02",
    ownerId: "OWN-520",
    title: "Affordable 3-Bed Family Flat in Mirpur DOHS",
    location: "Mirpur",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 34000,
    area: 1600,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["DOHS High Security", "Park & Lake", "Community Mosque", "Covered Parking", "Lift"],
    description: "Highly secure cantonment perimeter within Mirpur DOHS. Children play safely and peaceful lakeside walking track right across.",
    images: [
      "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-06",
    updatedAt: "2026-09-07"
  },
  {
    propertyId: "PROP-MIR-03",
    ownerId: "OWN-521",
    title: "Furnished Bachelor Room with High-Speed Net in Mirpur-2",
    location: "Mirpur",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 14000,
    area: 550,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Furnished", "WiFi", "Meal Facility Provision", "Security", "Rooftop Access"],
    description: "Near National Cricket Stadium and Mirpur-2 commerce college. Budget-friendly for students and junior executives with quiet study rules.",
    images: [
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-07",
    updatedAt: "2026-09-08"
  },
  {
    propertyId: "PROP-MIR-04",
    ownerId: "OWN-522",
    title: "Bachelor Shared Suite in Mirpur-12 Metro Area",
    location: "Mirpur",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 16000,
    area: 680,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Lift", "Generator", "Guard", "Metro Access 2 Min", "Balcony"],
    description: "Direct access to Mirpur-12 Metro Station. Easy commute to Motijheel, Kawran Bazar, and Farmgate in 20 minutes.",
    images: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-08",
    updatedAt: "2026-09-09"
  },
  {
    propertyId: "PROP-MIR-05",
    ownerId: "OWN-523",
    title: "Affordable 3-BHK Flat for Sale in Mirpur-1",
    location: "Mirpur",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 9200000,
    area: 1420,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["RAJUK Approved", "Elevator", "Gas Connection", "Parking", "Water Pump"],
    description: "Great value ready-to-move apartment near Mirpur-1 Sony Square. Title vetted, no dues, legal registration assistance through TANSU.",
    images: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-09-09",
    updatedAt: "2026-09-10"
  },

  // -------------------------------------------------------------
  // 6. BASHUNDHARA (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-BSH-01",
    ownerId: "OWN-504",
    title: "Exclusive Brand New Flat for Sale in Block I",
    location: "Bashundhara",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 18500000,
    area: 2150,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["RAJUK Approved", "2 Car Parking", "Community Hall", "Substation", "Fire Safety", "Swimming Pool"],
    description: "Brand new south-facing luxury apartment in Block I, Bashundhara R/A. Ready for immediate registration with full legal vetting completed by TANSU Niraloy legal desk.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-08-25",
    updatedAt: "2026-08-27"
  },
  {
    propertyId: "PROP-BSH-02",
    ownerId: "OWN-524",
    title: "Peaceful 3-Bed Family Flat in Block C",
    location: "Bashundhara",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 42000,
    area: 1750,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Generator", "Parking", "Security 24/7", "Gas Connection"],
    description: "Quiet residential Block C near Apollo Hospital (Evercare). Clean green air, wide roads, and round-the-clock gated security.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-28",
    updatedAt: "2026-08-29"
  },
  {
    propertyId: "PROP-BSH-03",
    ownerId: "OWN-525",
    title: "NSU & IUB Student Studio Bachelor Suite in Block D",
    location: "Bashundhara",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 18000,
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["WiFi Included", "Lift", "Study Desk", "Balcony", "Security"],
    description: "A short 5-minute walk to North South University (NSU) and Independent University Bangladesh (IUB). High-speed fiber internet and peaceful atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-08-30",
    updatedAt: "2026-08-31"
  },
  {
    propertyId: "PROP-BSH-04",
    ownerId: "OWN-526",
    title: "Shared 2-Bed Bachelor Unit in Block F",
    location: "Bashundhara",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 26000,
    area: 980,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ["Lift", "Generator", "Gas", "Balcony", "24h Guard"],
    description: "Ideal for 2 university classmates or office colleagues. Close to restaurants, gyms, and shuttle stops with zero landlord disturbance.",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-02",
    updatedAt: "2026-09-03"
  },
  {
    propertyId: "PROP-BSH-05",
    ownerId: "OWN-527",
    title: "Luxury Duplex with Private Garden in Block G",
    location: "Bashundhara",
    propertyType: "PREMIUM_FAMILY_HOUSING",
    purpose: "RENT",
    price: 88000,
    area: 2900,
    bedrooms: 4,
    bathrooms: 4,
    amenities: ["Private Garden", "2 Parking", "Smart Locks", "Full Generator", "Servant Bath"],
    description: "Spectacular architectural duplex in Bashundhara Block G with private manicured lawn and imported sanitary fittings.",
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-05",
    updatedAt: "2026-09-06"
  },

  // -------------------------------------------------------------
  // 7. MOHAMMADPUR (5 Properties)
  // -------------------------------------------------------------
  {
    propertyId: "PROP-MOH-01",
    ownerId: "OWN-528",
    title: "Serene 3-Bed Family Flat in Japan Garden City",
    location: "Mohammadpur",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 32000,
    area: 1480,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ["Gated Community", "Kids Playground", "Swimming Pool", "Lift", "Generator", "Mosque"],
    description: "Within Japan Garden City complex. Excellent self-contained family community with parks, internal supermarkets, and 24-hour security guards.",
    images: [
      "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-02",
    updatedAt: "2026-09-03"
  },
  {
    propertyId: "PROP-MOH-02",
    ownerId: "OWN-529",
    title: "Bright South-Facing Flat in Lalmatia Block B",
    location: "Mohammadpur",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 38000,
    area: 1650,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Lift", "Generator", "Parking", "Gas Connection", "Park Nearby"],
    description: "Bordering Dhanmondi 27. Lalmatia Block B is renowned for its cultural environment, wide trees, and quiet residential neighborhood.",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-04",
    updatedAt: "2026-09-05"
  },
  {
    propertyId: "PROP-MOH-03",
    ownerId: "OWN-530",
    title: "Bachelor Studio Flat near Ring Road Mohammadpur",
    location: "Mohammadpur",
    propertyType: "BACHELOR_HOUSE",
    purpose: "RENT",
    price: 15000,
    area: 600,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ["Lift", "WiFi", "Water 24/7", "Security", "Separate Kitchenette"],
    description: "Situated on Ring Road with instant bus and rickshaw connections to Dhanmondi, Farmgate, and Mirpur. Clean, independent bachelor suite.",
    images: [
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-06",
    updatedAt: "2026-09-07"
  },
  {
    propertyId: "PROP-MOH-04",
    ownerId: "OWN-531",
    title: "Quiet 3-BHK Family Home on Asad Avenue",
    location: "Mohammadpur",
    propertyType: "FAMILY_HOUSE",
    purpose: "RENT",
    price: 40000,
    area: 1720,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["Elevator", "Gas", "Car Parking", "Guard Patrol", "Balconies"],
    description: "Convenient location on Asad Avenue near Town Hall market and St. Joseph School. Spacious floor layout with natural breeze.",
    images: [
      "https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_RENT",
    createdAt: "2026-09-08",
    updatedAt: "2026-09-09"
  },
  {
    propertyId: "PROP-MOH-05",
    ownerId: "OWN-532",
    title: "Brand New Flat for Sale on Ring Road Extension",
    location: "Mohammadpur",
    propertyType: "FLAT_SALE",
    purpose: "SALE",
    price: 11500000,
    area: 1600,
    bedrooms: 3,
    bathrooms: 3,
    amenities: ["RAJUK Approved", "Generator", "Lift", "Parking", "Fire Safety"],
    description: "Under-market price opportunity in Mohammadpur. Clear title deeds and registration paperwork verified by TANSU legal desk.",
    images: [
      "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=1000&q=80"
    ],
    verificationStatus: "VERIFIED",
    availabilityStatus: "AVAILABLE_FOR_SALE",
    createdAt: "2026-09-10",
    updatedAt: "2026-09-11"
  }
];

// -------------------------------------------------------------
// DEFAULT TENANT RENT COLLECTIONS & INFLOW (Who rented what & amount paid)
// -------------------------------------------------------------
const DEFAULT_TENANT_COLLECTIONS = [
  {
    collectionId: "COL-101",
    transactionId: "TXN-88219",
    tenantId: "TEN-901",
    tenantName: "Tamim Iqbal",
    tenantPhone: "01711-223344",
    propertyId: "PROP-102",
    flatTitle: "Spacious Family Flat (Flat 4B)",
    location: "Dhanmondi, Dhaka",
    purpose: "RENT",
    rentMonth: "August 2026",
    amount: 45000,
    paymentMethod: "CARD (VISA)",
    paymentDate: "2026-08-25 14:32",
    status: "CLEARED"
  },
  {
    collectionId: "COL-102",
    transactionId: "TXN-77312",
    tenantId: "TEN-802",
    tenantName: "Farhana Rahman",
    tenantPhone: "01819-334455",
    propertyId: "PROP-GLS-01",
    flatTitle: "Luxury 3-BHK Lakeview Apartment (Flat 5A)",
    location: "Gulshan-2, Dhaka",
    purpose: "RENT",
    rentMonth: "August 2026",
    amount: 95000,
    paymentMethod: "bKash (MFS)",
    paymentDate: "2026-08-28 10:15",
    status: "CLEARED"
  },
  {
    collectionId: "COL-103",
    transactionId: "TXN-66104",
    tenantId: "TEN-714",
    tenantName: "Arifur Chowdhury",
    tenantPhone: "01912-778899",
    propertyId: "PROP-BAN-01",
    flatTitle: "Executive Studio Flat (Flat 3C)",
    location: "Banani Road 11, Dhaka",
    purpose: "RENT",
    rentMonth: "August 2026",
    amount: 38000,
    paymentMethod: "Nagad (MFS)",
    paymentDate: "2026-08-30 18:40",
    status: "CLEARED"
  },
  {
    collectionId: "COL-104",
    transactionId: "TXN-55209",
    tenantId: "TEN-650",
    tenantName: "Sabrina Yesmin",
    tenantPhone: "01678-554433",
    propertyId: "PROP-UTT-01",
    flatTitle: "Sector 4 Modern Residence (Flat 2A)",
    location: "Uttara, Dhaka",
    purpose: "RENT",
    rentMonth: "September 2026",
    amount: 52000,
    paymentMethod: "Rocket (MFS)",
    paymentDate: "2026-09-02 11:20",
    status: "CLEARED"
  },
  {
    collectionId: "COL-105",
    transactionId: "TXN-44198",
    tenantId: "TEN-532",
    tenantName: "Kazi Mehedi Hasan",
    tenantPhone: "01552-667788",
    propertyId: "PROP-MIR-01",
    flatTitle: "Metro Rail Facing Apartment (Flat 6D)",
    location: "Mirpur DOHS, Dhaka",
    purpose: "RENT",
    rentMonth: "September 2026",
    amount: 32000,
    paymentMethod: "bKash (MFS)",
    paymentDate: "2026-09-04 09:45",
    status: "CLEARED"
  }
];

// -------------------------------------------------------------
// DEFAULT TENANT OUTSTANDING DUES & ARREARS (Dues and notice dispatch)
// -------------------------------------------------------------
const DEFAULT_TENANT_DUES = [
  {
    dueId: "DUE-701",
    tenantId: "TNT-101",
    tenantName: "Shakil Ahmed",
    tenantPhone: "01811-223344",
    tenantEmail: "student.tenant@gmail.com",
    propertyId: "PROP-102",
    flatTitle: "Spacious Family Flat Near Park (Dhanmondi)",
    location: "Dhanmondi Road 8/A, Dhaka",
    dueType: "Monthly Rent",
    dueMonth: "September 2026",
    totalBilled: 45000,
    paidAmount: 0,
    dueAmount: 45000,
    dueDate: "2026-09-25",
    status: "UNPAID",
    daysOverdue: 0,
    noticeSent: false,
    lastNoticeDate: null,
    lastNoticeType: null
  },
  {
    dueId: "DUE-702",
    tenantId: "TNT-101",
    tenantName: "Shakil Ahmed",
    tenantPhone: "01811-223344",
    tenantEmail: "student.tenant@gmail.com",
    propertyId: "PROP-102",
    flatTitle: "Utility & Service Surcharge (Dhanmondi)",
    location: "Dhanmondi Road 8/A, Dhaka",
    dueType: "Utility & Service Surcharge",
    dueMonth: "September 2026",
    totalBilled: 5000,
    paidAmount: 0,
    dueAmount: 5000,
    dueDate: "2026-09-25",
    status: "UNPAID",
    daysOverdue: 0,
    noticeSent: false,
    lastNoticeDate: null,
    lastNoticeType: null
  },
  {
    dueId: "DUE-801",
    tenantId: "TEN-901",
    tenantName: "Tamim Iqbal",
    tenantPhone: "01711-223344",
    tenantEmail: "tamim.iqbal@gmail.com",
    propertyId: "PROP-102",
    flatTitle: "Spacious Family Flat (Flat 4B)",
    location: "Dhanmondi Road 8/A, Dhaka",
    dueType: "Monthly Rent",
    dueMonth: "September 2026",
    totalBilled: 45000,
    paidAmount: 0,
    dueAmount: 45000,
    dueDate: "2026-09-05",
    status: "OVERDUE",
    daysOverdue: 9,
    noticeSent: false,
    lastNoticeDate: null,
    lastNoticeType: null
  },
  {
    dueId: "DUE-802",
    tenantId: "TEN-802",
    tenantName: "Farhana Rahman",
    tenantPhone: "01819-334455",
    tenantEmail: "farhana.rahman@yahoo.com",
    propertyId: "PROP-GLS-01",
    flatTitle: "Luxury 3-BHK Lakeview Apartment (Flat 5A)",
    location: "Gulshan-2, Dhaka",
    dueType: "Monthly Rent",
    dueMonth: "September 2026",
    totalBilled: 95000,
    paidAmount: 25000,
    dueAmount: 70000,
    dueDate: "2026-09-07",
    status: "OVERDUE",
    daysOverdue: 7,
    noticeSent: true,
    lastNoticeDate: "2026-09-11 11:30 AM",
    lastNoticeType: "Standard Reminder"
  },
  {
    dueId: "DUE-803",
    tenantId: "TEN-419",
    tenantName: "Shahriar Kabir",
    tenantPhone: "01915-998877",
    tenantEmail: "shahriar.kabir@hotmail.com",
    propertyId: "PROP-BAS-01",
    flatTitle: "Bashundhara Block D Family Home (Flat 3B)",
    location: "Bashundhara R/A, Dhaka",
    dueType: "Utility & Maintenance Surcharge",
    dueMonth: "August 2026",
    totalBilled: 18000,
    paidAmount: 0,
    dueAmount: 18000,
    dueDate: "2026-08-31",
    status: "OVERDUE",
    daysOverdue: 14,
    noticeSent: false,
    lastNoticeDate: null,
    lastNoticeType: null
  },
  {
    dueId: "DUE-804",
    tenantId: "TEN-608",
    tenantName: "Nafis Imtiaz",
    tenantPhone: "01680-112244",
    tenantEmail: "nafis.imtiaz@outlook.com",
    propertyId: "PROP-MOH-01",
    flatTitle: "Mohammadpur Japan Garden Suite (Flat 8F)",
    location: "Mohammadpur, Dhaka",
    dueType: "Monthly Rent",
    dueMonth: "September 2026",
    totalBilled: 45000,
    paidAmount: 0,
    dueAmount: 45000,
    dueDate: "2026-09-10",
    status: "OVERDUE",
    daysOverdue: 4,
    noticeSent: false,
    lastNoticeDate: null,
    lastNoticeType: null
  }
];

// -------------------------------------------------------------
// DEFAULT OWNER SETTLEMENTS
// -------------------------------------------------------------
const DEFAULT_OWNER_SETTLEMENTS = [
  {
    settlementId: "SET-301",
    ownerId: "OWN-501",
    ownerName: "Alhaj Anisur Rahman",
    propertyId: "PROP-101",
    flatTitle: "Lakeview Executive Duplex (Road 71)",
    location: "Gulshan-2, Dhaka",
    entitledAmount: 85000,
    disbursed: 85000,
    remaining: 0,
    status: "SETTLED",
    clearanceDate: "2026-08-30",
    bankName: "BRAC Bank (A/C: 150120...)"
  },
  {
    settlementId: "SET-302",
    ownerId: "OWN-501",
    ownerName: "Alhaj Anisur Rahman",
    propertyId: "PROP-105",
    flatTitle: "Gulshan Modern Penthouse",
    location: "Gulshan-1, Dhaka",
    entitledAmount: 110000,
    disbursed: 0,
    remaining: 110000,
    status: "PENDING_AUDIT",
    clearanceDate: "2026-09-28",
    bankName: "City Bank (A/C: 310450...)"
  },
  {
    settlementId: "SET-303",
    ownerId: "OWN-502",
    ownerName: "Engr. M. A. Rashid",
    propertyId: "PROP-BAN-01",
    flatTitle: "Banani Road 11 Luxury Residence",
    location: "Banani, Dhaka",
    entitledAmount: 75000,
    disbursed: 75000,
    remaining: 0,
    status: "SETTLED",
    clearanceDate: "2026-09-02",
    bankName: "Dutch-Bangla Bank (A/C: 115100...)"
  }
];

// -------------------------------------------------------------
// DEFAULT SYSTEM OPERATING EXPENSES
// -------------------------------------------------------------
const DEFAULT_OPERATING_EXPENSES = [
  {
    expenseId: "EXP-101",
    category: "FIELD_INSPECTION",
    amount: 3200,
    date: "2026-09-02",
    description: "Gulshan & Banani property physical verification transport & surveyor honorarium",
    voucher: "VCH-9812"
  },
  {
    expenseId: "EXP-102",
    category: "INFRASTRUCTURE",
    amount: 12000,
    date: "2026-09-01",
    description: "Cloud hosting, SSL 256-bit certificates & SMS gateway provisioning",
    voucher: "VCH-9813"
  }
];

/**
 * Client Data Repository
 */
const LocalDataStore = {
  _init() {
    // Overwrite property database to ensure all 35 unique non-repeating photos are updated
    const stored = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
    if (stored.length < 35 || !localStorage.getItem("tansu_unique_v4")) {
      localStorage.setItem("tansu_properties", JSON.stringify(DEFAULT_DHAKA_PROPERTIES));
      localStorage.setItem("tansu_unique_v4", "true");
    }
    if (!localStorage.getItem("tansu_requests")) {
      localStorage.setItem("tansu_requests", JSON.stringify([]));
    }
    if (!localStorage.getItem("tansu_payments")) {
      localStorage.setItem("tansu_payments", JSON.stringify([]));
    }
    if (!localStorage.getItem("tansu_support")) {
      localStorage.setItem("tansu_support", JSON.stringify([]));
    }
    if (!localStorage.getItem("tansu_collections") || !localStorage.getItem("tansu_collections_v3")) {
      localStorage.setItem("tansu_collections", JSON.stringify(DEFAULT_TENANT_COLLECTIONS));
      localStorage.setItem("tansu_collections_v3", "true");
    }
    if (!localStorage.getItem("tansu_dues") || !localStorage.getItem("tansu_dues_v5")) {
      localStorage.setItem("tansu_dues", JSON.stringify(DEFAULT_TENANT_DUES));
      localStorage.setItem("tansu_dues_v5", "true");
    }
    if (!localStorage.getItem("tansu_settlements") || !localStorage.getItem("tansu_settlements_v5")) {
      localStorage.setItem("tansu_settlements", JSON.stringify(DEFAULT_OWNER_SETTLEMENTS));
      localStorage.setItem("tansu_settlements_v5", "true");
    }
    if (!localStorage.getItem("tansu_expenses") || !localStorage.getItem("tansu_expenses_v3")) {
      localStorage.setItem("tansu_expenses", JSON.stringify(DEFAULT_OPERATING_EXPENSES));
      localStorage.setItem("tansu_expenses_v3", "true");
    }
    if (!localStorage.getItem("tansu_notices")) {
      localStorage.setItem("tansu_notices", JSON.stringify([]));
    }
    if (!localStorage.getItem("tansu_registered_users")) {
      const defaultUsers = [
        {
          userId: "ADM-001",
          name: "TANSU System Administrator",
          email: "admin@tansu.gov.bd",
          password: "Admin123",
          phone: "01700000000",
          role: "ADMIN"
        },
        {
          userId: "OWN-501",
          name: "Haji Mohammad Rafiq",
          email: "property.owner@gmail.com",
          password: "Owner123",
          phone: "01711223344",
          role: "OWNER"
        },
        {
          userId: "TNT-101",
          name: "Shakil Ahmed",
          email: "student.tenant@gmail.com",
          password: "Tenant123",
          phone: "01811223344",
          role: "TENANT"
        }
      ];
      localStorage.setItem("tansu_registered_users", JSON.stringify(defaultUsers));
    }
  },

  get(endpoint, params) {
    this._init();
    const props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");

    if (endpoint === "/api/properties/pending" || endpoint === "/api/admin/listings/pending" || (endpoint === "/api/properties" && params.status === "PENDING")) {
      const pending = props.filter(p => p.status === "PENDING" || p.verificationStatus === "PENDING_VERIFICATION");
      return { success: true, count: pending.length, data: pending };
    }

    if (endpoint === "/api/properties") {
      if (params.ownerId) {
        const ownerProps = props.filter(p => p.ownerId === params.ownerId);
        return { success: true, count: ownerProps.length, data: ownerProps };
      }
      let filtered = props.filter(p => 
        (p.status === "APPROVED" || p.verificationStatus === "VERIFIED" || !p.status) &&
        p.status !== "REJECTED" && 
        p.verificationStatus !== "REJECTED" &&
        p.availabilityStatus !== "REJECTED"
      );
      if (params.location && params.location !== "ALL") {
        filtered = filtered.filter(p => p.location.toLowerCase() === params.location.toLowerCase());
      }
      if (params.propertyType && params.propertyType !== "ALL") {
        filtered = filtered.filter(p => p.propertyType === params.propertyType);
      }
      if (params.purpose && params.purpose !== "ALL") {
        filtered = filtered.filter(p => p.purpose === params.purpose);
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => p.price <= Number(params.maxPrice));
      }
      if (params.bedrooms && params.bedrooms !== "ALL") {
        filtered = filtered.filter(p => p.bedrooms >= Number(params.bedrooms));
      }
      return { success: true, count: filtered.length, data: filtered };
    }

    if (endpoint.startsWith("/api/properties/")) {
      const id = endpoint.replace("/api/properties/", "");
      const prop = props.find(p => p.propertyId === id);
      return prop ? { success: true, data: prop } : { success: false, message: "Property not found." };
    }

    if (endpoint.startsWith("/api/requests/user/")) {
      const targetUserId = decodeURIComponent(endpoint.replace("/api/requests/user/", "").trim());
      const reqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
      const userReqs = reqs.filter(r => r.tenantId === targetUserId || r.tenantEmail === targetUserId);
      return { success: true, count: userReqs.length, data: userReqs };
    }

    if (endpoint === "/api/requests" || endpoint === "/api/tenant/requests") {
      const reqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
      const user = JSON.parse(localStorage.getItem("tansu_current_user") || "null");
      const targetId = params.userId || params.tenantId || (user ? user.userId : null);
      const targetEmail = params.email || (user ? user.email : null);
      if (targetId || targetEmail) {
        const userReqs = reqs.filter(r => (targetId && r.tenantId === targetId) || (targetEmail && r.tenantEmail === targetEmail));
        return { success: true, count: userReqs.length, data: userReqs };
      }
      return { success: true, count: reqs.length, data: reqs };
    }

    if (endpoint.startsWith("/api/tenant/dues") || endpoint.startsWith("/api/dues/user/")) {
      const dues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
      const user = JSON.parse(localStorage.getItem("tansu_current_user") || "null");
      const targetId = params.tenantId || (endpoint.startsWith("/api/dues/user/") ? endpoint.replace("/api/dues/user/", "").trim() : (user ? user.userId : null));
      const targetEmail = params.email || (user ? user.email : null);
      if (targetId || targetEmail) {
        const userDues = dues.filter(d => (targetId && d.tenantId === targetId) || (targetEmail && d.tenantEmail === targetEmail));
        return { success: true, count: userDues.length, data: userDues };
      }
      return { success: true, count: dues.length, data: dues };
    }

    if (endpoint === "/api/tenant/payments" || endpoint === "/api/payments") {
      const payments = JSON.parse(localStorage.getItem("tansu_payments") || "[]");
      const user = JSON.parse(localStorage.getItem("tansu_current_user") || "null");
      const targetId = params.tenantId || (user ? user.userId : null);
      if (targetId) {
        const userPayments = payments.filter(p => p.tenantId === targetId);
        return { success: true, count: userPayments.length, data: userPayments };
      }
      return { success: true, count: payments.length, data: payments };
    }

    if (endpoint === "/api/owner/properties") {
      const user = JSON.parse(localStorage.getItem("tansu_current_user") || "null");
      const targetOwnerId = params.ownerId || (user ? user.userId : null);
      const ownerProps = targetOwnerId ? props.filter(p => p.ownerId === targetOwnerId) : [];
      return { success: true, count: ownerProps.length, data: ownerProps };
    }

    if (endpoint === "/api/owner/settlements" || endpoint.startsWith("/api/owner/settlements") || endpoint === "/api/owner/earnings") {
      const settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
      const user = JSON.parse(localStorage.getItem("tansu_current_user") || "null");
      const targetOwnerId = params.ownerId || (user ? user.userId : null);
      if (targetOwnerId) {
        const ownerSettlements = settlements.filter(s => s.ownerId === targetOwnerId);
        return { success: true, count: ownerSettlements.length, data: ownerSettlements };
      }
      return { success: true, count: settlements.length, data: settlements };
    }

    if (endpoint === "/api/admin/collections") {
      const collections = JSON.parse(localStorage.getItem("tansu_collections") || "[]");
      return { success: true, count: collections.length, data: collections };
    }

    if (endpoint === "/api/admin/dues") {
      const dues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
      return { success: true, count: dues.length, data: dues };
    }

    if (endpoint === "/api/admin/settlements") {
      const settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
      return { success: true, count: settlements.length, data: settlements };
    }

    if (endpoint === "/api/admin/expenses") {
      const expenses = JSON.parse(localStorage.getItem("tansu_expenses") || "[]");
      return { success: true, count: expenses.length, data: expenses };
    }

    if (endpoint === "/api/admin/notices") {
      const notices = JSON.parse(localStorage.getItem("tansu_notices") || "[]");
      return { success: true, count: notices.length, data: notices };
    }

    return { success: true, data: [] };
  },

  post(endpoint, body) {
    this._init();

    if (endpoint === "/api/properties" || endpoint === "/api/owner/properties") {
      const props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
      const newProp = {
        propertyId: `PROP-${Date.now().toString().slice(-4)}`,
        ...body,
        status: "PENDING",
        verificationStatus: "PENDING_VERIFICATION",
        availabilityStatus: "PENDING_VERIFICATION",
        submissionDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0]
      };
      props.unshift(newProp);
      localStorage.setItem("tansu_properties", JSON.stringify(props));
      return { success: true, message: "Property submitted to TANSU Admin for verification.", data: newProp };
    }

    if (endpoint === "/api/requests" || endpoint === "/api/tenant/requests") {
      const reqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
      const newReq = {
        requestId: `REQ-${Date.now().toString().slice(-5)}`,
        ...body,
        requestDate: new Date().toISOString().split("T")[0],
        status: "PENDING"
      };
      reqs.unshift(newReq);
      localStorage.setItem("tansu_requests", JSON.stringify(reqs));
      return { success: true, message: "Request received by TANSU Niraloy Intermediary Desk.", data: newReq };
    }

    if (endpoint === "/api/tenant/support") {
      const tickets = JSON.parse(localStorage.getItem("tansu_support") || "[]");
      const newTicket = {
        supportId: `SUP-${Date.now().toString().slice(-4)}`,
        ...body,
        createdAt: new Date().toISOString().split("T")[0],
        status: "OPEN"
      };
      tickets.unshift(newTicket);
      localStorage.setItem("tansu_support", JSON.stringify(tickets));
      return { success: true, message: "Support ticket submitted to Admin.", data: newTicket };
    }

    if (endpoint === "/api/admin/notices") {
      const notices = JSON.parse(localStorage.getItem("tansu_notices") || "[]");
      const newNotice = {
        noticeId: `NOT-${Date.now().toString().slice(-4)}`,
        ...body,
        sentAt: new Date().toLocaleString()
      };
      notices.unshift(newNotice);
      localStorage.setItem("tansu_notices", JSON.stringify(notices));

      if (body.dueId) {
        let dues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
        dues = dues.map(d => d.dueId === body.dueId ? {
          ...d,
          noticeSent: true,
          lastNoticeDate: new Date().toLocaleString(),
          lastNoticeType: body.noticeType || "Standard Reminder"
        } : d);
        localStorage.setItem("tansu_dues", JSON.stringify(dues));
      }
      return { success: true, message: "Notice dispatched successfully.", data: newNotice };
    }

    if (endpoint === "/api/admin/expenses") {
      const expenses = JSON.parse(localStorage.getItem("tansu_expenses") || "[]");
      const newExp = {
        expenseId: `EXP-${Date.now().toString().slice(-4)}`,
        ...body,
        voucher: `VCH-${Math.floor(1000 + Math.random() * 9000)}`,
        date: body.date || new Date().toISOString().split("T")[0]
      };
      expenses.unshift(newExp);
      localStorage.setItem("tansu_expenses", JSON.stringify(expenses));
      return { success: true, message: "Expense recorded successfully.", data: newExp };
    }

    if (endpoint === "/api/tenant/payments" || endpoint === "/api/payments") {
      let dues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
      const payments = JSON.parse(localStorage.getItem("tansu_payments") || "[]");
      const collections = JSON.parse(localStorage.getItem("tansu_collections") || "[]");
      let settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
      const props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");

      const paidAmount = Number(body.amount || 0);
      const targetDueId = body.dueId;
      const targetTenantId = body.tenantId;
      const targetPropId = body.propertyId;

      // Settle due
      let settledDue = null;
      dues = dues.map(d => {
        if ((targetDueId && d.dueId === targetDueId) || 
            (!targetDueId && targetTenantId && d.tenantId === targetTenantId && targetPropId && d.propertyId === targetPropId && d.status !== "PAID")) {
          settledDue = {
            ...d,
            paidAmount: (d.paidAmount || 0) + paidAmount,
            dueAmount: 0.0,
            status: "PAID",
            paymentDate: new Date().toISOString().split("T")[0]
          };
          return settledDue;
        }
        return d;
      });
      localStorage.setItem("tansu_dues", JSON.stringify(dues));

      // Record payment
      const txnId = body.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const newPayment = {
        paymentId: `PAY-${Date.now().toString().slice(-4)}`,
        transactionId: txnId,
        propertyId: targetPropId || (settledDue ? settledDue.propertyId : "PROP-102"),
        tenantId: targetTenantId || "TNT-101",
        amount: paidAmount,
        paymentType: body.paymentType || "RENT",
        paymentMethod: body.paymentMethod || "ONLINE_GATEWAY",
        date: new Date().toISOString().split("T")[0],
        status: "SUCCESS"
      };
      payments.unshift(newPayment);
      localStorage.setItem("tansu_payments", JSON.stringify(payments));

      // Record collection for admin inflow ledger
      const prop = props.find(p => p.propertyId === targetPropId);
      const newCollection = {
        collectionId: `COL-${Date.now().toString().slice(-4)}`,
        transactionId: txnId,
        tenantId: targetTenantId || "TNT-101",
        tenantName: settledDue ? settledDue.tenantName : "Tenant",
        propertyId: targetPropId || "PROP-102",
        flatTitle: settledDue ? settledDue.flatTitle : (prop ? prop.title : "Rental Property"),
        location: settledDue ? settledDue.location : (prop ? prop.location : "Dhaka"),
        rentMonth: settledDue ? settledDue.dueMonth : "September 2026",
        amount: paidAmount,
        paymentMethod: body.paymentMethod || "ONLINE_GATEWAY",
        paymentDate: new Date().toLocaleString(),
        status: "CLEARED"
      };
      collections.unshift(newCollection);
      localStorage.setItem("tansu_collections", JSON.stringify(collections));

      // Credit property owner settlement balance!
      const ownerId = prop ? prop.ownerId : (settledDue ? (settledDue.ownerId || "OWN-501") : "OWN-501");
      const existingSettlement = settlements.find(s => s.propertyId === targetPropId && s.ownerId === ownerId && s.type !== "WITHDRAWAL_REQUEST" && s.status !== "SETTLED");
      if (existingSettlement) {
        existingSettlement.entitledAmount += paidAmount;
        existingSettlement.remaining += paidAmount;
      } else {
        settlements.unshift({
          settlementId: `SET-${Date.now().toString().slice(-4)}`,
          ownerId: ownerId,
          ownerName: (prop && prop.ownerName) ? prop.ownerName : "Haji Mohammad Rafiq",
          propertyId: targetPropId || "PROP-102",
          flatTitle: settledDue ? settledDue.flatTitle : (prop ? prop.title : "Rental Property"),
          location: settledDue ? settledDue.location : (prop ? prop.location : "Dhaka"),
          entitledAmount: paidAmount,
          disbursed: 0,
          remaining: paidAmount,
          status: "PENDING_AUDIT",
          type: "RENTAL_INCOME",
          clearanceDate: "Available for Withdrawal",
          bankName: "Designated Bank Account"
        });
      }
      localStorage.setItem("tansu_settlements", JSON.stringify(settlements));

      return { success: true, message: "Payment processed successfully. Due settled to ৳ 0.00.", data: newPayment };
    }

    if (endpoint === "/api/owner/withdraw" || endpoint === "/api/owner/settlements/request") {
      let settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
      const users = JSON.parse(localStorage.getItem("tansu_registered_users") || "[]");
      const owner = users.find(u => u.userId === body.ownerId);

      const withdrawAmount = Number(body.amount);
      const newWithdrawal = {
        settlementId: `WDR-${Date.now().toString().slice(-4)}`,
        ownerId: body.ownerId,
        ownerName: (owner ? owner.name : (body.ownerName || "Property Owner")),
        propertyId: body.propertyId || "PORTFOLIO",
        flatTitle: body.note ? `Withdrawal Request: ${body.note}` : "Owner Earnings Withdrawal",
        location: "Dhaka",
        entitledAmount: withdrawAmount,
        disbursed: 0,
        remaining: withdrawAmount,
        status: "PENDING_ADMIN_APPROVAL",
        type: "WITHDRAWAL_REQUEST",
        requestDate: new Date().toISOString().split("T")[0],
        clearanceDate: "Awaiting Admin Approval",
        bankName: body.payoutMethod || "Bank Transfer",
        payoutDetails: body.payoutDetails || {}
      };
      settlements.unshift(newWithdrawal);
      localStorage.setItem("tansu_settlements", JSON.stringify(settlements));
      return { success: true, message: "Withdrawal request submitted to Admin successfully.", data: newWithdrawal };
    }

    if (endpoint === "/api/admin/settlements/approve") {
      let settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
      settlements = settlements.map(s => s.settlementId === body.settlementId ? {
        ...s,
        disbursed: s.entitledAmount,
        remaining: 0,
        status: "SETTLED",
        clearanceDate: new Date().toISOString().split("T")[0]
      } : s);
      localStorage.setItem("tansu_settlements", JSON.stringify(settlements));
      return { success: true, message: "Settlement approved and disbursed." };
    }

    if (endpoint === "/api/auth/signin") {
      const users = JSON.parse(localStorage.getItem("tansu_registered_users") || "[]");
      const cleanEmail = (body.email || "").trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return { success: false, status: 404, message: "No account found with this email. Please sign up first." };
      }
      if (user.password !== body.password) {
        return { success: false, status: 401, message: "Invalid credentials." };
      }

      const sessionUser = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      };
      return { success: true, message: "Sign in successful.", data: sessionUser, user: sessionUser };
    }

    if (endpoint === "/api/auth/register" || endpoint === "/api/auth/signup") {
      const users = JSON.parse(localStorage.getItem("tansu_registered_users") || "[]");
      const cleanEmail = (body.email || "").trim().toLowerCase();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, status: 400, message: "Email already registered." };
      }

      const role = (body.role === "OWNER") ? "OWNER" : "TENANT";
      const prefix = role === "OWNER" ? "OWN" : "TNT";
      const newUserId = `${prefix}-${Date.now().toString().slice(-5)}`;

      const newUser = {
        userId: newUserId,
        name: (body.fullName || body.name || "").trim(),
        email: cleanEmail,
        phone: (body.phone || "").trim(),
        password: body.password,
        role: role,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem("tansu_registered_users", JSON.stringify(users));

      const sessionUser = {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      };
      return { success: true, message: "Account registered successfully.", data: sessionUser, user: sessionUser };
    }

    return { success: true, message: "Processed successfully.", data: body };
  },

  put(endpoint, body) {
    this._init();
    if (endpoint.startsWith("/api/properties/") || endpoint.startsWith("/api/admin/properties/")) {
      let props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
      if (endpoint.endsWith("/approve")) {
        const parts = endpoint.split("/");
        const id = parts[3];
        props = props.map(p => p.propertyId === id ? {
          ...p,
          status: "APPROVED",
          verificationStatus: "VERIFIED",
          availabilityStatus: p.purpose === "SALE" ? "AVAILABLE_FOR_SALE" : "AVAILABLE_FOR_RENT",
          updatedAt: new Date().toISOString().split("T")[0]
        } : p);
        localStorage.setItem("tansu_properties", JSON.stringify(props));
        return { success: true, message: "Property approved and published." };
      }
      if (endpoint.endsWith("/reject")) {
        const parts = endpoint.split("/");
        const id = parts[3];
        props = props.map(p => p.propertyId === id ? {
          ...p,
          status: "REJECTED",
          verificationStatus: "REJECTED",
          availabilityStatus: "REJECTED",
          updatedAt: new Date().toISOString().split("T")[0]
        } : p);
        localStorage.setItem("tansu_properties", JSON.stringify(props));
        return { success: true, message: "Property rejected." };
      }
      const id = endpoint.replace("/api/properties/", "");
      props = props.map(p => p.propertyId === id ? { ...p, ...body, updatedAt: new Date().toISOString().split("T")[0] } : p);
      localStorage.setItem("tansu_properties", JSON.stringify(props));
      return { success: true, message: "Property updated successfully." };
    }

    if (endpoint.startsWith("/api/requests/") || endpoint.startsWith("/api/admin/requests/")) {
      let reqs = JSON.parse(localStorage.getItem("tansu_requests") || "[]");
      const parts = endpoint.split("/");
      const id = parts[3];

      if (endpoint.endsWith("/approve")) {
        let approvedReq = null;
        reqs = reqs.map(r => {
          if (r.requestId === id || String(r.id) === id) {
            approvedReq = { ...r, status: "APPROVED" };
            return approvedReq;
          }
          return r;
        });
        localStorage.setItem("tansu_requests", JSON.stringify(reqs));

        if (approvedReq) {
          let dues = JSON.parse(localStorage.getItem("tansu_dues") || "[]");
          let props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
          let settlements = JSON.parse(localStorage.getItem("tansu_settlements") || "[]");
          const prop = props.find(p => p.propertyId === approvedReq.propertyId);
          const isSale = (approvedReq.requestType || "").includes("BUY") || (approvedReq.requestType || "").includes("PURCHASE") || (prop && prop.purpose === "SALE");
          const rent = prop ? Number(prop.price) : 45000;
          const utility = 5000;
          const total = isSale ? rent : (rent + utility);

          const newDue = {
            dueId: `DUE-${Date.now().toString().slice(-4)}`,
            tenantId: approvedReq.tenantId,
            tenantName: approvedReq.tenantName || "Tenant",
            tenantEmail: approvedReq.tenantEmail || "",
            tenantPhone: approvedReq.tenantPhone || "",
            propertyId: approvedReq.propertyId,
            flatTitle: prop ? prop.title : `Property ${approvedReq.propertyId}`,
            location: prop ? prop.location : "Dhaka",
            dueMonth: "September 2026",
            rentAmount: rent,
            utilityCharge: isSale ? 0 : utility,
            totalBilled: total,
            paidAmount: 0,
            dueAmount: total,
            dueDate: "2026-09-25",
            daysOverdue: 0,
            status: "UNPAID",
            noticeSent: false
          };
          dues.unshift(newDue);
          localStorage.setItem("tansu_dues", JSON.stringify(dues));

          // Mark property as RENTED or SOLD
          const newStatus = isSale ? "SOLD" : "RENTED";
          props = props.map(p => p.propertyId === approvedReq.propertyId ? { ...p, availabilityStatus: newStatus } : p);
          localStorage.setItem("tansu_properties", JSON.stringify(props));

          // Credit Owner settlement / earnings
          if (prop && prop.ownerId) {
            settlements.unshift({
              settlementId: `SET-${Date.now().toString().slice(-4)}`,
              ownerId: prop.ownerId,
              ownerName: prop.ownerName || "Haji Mohammad Rafiq",
              propertyId: prop.propertyId,
              flatTitle: prop.title,
              location: prop.location,
              tenantId: approvedReq.tenantId,
              tenantName: approvedReq.tenantName || "Tenant / Buyer",
              entitledAmount: rent,
              disbursed: 0,
              remaining: rent,
              status: "PENDING_AUDIT",
              type: isSale ? "SALE_PROCEEDS" : "RENTAL_INCOME",
              clearanceDate: "Available upon tenant clearance",
              bankName: "Designated Bank Account"
            });
            localStorage.setItem("tansu_settlements", JSON.stringify(settlements));
          }
        }

        return { success: true, message: "Request approved, tenant dues generated, and owner earnings recorded." };
      }

      if (endpoint.endsWith("/reject")) {
        reqs = reqs.map(r => (r.requestId === id || String(r.id) === id) ? { ...r, status: "REJECTED" } : r);
        localStorage.setItem("tansu_requests", JSON.stringify(reqs));
        return { success: true, message: "Request rejected." };
      }
    }
    return { success: true };
  },

  delete(endpoint) {
    this._init();
    if (endpoint.startsWith("/api/properties/")) {
      const id = endpoint.replace("/api/properties/", "");
      let props = JSON.parse(localStorage.getItem("tansu_properties") || "[]");
      props = props.filter(p => p.propertyId !== id);
      localStorage.setItem("tansu_properties", JSON.stringify(props));
      return { success: true, message: "Property deleted." };
    }
    return { success: true };
  }
};
