USE tansu_niraloy_db;
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-GLS-01', 'OWN-501', 'Luxury 3-BHK Lakeview Apartment in Gulshan-2', 'Gulshan', 'PREMIUM_FAMILY_HOUSING', 'RENT', 95000, 2550, 3, 4, 'Serene lakeside residence on Road 71, Gulshan-2. Imported Turkish marble, floor-to-ceiling soundproof glass, fitted Italian kitchen, and 2 designated covered parking slots.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-10', '2026-08-10', '2026-08-12')
ON DUPLICATE KEY UPDATE title='Luxury 3-BHK Lakeview Apartment in Gulshan-2', location='Gulshan', property_type='PREMIUM_FAMILY_HOUSING', purpose='RENT', price=95000, area=2550, bedrooms=3, bathrooms=4, description='Serene lakeside residence on Road 71, Gulshan-2. Imported Turkish marble, floor-to-ceiling soundproof glass, fitted Italian kitchen, and 2 designated covered parking slots.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-GLS-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lake View');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '24/7 Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gym');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security Guard');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'CCTV');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-GLS-02', 'OWN-501', 'Peaceful Family Residence near Gulshan Club', 'Gulshan', 'FAMILY_HOUSE', 'RENT', 75000, 2100, 3, 3, 'Quiet green ambiance on Gulshan-1 Road 132. Spacious living and dining area with private servant quarter and uninterrupted utilities.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-14', '2026-08-14', '2026-08-15')
ON DUPLICATE KEY UPDATE title='Peaceful Family Residence near Gulshan Club', location='Gulshan', property_type='FAMILY_HOUSE', purpose='RENT', price=75000, area=2100, bedrooms=3, bathrooms=3, description='Quiet green ambiance on Gulshan-1 Road 132. Spacious living and dining area with private servant quarter and uninterrupted utilities.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-GLS-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator Backup');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Guard Patrol');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'South Facing');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-GLS-03', 'OWN-506', 'Executive Studio Suite for Diplomats & Bankers', 'Gulshan', 'BACHELOR_HOUSE', 'RENT', 38000, 900, 1, 1, 'Fully furnished executive studio flat in Gulshan-1. Suitable for corporate bachelors and foreign delegates with round-the-clock TANSU security.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-18', '2026-08-18', '2026-08-20')
ON DUPLICATE KEY UPDATE title='Executive Studio Suite for Diplomats & Bankers', location='Gulshan', property_type='BACHELOR_HOUSE', purpose='RENT', price=38000, area=900, bedrooms=1, bathrooms=1, description='Fully furnished executive studio flat in Gulshan-1. Suitable for corporate bachelors and foreign delegates with round-the-clock TANSU security.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-GLS-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Furnished');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'High-Speed WiFi');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Central AC');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Rooftop Pool');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Housekeeping Support');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-GLS-04', 'OWN-507', 'Brand New Ultra-Luxury Duplex Penthouse', 'Gulshan', 'PREMIUM_FAMILY_HOUSING', 'SALE', 36000000, 4200, 5, 6, 'Masterpiece duplex in Gulshan-2 with 360-degree skyline views. Complete legal vetting and RAJUK sanction verified by TANSU legal team.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-08-22', '2026-08-22', '2026-08-25')
ON DUPLICATE KEY UPDATE title='Brand New Ultra-Luxury Duplex Penthouse', location='Gulshan', property_type='PREMIUM_FAMILY_HOUSING', purpose='SALE', price=36000000, area=4200, bedrooms=5, bathrooms=6, description='Masterpiece duplex in Gulshan-2 with 360-degree skyline views. Complete legal vetting and RAJUK sanction verified by TANSU legal team.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-GLS-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Private Rooftop Lawn');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Smart Automation');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '3 Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Private Lift Access');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-GLS-05', 'OWN-508', 'South-Facing 3-Bed Apartment for Sale', 'Gulshan', 'FLAT_SALE', 'SALE', 24500000, 2300, 3, 3, 'Ready for immediate registration in Gulshan-1. Clean property chain, no bank encumbrance, and guaranteed deed transfer mediated by TANSU.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-08-26', '2026-08-26', '2026-08-28')
ON DUPLICATE KEY UPDATE title='South-Facing 3-Bed Apartment for Sale', location='Gulshan', property_type='FLAT_SALE', purpose='SALE', price=24500000, area=2300, bedrooms=3, bathrooms=3, description='Ready for immediate registration in Gulshan-1. Clean property chain, no bank encumbrance, and guaranteed deed transfer mediated by TANSU.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-GLS-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Modern Lobby');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Substation');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Fire Hydrant System');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Community Lounge');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Parking');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BNN-01', 'OWN-502', 'Chic Modern 3-BHK Flat in Banani Road 11', 'Banani', 'FAMILY_HOUSE', 'RENT', 65000, 1950, 3, 3, 'Walking distance to Banani\'s best cafes and supermarkets while maintaining peaceful residential tranquility. Double glazed windows and modern kitchen.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-11', '2026-08-11', '2026-08-13')
ON DUPLICATE KEY UPDATE title='Chic Modern 3-BHK Flat in Banani Road 11', location='Banani', property_type='FAMILY_HOUSE', purpose='RENT', price=65000, area=1950, bedrooms=3, bathrooms=3, description='Walking distance to Banani\'s best cafes and supermarkets while maintaining peaceful residential tranquility. Double glazed windows and modern kitchen.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BNN-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '24/7 Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Wide Balconies');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BNN-02', 'OWN-503', 'Bachelor Studio Unit with High-Speed Internet', 'Banani', 'BACHELOR_HOUSE', 'RENT', 24000, 800, 1, 1, 'Ideal for tech engineers and corporate executives in Banani Block D. Clean, quiet, and legally registered with tenant-friendly guidelines.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-16', '2026-08-16', '2026-08-17')
ON DUPLICATE KEY UPDATE title='Bachelor Studio Unit with High-Speed Internet', location='Banani', property_type='BACHELOR_HOUSE', purpose='RENT', price=24000, area=800, bedrooms=1, bathrooms=1, description='Ideal for tech engineers and corporate executives in Banani Block D. Clean, quiet, and legally registered with tenant-friendly guidelines.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BNN-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Furnished');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi Included');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Rooftop Garden');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'No Curfew Hassle');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BNN-03', 'OWN-509', 'Premium 4-BHK Residence overlooking Banani Lake', 'Banani', 'PREMIUM_FAMILY_HOUSING', 'RENT', 105000, 2850, 4, 4, 'Spectacular lake views in Banani Block I. Modern architecture, timber flooring in master bed, and 24-hour guarded gate.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-20', '2026-08-20', '2026-08-21')
ON DUPLICATE KEY UPDATE title='Premium 4-BHK Residence overlooking Banani Lake', location='Banani', property_type='PREMIUM_FAMILY_HOUSING', purpose='RENT', price=105000, area=2850, bedrooms=4, bathrooms=4, description='Spectacular lake views in Banani Block I. Modern architecture, timber flooring in master bed, and 24-hour guarded gate.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BNN-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lake Panorama');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Servant Room');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gym');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Full Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Intercom');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Parking');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BNN-04', 'OWN-510', 'Cozy 2-Bed Bachelor Shared Suite in Banani', 'Banani', 'BACHELOR_HOUSE', 'RENT', 30000, 1100, 2, 2, 'Designed for two university students or young professionals sharing. Prime location near Kemal Ataturk Avenue with fast access to metro and bus corridors.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-23', '2026-08-23', '2026-08-24')
ON DUPLICATE KEY UPDATE title='Cozy 2-Bed Bachelor Shared Suite in Banani', location='Banani', property_type='BACHELOR_HOUSE', purpose='RENT', price=30000, area=1100, bedrooms=2, bathrooms=2, description='Designed for two university students or young professionals sharing. Prime location near Kemal Ataturk Avenue with fast access to metro and bus corridors.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BNN-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Separate Kitchenette');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Individual Meters');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BNN-05', 'OWN-511', 'Ready Luxury Flat for Sale in Banani Block E', 'Banani', 'FLAT_SALE', 'SALE', 21500000, 2100, 3, 3, 'Spacious north-east facing corner flat with abundant natural daylight. Legal papers scrutinized and certified by TANSU Property Verification Cell.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-08-27', '2026-08-27', '2026-08-29')
ON DUPLICATE KEY UPDATE title='Ready Luxury Flat for Sale in Banani Block E', location='Banani', property_type='FLAT_SALE', purpose='SALE', price=21500000, area=2100, bedrooms=3, bathrooms=3, description='Spacious north-east facing corner flat with abundant natural daylight. Legal papers scrutinized and certified by TANSU Property Verification Cell.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BNN-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Substation');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Community Rooftop');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-DHN-01', 'OWN-502', 'Serene Family Flat Facing Road 8A Park', 'Dhanmondi', 'FAMILY_HOUSE', 'RENT', 45000, 1750, 3, 3, 'Quiet residential sanctuary on Dhanmondi Road 8A. Minutes from reputed schools, universities, healthcare centers, and lakeside walking tracks.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-15', '2026-08-15', '2026-08-16')
ON DUPLICATE KEY UPDATE title='Serene Family Flat Facing Road 8A Park', location='Dhanmondi', property_type='FAMILY_HOUSE', purpose='RENT', price=45000, area=1750, bedrooms=3, bathrooms=3, description='Quiet residential sanctuary on Dhanmondi Road 8A. Minutes from reputed schools, universities, healthcare centers, and lakeside walking tracks.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-DHN-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Park View');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security Guard');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-DHN-02', 'OWN-512', 'Peaceful 4-BHK Lakeside Residence on Road 4', 'Dhanmondi', 'PREMIUM_FAMILY_HOUSING', 'RENT', 70000, 2350, 4, 4, 'Beautifully maintained home with lush green surroundings in old Dhanmondi. Expansive balconies and separate drawing-dining configuration.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-17', '2026-08-17', '2026-08-18')
ON DUPLICATE KEY UPDATE title='Peaceful 4-BHK Lakeside Residence on Road 4', location='Dhanmondi', property_type='PREMIUM_FAMILY_HOUSING', purpose='RENT', price=70000, area=2350, bedrooms=4, bathrooms=4, description='Beautifully maintained home with lush green surroundings in old Dhanmondi. Expansive balconies and separate drawing-dining configuration.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-DHN-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lakeside Breeze');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'CCTV');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Modern Bathrooms');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-DHN-03', 'OWN-513', 'Quiet Bachelor Studio near Medical Colleges', 'Dhanmondi', 'BACHELOR_HOUSE', 'RENT', 21000, 720, 1, 1, 'Specially verified unit near Ibn Sina and Bangladesh Medical College. Welcoming doctor interns, researchers, and professional bachelors.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-19', '2026-08-19', '2026-08-20')
ON DUPLICATE KEY UPDATE title='Quiet Bachelor Studio near Medical Colleges', location='Dhanmondi', property_type='BACHELOR_HOUSE', purpose='RENT', price=21000, area=720, bedrooms=1, bathrooms=1, description='Specially verified unit near Ibn Sina and Bangladesh Medical College. Welcoming doctor interns, researchers, and professional bachelors.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-DHN-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Water Filter');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security Guard');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-DHN-04', 'OWN-514', 'Elegant Family Flat near Satmasjid Road', 'Dhanmondi', 'FAMILY_HOUSE', 'RENT', 48000, 1850, 3, 3, 'Quiet residential by-lane off Satmasjid Road. Ideal for families wanting proximity to shopping malls, schools, and medical hubs.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-24', '2026-08-24', '2026-08-25')
ON DUPLICATE KEY UPDATE title='Elegant Family Flat near Satmasjid Road', location='Dhanmondi', property_type='FAMILY_HOUSE', purpose='RENT', price=48000, area=1850, bedrooms=3, bathrooms=3, description='Quiet residential by-lane off Satmasjid Road. Ideal for families wanting proximity to shopping malls, schools, and medical hubs.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-DHN-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Dedicated Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Titas Gas');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '24/7 Guard');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-DHN-05', 'OWN-515', 'Prime 3-Bed Apartment for Sale on Road 27', 'Dhanmondi', 'FLAT_SALE', 'SALE', 19500000, 2050, 3, 3, 'South-facing apartment on Dhanmondi 27. Freehold land ownership, all mutation and tax tokens verified clean by TANSU.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-08-29', '2026-08-29', '2026-08-30')
ON DUPLICATE KEY UPDATE title='Prime 3-Bed Apartment for Sale on Road 27', location='Dhanmondi', property_type='FLAT_SALE', purpose='SALE', price=19500000, area=2050, bedrooms=3, bathrooms=3, description='South-facing apartment on Dhanmondi 27. Freehold land ownership, all mutation and tax tokens verified clean by TANSU.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-DHN-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Substation');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Intercom System');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-UTR-01', 'OWN-501', 'Executive Modern Duplex Penthouse in Sector 4', 'Uttara', 'PREMIUM_FAMILY_HOUSING', 'RENT', 110000, 3200, 4, 5, 'Sector 4 Uttara duplex penthouse. Private roof garden, uninterrupted utilities, modern imported fittings, and round-the-clock TANSU-managed security.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-01', '2026-09-01', '2026-09-02')
ON DUPLICATE KEY UPDATE title='Executive Modern Duplex Penthouse in Sector 4', location='Uttara', property_type='PREMIUM_FAMILY_HOUSING', purpose='RENT', price=110000, area=3200, bedrooms=4, bathrooms=5, description='Sector 4 Uttara duplex penthouse. Private roof garden, uninterrupted utilities, modern imported fittings, and round-the-clock TANSU-managed security.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-UTR-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Private Terrace');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Duplex Stairs');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '3 Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Smart Locks');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Full Generator Backup');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Servant Room');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-UTR-02', 'OWN-516', 'Peaceful 3-BHK Family Flat in Sector 7', 'Uttara', 'FAMILY_HOUSE', 'RENT', 36000, 1650, 3, 3, 'Walking distance to Sector 7 park and Rabindra Sarani. Beautiful neighborhood with wide avenues, trees, and quiet residential ambiance.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-03', '2026-09-03', '2026-09-04')
ON DUPLICATE KEY UPDATE title='Peaceful 3-BHK Family Flat in Sector 7', location='Uttara', property_type='FAMILY_HOUSE', purpose='RENT', price=36000, area=1650, bedrooms=3, bathrooms=3, description='Walking distance to Sector 7 park and Rabindra Sarani. Beautiful neighborhood with wide avenues, trees, and quiet residential ambiance.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-UTR-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Covered Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'CCTV');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-UTR-03', 'OWN-517', 'Airy 3-Bed Family Apartment in Sector 13', 'Uttara', 'FAMILY_HOUSE', 'RENT', 32000, 1550, 3, 2, 'South-facing cross ventilation apartment in Sector 13. Close to renowned schools and modern shopping outlets.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-04', '2026-09-04', '2026-09-05')
ON DUPLICATE KEY UPDATE title='Airy 3-Bed Family Apartment in Sector 13', location='Uttara', property_type='FAMILY_HOUSE', purpose='RENT', price=32000, area=1550, bedrooms=3, bathrooms=2, description='South-facing cross ventilation apartment in Sector 13. Close to renowned schools and modern shopping outlets.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-UTR-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security Guard');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-UTR-04', 'OWN-518', 'Smart Bachelor Flat near Metro Station Sector 11', 'Uttara', 'BACHELOR_HOUSE', 'RENT', 19000, 750, 1, 1, 'Quick 2-minute stroll to MRT-6 Uttara North Station. Perfect for airline crew, airport personnel, or corporate professionals.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-06', '2026-09-06', '2026-09-07')
ON DUPLICATE KEY UPDATE title='Smart Bachelor Flat near Metro Station Sector 11', location='Uttara', property_type='BACHELOR_HOUSE', purpose='RENT', price=19000, area=750, bedrooms=1, bathrooms=1, description='Quick 2-minute stroll to MRT-6 Uttara North Station. Perfect for airline crew, airport personnel, or corporate professionals.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-UTR-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Near Metro');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Separate Sub-Meter');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1618219740975-d40978bb7378?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-UTR-05', 'OWN-519', 'Spacious 3-BHK Flat for Sale in Sector 14', 'Uttara', 'FLAT_SALE', 'SALE', 13500000, 1780, 3, 3, 'Brand new ready flat. Full legal clearance and transparent paperwork with TANSU administrative intermediary escrow support.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-09-08', '2026-09-08', '2026-09-09')
ON DUPLICATE KEY UPDATE title='Spacious 3-BHK Flat for Sale in Sector 14', location='Uttara', property_type='FLAT_SALE', purpose='SALE', price=13500000, area=1780, bedrooms=3, bathrooms=3, description='Brand new ready flat. Full legal clearance and transparent paperwork with TANSU administrative intermediary escrow support.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-UTR-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Covered Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Intercom');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1617104551722-3b2d51366400?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MIR-01', 'OWN-505', 'Cozy Family Apartment Near Metro Station Mirpur-10', 'Mirpur', 'FAMILY_HOUSE', 'RENT', 28000, 1350, 3, 2, 'Situated 3 minutes walk from the MRT-6 Metro Rail Station. Fast, reliable commute across Dhaka with modern residential finishes.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-05', '2026-09-05', '2026-09-06')
ON DUPLICATE KEY UPDATE title='Cozy Family Apartment Near Metro Station Mirpur-10', location='Mirpur', property_type='FAMILY_HOUSE', purpose='RENT', price=28000, area=1350, bedrooms=3, bathrooms=2, description='Situated 3 minutes walk from the MRT-6 Metro Rail Station. Fast, reliable commute across Dhaka with modern residential finishes.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MIR-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Titas Gas');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1618221381711-42ca8ab6e908?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MIR-02', 'OWN-520', 'Affordable 3-Bed Family Flat in Mirpur DOHS', 'Mirpur', 'FAMILY_HOUSE', 'RENT', 34000, 1600, 3, 3, 'Highly secure cantonment perimeter within Mirpur DOHS. Children play safely and peaceful lakeside walking track right across.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-06', '2026-09-06', '2026-09-07')
ON DUPLICATE KEY UPDATE title='Affordable 3-Bed Family Flat in Mirpur DOHS', location='Mirpur', property_type='FAMILY_HOUSE', purpose='RENT', price=34000, area=1600, bedrooms=3, bathrooms=3, description='Highly secure cantonment perimeter within Mirpur DOHS. Children play safely and peaceful lakeside walking track right across.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MIR-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'DOHS High Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Park & Lake');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Community Mosque');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Covered Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MIR-03', 'OWN-521', 'Furnished Bachelor Room with High-Speed Net in Mirpur-2', 'Mirpur', 'BACHELOR_HOUSE', 'RENT', 14000, 550, 1, 1, 'Near National Cricket Stadium and Mirpur-2 commerce college. Budget-friendly for students and junior executives with quiet study rules.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-07', '2026-09-07', '2026-09-08')
ON DUPLICATE KEY UPDATE title='Furnished Bachelor Room with High-Speed Net in Mirpur-2', location='Mirpur', property_type='BACHELOR_HOUSE', purpose='RENT', price=14000, area=550, bedrooms=1, bathrooms=1, description='Near National Cricket Stadium and Mirpur-2 commerce college. Budget-friendly for students and junior executives with quiet study rules.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MIR-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Furnished');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Meal Facility Provision');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Rooftop Access');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MIR-04', 'OWN-522', 'Bachelor Shared Suite in Mirpur-12 Metro Area', 'Mirpur', 'BACHELOR_HOUSE', 'RENT', 16000, 680, 1, 1, 'Direct access to Mirpur-12 Metro Station. Easy commute to Motijheel, Kawran Bazar, and Farmgate in 20 minutes.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-08', '2026-09-08', '2026-09-09')
ON DUPLICATE KEY UPDATE title='Bachelor Shared Suite in Mirpur-12 Metro Area', location='Mirpur', property_type='BACHELOR_HOUSE', purpose='RENT', price=16000, area=680, bedrooms=1, bathrooms=1, description='Direct access to Mirpur-12 Metro Station. Easy commute to Motijheel, Kawran Bazar, and Farmgate in 20 minutes.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MIR-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Guard');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Metro Access 2 Min');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MIR-05', 'OWN-523', 'Affordable 3-BHK Flat for Sale in Mirpur-1', 'Mirpur', 'FLAT_SALE', 'SALE', 9200000, 1420, 3, 3, 'Great value ready-to-move apartment near Mirpur-1 Sony Square. Title vetted, no dues, legal registration assistance through TANSU.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-09-09', '2026-09-09', '2026-09-10')
ON DUPLICATE KEY UPDATE title='Affordable 3-BHK Flat for Sale in Mirpur-1', location='Mirpur', property_type='FLAT_SALE', purpose='SALE', price=9200000, area=1420, bedrooms=3, bathrooms=3, description='Great value ready-to-move apartment near Mirpur-1 Sony Square. Title vetted, no dues, legal registration assistance through TANSU.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MIR-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Water Pump');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BSH-01', 'OWN-504', 'Exclusive Brand New Flat for Sale in Block I', 'Bashundhara', 'FLAT_SALE', 'SALE', 18500000, 2150, 4, 4, 'Brand new south-facing luxury apartment in Block I, Bashundhara R/A. Ready for immediate registration with full legal vetting completed by TANSU Niraloy legal desk.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-08-25', '2026-08-25', '2026-08-27')
ON DUPLICATE KEY UPDATE title='Exclusive Brand New Flat for Sale in Block I', location='Bashundhara', property_type='FLAT_SALE', purpose='SALE', price=18500000, area=2150, bedrooms=4, bathrooms=4, description='Brand new south-facing luxury apartment in Block I, Bashundhara R/A. Ready for immediate registration with full legal vetting completed by TANSU Niraloy legal desk.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BSH-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Community Hall');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Substation');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Fire Safety');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Swimming Pool');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BSH-02', 'OWN-524', 'Peaceful 3-Bed Family Flat in Block C', 'Bashundhara', 'FAMILY_HOUSE', 'RENT', 42000, 1750, 3, 3, 'Quiet residential Block C near Apollo Hospital (Evercare). Clean green air, wide roads, and round-the-clock gated security.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-28', '2026-08-28', '2026-08-29')
ON DUPLICATE KEY UPDATE title='Peaceful 3-Bed Family Flat in Block C', location='Bashundhara', property_type='FAMILY_HOUSE', purpose='RENT', price=42000, area=1750, bedrooms=3, bathrooms=3, description='Quiet residential Block C near Apollo Hospital (Evercare). Clean green air, wide roads, and round-the-clock gated security.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BSH-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security 24/7');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BSH-03', 'OWN-525', 'NSU & IUB Student Studio Bachelor Suite in Block D', 'Bashundhara', 'BACHELOR_HOUSE', 'RENT', 18000, 650, 1, 1, 'A short 5-minute walk to North South University (NSU) and Independent University Bangladesh (IUB). High-speed fiber internet and peaceful atmosphere.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-08-30', '2026-08-30', '2026-08-31')
ON DUPLICATE KEY UPDATE title='NSU & IUB Student Studio Bachelor Suite in Block D', location='Bashundhara', property_type='BACHELOR_HOUSE', purpose='RENT', price=18000, area=650, bedrooms=1, bathrooms=1, description='A short 5-minute walk to North South University (NSU) and Independent University Bangladesh (IUB). High-speed fiber internet and peaceful atmosphere.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BSH-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi Included');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Study Desk');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BSH-04', 'OWN-526', 'Shared 2-Bed Bachelor Unit in Block F', 'Bashundhara', 'BACHELOR_HOUSE', 'RENT', 26000, 980, 2, 2, 'Ideal for 2 university classmates or office colleagues. Close to restaurants, gyms, and shuttle stops with zero landlord disturbance.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-02', '2026-09-02', '2026-09-03')
ON DUPLICATE KEY UPDATE title='Shared 2-Bed Bachelor Unit in Block F', location='Bashundhara', property_type='BACHELOR_HOUSE', purpose='RENT', price=26000, area=980, bedrooms=2, bathrooms=2, description='Ideal for 2 university classmates or office colleagues. Close to restaurants, gyms, and shuttle stops with zero landlord disturbance.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BSH-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balcony');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '24h Guard');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-BSH-05', 'OWN-527', 'Luxury Duplex with Private Garden in Block G', 'Bashundhara', 'PREMIUM_FAMILY_HOUSING', 'RENT', 88000, 2900, 4, 4, 'Spectacular architectural duplex in Bashundhara Block G with private manicured lawn and imported sanitary fittings.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-05', '2026-09-05', '2026-09-06')
ON DUPLICATE KEY UPDATE title='Luxury Duplex with Private Garden in Block G', location='Bashundhara', property_type='PREMIUM_FAMILY_HOUSING', purpose='RENT', price=88000, area=2900, bedrooms=4, bathrooms=4, description='Spectacular architectural duplex in Bashundhara Block G with private manicured lawn and imported sanitary fittings.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-BSH-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Private Garden');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, '2 Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Smart Locks');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Full Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Servant Bath');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MOH-01', 'OWN-528', 'Serene 3-Bed Family Flat in Japan Garden City', 'Mohammadpur', 'FAMILY_HOUSE', 'RENT', 32000, 1480, 3, 2, 'Within Japan Garden City complex. Excellent self-contained family community with parks, internal supermarkets, and 24-hour security guards.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-02', '2026-09-02', '2026-09-03')
ON DUPLICATE KEY UPDATE title='Serene 3-Bed Family Flat in Japan Garden City', location='Mohammadpur', property_type='FAMILY_HOUSE', purpose='RENT', price=32000, area=1480, bedrooms=3, bathrooms=2, description='Within Japan Garden City complex. Excellent self-contained family community with parks, internal supermarkets, and 24-hour security guards.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MOH-01');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gated Community');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Kids Playground');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Swimming Pool');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Mosque');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MOH-02', 'OWN-529', 'Bright South-Facing Flat in Lalmatia Block B', 'Mohammadpur', 'FAMILY_HOUSE', 'RENT', 38000, 1650, 3, 3, 'Bordering Dhanmondi 27. Lalmatia Block B is renowned for its cultural environment, wide trees, and quiet residential neighborhood.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-04', '2026-09-04', '2026-09-05')
ON DUPLICATE KEY UPDATE title='Bright South-Facing Flat in Lalmatia Block B', location='Mohammadpur', property_type='FAMILY_HOUSE', purpose='RENT', price=38000, area=1650, bedrooms=3, bathrooms=3, description='Bordering Dhanmondi 27. Lalmatia Block B is renowned for its cultural environment, wide trees, and quiet residential neighborhood.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MOH-02');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas Connection');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Park Nearby');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MOH-03', 'OWN-530', 'Bachelor Studio Flat near Ring Road Mohammadpur', 'Mohammadpur', 'BACHELOR_HOUSE', 'RENT', 15000, 600, 1, 1, 'Situated on Ring Road with instant bus and rickshaw connections to Dhanmondi, Farmgate, and Mirpur. Clean, independent bachelor suite.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-06', '2026-09-06', '2026-09-07')
ON DUPLICATE KEY UPDATE title='Bachelor Studio Flat near Ring Road Mohammadpur', location='Mohammadpur', property_type='BACHELOR_HOUSE', purpose='RENT', price=15000, area=600, bedrooms=1, bathrooms=1, description='Situated on Ring Road with instant bus and rickshaw connections to Dhanmondi, Farmgate, and Mirpur. Clean, independent bachelor suite.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MOH-03');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'WiFi');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Water 24/7');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Security');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Separate Kitchenette');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MOH-04', 'OWN-531', 'Quiet 3-BHK Family Home on Asad Avenue', 'Mohammadpur', 'FAMILY_HOUSE', 'RENT', 40000, 1720, 3, 3, 'Convenient location on Asad Avenue near Town Hall market and St. Joseph School. Spacious floor layout with natural breeze.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_RENT', '2026-09-08', '2026-09-08', '2026-09-09')
ON DUPLICATE KEY UPDATE title='Quiet 3-BHK Family Home on Asad Avenue', location='Mohammadpur', property_type='FAMILY_HOUSE', purpose='RENT', price=40000, area=1720, bedrooms=3, bathrooms=3, description='Convenient location on Asad Avenue near Town Hall market and St. Joseph School. Spacious floor layout with natural breeze.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_RENT';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MOH-04');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Elevator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Gas');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Car Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Guard Patrol');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Balconies');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1000&q=80');
INSERT INTO properties (property_id, owner_id, title, location, property_type, purpose, price, area, bedrooms, bathrooms, description, status, verification_status, availability_status, submission_date, created_at, updated_at)
VALUES ('PROP-MOH-05', 'OWN-532', 'Brand New Flat for Sale on Ring Road Extension', 'Mohammadpur', 'FLAT_SALE', 'SALE', 11500000, 1600, 3, 3, 'Under-market price opportunity in Mohammadpur. Clear title deeds and registration paperwork verified by TANSU legal desk.', 'APPROVED', 'VERIFIED', 'AVAILABLE_FOR_SALE', '2026-09-10', '2026-09-10', '2026-09-11')
ON DUPLICATE KEY UPDATE title='Brand New Flat for Sale on Ring Road Extension', location='Mohammadpur', property_type='FLAT_SALE', purpose='SALE', price=11500000, area=1600, bedrooms=3, bathrooms=3, description='Under-market price opportunity in Mohammadpur. Clear title deeds and registration paperwork verified by TANSU legal desk.', status='APPROVED', verification_status='VERIFIED', availability_status='AVAILABLE_FOR_SALE';
SET @pid = (SELECT id FROM properties WHERE property_id = 'PROP-MOH-05');
DELETE FROM property_amenities WHERE property_id = @pid;
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'RAJUK Approved');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Generator');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Lift');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Parking');
INSERT INTO property_amenities (property_id, amenity) VALUES (@pid, 'Fire Safety');
DELETE FROM property_images WHERE property_id = @pid;
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1000&q=80');
INSERT INTO property_images (property_id, image_url) VALUES (@pid, 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?auto=format&fit=crop&w=1000&q=80');
