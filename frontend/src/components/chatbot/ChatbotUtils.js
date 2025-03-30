// import { formatRoomData, formatServiceData } from "../../lib/data";

// // Keywords for different query types
// const ROOM_KEYWORDS = [
//   "room",
//   "rooms",
//   "accommodation",
//   "stay",
//   "suite",
//   "book",
//   "bed",
//   "bedroom",
//   "occupancy",
//   "king",
//   "queen",
//   "double",
//   "single",
//   "twin",
//   "family",
//   "deluxe",
//   "standard",
//   "luxury",
//   "premium",
//   "executive",
//   "presidential",
//   "sleep",
//   "night",
// ];

// const SERVICE_KEYWORDS = [
//   "service",
//   "services",
//   "spa",
//   "massage",
//   "treatment",
//   "wellness",
//   "fitness",
//   "gym",
//   "restaurant",
//   "dining",
//   "eat",
//   "food",
//   "breakfast",
//   "lunch",
//   "dinner",
//   "meal",
//   "pool",
//   "swim",
//   "sauna",
//   "jacuzzi",
//   "hot tub",
//   "steam",
//   "amenity",
//   "amenities",
// ];

// const LOCATION_KEYWORDS = [
//   "nearby",
//   "around",
//   "location",
//   "area",
//   "attraction",
//   "attractions",
//   "visit",
//   "see",
//   "tour",
//   "travel",
//   "explore",
//   "adventure",
//   "city",
//   "town",
//   "local",
//   "distance",
//   "close",
//   "near",
//   "surrounding",
//   "neighborhood",
//   "environment",
// ];

// const PRICE_KEYWORDS = [
//   "price",
//   "cost",
//   "rate",
//   "rates",
//   "pricing",
//   "expensive",
//   "cheap",
//   "affordable",
//   "luxury",
//   "budget",
//   "economical",
//   "premium",
//   "fee",
//   "charge",
//   "bill",
//   "payment",
// ];

// const RECOMMENDATION_KEYWORDS = [
//   "recommend",
//   "suggestion",
//   "suggest",
//   "best",
//   "top",
//   "popular",
//   "favorite",
//   "recommended",
//   "ideal",
//   "perfect",
//   "suited",
//   "appropriate",
//   "good",
// ];

// const AVAILABILITY_KEYWORDS = [
//   "available",
//   "availability",
//   "book",
//   "booking",
//   "reserve",
//   "reservation",
//   "when",
//   "date",
//   "dates",
//   "schedule",
//   "calendar",
//   "vacancy",
//   "vacant",
// ];

// const FAMILY_KEYWORDS = [
//   "family",
//   "kid",
//   "kids",
//   "child",
//   "children",
//   "baby",
//   "toddler",
//   "infant",
//   "teenager",
//   "parent",
//   "parents",
//   "family-friendly",
//   "childcare",
// ];

// const ACCESSIBILITY_KEYWORDS = [
//   "accessible",
//   "accessibility",
//   "disability",
//   "disabled",
//   "wheelchair",
//   "mobility",
//   "handicap",
//   "special needs",
//   "barrier-free",
//   "ada",
//   "elevator",
// ];

// const getCategories = (query) => {
//   const lowercaseQuery = query.toLowerCase();
//   const categories = [];

//   if (ROOM_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))) {
//     categories.push("rooms");
//   }

//   if (SERVICE_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))) {
//     categories.push("services");
//   }

//   if (LOCATION_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))) {
//     categories.push("location");
//   }

//   if (PRICE_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))) {
//     categories.push("price");
//   }

//   if (
//     RECOMMENDATION_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))
//   ) {
//     categories.push("recommendation");
//   }

//   if (
//     AVAILABILITY_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))
//   ) {
//     categories.push("availability");
//   }

//   if (FAMILY_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))) {
//     categories.push("family");
//   }

//   if (
//     ACCESSIBILITY_KEYWORDS.some((keyword) => lowercaseQuery.includes(keyword))
//   ) {
//     categories.push("accessibility");
//   }

//   return categories;
// };

// // Function to filter rooms based on query
// const filterRooms = (rooms, query) => {
//   const lowercaseQuery = query.toLowerCase();

//   // Special case for "what rooms do you have" type queries
//   if (
//     lowercaseQuery.includes("what room") ||
//     lowercaseQuery.includes("which room") ||
//     lowercaseQuery.includes("list of room") ||
//     lowercaseQuery === "rooms" ||
//     lowercaseQuery === "your rooms" ||
//     lowercaseQuery.includes("available room")
//   ) {
//     // Return all rooms for this general query
//     return rooms;
//   }

//   // Extract any known specific requirements
//   const isFamilyQuery = FAMILY_KEYWORDS.some((keyword) =>
//     lowercaseQuery.includes(keyword)
//   );
//   const isLuxuryQuery =
//     lowercaseQuery.includes("luxury") ||
//     lowercaseQuery.includes("premium") ||
//     lowercaseQuery.includes("best");
//   const isAccessibilityQuery = ACCESSIBILITY_KEYWORDS.some((keyword) =>
//     lowercaseQuery.includes(keyword)
//   );

//   // Filter rooms based on requirements
//   const filteredRooms = rooms.filter((room) => {
//     const roomName = room.name.toLowerCase();
//     const roomDescription = room.description.toLowerCase();
//     const amenitiesList = room.amenities
//       ? room.amenities.map((a) => a.toLowerCase()).join(" ")
//       : "";

//     // For family-specific queries
//     if (isFamilyQuery) {
//       return (
//         roomName.includes("family") ||
//         room.capacity >= 3 ||
//         roomDescription.includes("famil") ||
//         roomDescription.includes("kid") ||
//         roomDescription.includes("child")
//       );
//     }

//     // For luxury-specific queries
//     if (isLuxuryQuery) {
//       return (
//         roomName.includes("luxury") ||
//         roomName.includes("premium") ||
//         roomName.includes("suite") ||
//         roomName.includes("deluxe") ||
//         roomDescription.includes("luxury") ||
//         roomDescription.includes("premium") ||
//         roomDescription.includes("elegant") ||
//         roomDescription.includes("exclusive")
//       );
//     }

//     // For accessibility-specific queries
//     if (isAccessibilityQuery) {
//       return (
//         roomName.includes("accessible") ||
//         roomDescription.includes("accessible") ||
//         roomDescription.includes("wheelchair") ||
//         amenitiesList.includes("accessible")
//       );
//     }

//     // Check for specific terms match in name, description or amenities
//     return (
//       roomName.includes(lowercaseQuery) ||
//       roomDescription.includes(lowercaseQuery) ||
//       amenitiesList.includes(lowercaseQuery)
//     );
//   });

//   // If no rooms were found with specific filtering, return all rooms
//   // This prevents "I couldn't find any rooms" responses for general queries
//   if (
//     filteredRooms.length === 0 &&
//     (lowercaseQuery.includes("room") ||
//       lowercaseQuery === "room" ||
//       lowercaseQuery === "rooms" ||
//       lowercaseQuery.includes("accommodation"))
//   ) {
//     return rooms;
//   }

//   return filteredRooms;
// };

// // Function to filter services based on query
// const filterServices = (services, query) => {
//   const lowercaseQuery = query.toLowerCase();

//   return services.filter((service) => {
//     const serviceName = service.name.toLowerCase();
//     const serviceDescription = service.description.toLowerCase();

//     return (
//       serviceName.includes(lowercaseQuery) ||
//       serviceDescription.includes(lowercaseQuery)
//     );
//   });
// };

// // Generate responses for room-related queries
// const generateRoomResponse = (query, rooms) => {
//   const filteredRooms = filterRooms(rooms, query);

//   if (filteredRooms.length === 0) {
//     return "I couldn't find any rooms matching your criteria. We offer standard rooms, deluxe rooms, and suites. Would you like information about any of these?";
//   }

//   if (filteredRooms.length === 1) {
//     const room = filteredRooms[0];
//     const formattedRoom = formatRoomData(room);

//     return `I found the perfect room for you: ${room.name}. ${room.description} It's priced at ${formattedRoom.formattedPrice} per night and can accommodate up to ${room.capacity} guests. Would you like to book this room?`;
//   }

//   // Multiple rooms found
//   const roomList = filteredRooms
//     .map((room) => {
//       const formattedRoom = formatRoomData(room);
//       return `- ${room.name}: ${formattedRoom.formattedPrice} per night, ${room.capacity} guests max`;
//     })
//     .join("\n");

//   return `I found ${filteredRooms.length} rooms that might interest you:\n${roomList}\n\nWould you like more details about any of these rooms?`;
// };

// // Generate responses for service-related queries
// const generateServiceResponse = (query, services) => {
//   const filteredServices = filterServices(services, query);

//   if (filteredServices.length === 0) {
//     return "I couldn't find any services matching your criteria. We offer spa services, dining options, and recreational activities. What type of service are you interested in?";
//   }

//   if (filteredServices.length === 1) {
//     const service = filteredServices[0];
//     const formattedService = formatServiceData(service);

//     return `I recommend our ${service.name} service. ${service.description} ${
//       service.price ? "It costs " + formattedService.formattedPrice + "." : ""
//     } Would you like to book this service?`;
//   }

//   // Multiple services found
//   const serviceList = filteredServices
//     .map((service) => {
//       const formattedService = formatServiceData(service);
//       return `- ${service.name}${
//         service.price ? " (" + formattedService.formattedPrice + ")" : ""
//       }`;
//     })
//     .join("\n");

//   return `I found ${filteredServices.length} services that might interest you:\n${serviceList}\n\nWould you like more details about any of these services?`;
// };

// // Generate responses for location and nearby attractions queries
// const generateLocationResponse = (query) => {
//   const lowercaseQuery = query.toLowerCase();

//   // Dining and restaurant recommendations
//   if (
//     lowercaseQuery.includes("restaurant") ||
//     lowercaseQuery.includes("food") ||
//     lowercaseQuery.includes("eat") ||
//     lowercaseQuery.includes("dining") ||
//     lowercaseQuery.includes("breakfast") ||
//     lowercaseQuery.includes("lunch") ||
//     lowercaseQuery.includes("dinner")
//   ) {
//     return (
//       "There are several excellent dining options near our hotel:\n\n" +
//       "🍽️ On-site dining:\n" +
//       "- 'Ocean View Restaurant' - Our signature restaurant serving international cuisine and local specialties\n" +
//       "- 'Sunset Lounge' - Cocktails and light meals with panoramic views\n\n" +
//       "🍽️ Within walking distance (5-10 minutes):\n" +
//       "- 'Seaside Grill' - Fresh seafood and ocean views\n" +
//       "- 'Bella Italia' - Authentic Italian cuisine with homemade pasta\n" +
//       "- 'Green Garden' - Vegetarian and vegan options\n" +
//       "- 'Street Food Market' - Local delicacies and international food stalls\n\n" +
//       "🍽️ Worth the short drive (10-15 minutes):\n" +
//       "- 'La Maison' - Fine dining French restaurant with award-winning chef\n" +
//       "- 'Spice Route' - Asian fusion cuisine\n\n" +
//       "Would you like me to make a reservation at any of these restaurants for you?"
//     );
//   }

//   // Beach and water activities
//   if (
//     lowercaseQuery.includes("beach") ||
//     lowercaseQuery.includes("swim") ||
//     lowercaseQuery.includes("ocean") ||
//     lowercaseQuery.includes("sea") ||
//     lowercaseQuery.includes("water activities") ||
//     lowercaseQuery.includes("water sports")
//   ) {
//     return (
//       "Our hotel has excellent access to beaches and water activities:\n\n" +
//       "🏖️ Golden Sands Beach - Just a 5-minute walk from our hotel\n" +
//       "- Clean, white sand beaches with crystal clear waters\n" +
//       "- Beach chairs and umbrellas available (hotel guests receive 15% discount)\n" +
//       "- Lifeguards on duty from 8am to 6pm daily\n\n" +
//       "🏄 Water Activities Available:\n" +
//       "- Jet skiing and parasailing (hotel concierge can arrange)\n" +
//       "- Scuba diving and snorkeling tours to nearby reef\n" +
//       "- Glass-bottom boat tours to see marine life\n" +
//       "- Sunset sailing cruises\n\n" +
//       "🏊 Hotel Pool:\n" +
//       "- Heated infinity pool overlooking the ocean\n" +
//       "- Children's pool and water play area\n" +
//       "- Pool bar serving drinks and snacks\n\n" +
//       "Would you like me to arrange any water activities for your stay?"
//     );
//   }

//   // Cultural and historical attractions
//   if (
//     lowercaseQuery.includes("museum") ||
//     lowercaseQuery.includes("history") ||
//     lowercaseQuery.includes("culture") ||
//     lowercaseQuery.includes("art") ||
//     lowercaseQuery.includes("historic") ||
//     lowercaseQuery.includes("heritage")
//   ) {
//     return (
//       "There are several fascinating cultural and historical attractions near our hotel:\n\n" +
//       "🏛️ Museums & Galleries:\n" +
//       "- City Art Museum (3 miles) - Contemporary and classical art exhibitions\n" +
//       "- Maritime History Museum (2 miles) - Local seafaring heritage and artifacts\n" +
//       "- Natural History Museum (4 miles) - Regional flora, fauna, and geology\n\n" +
//       "🏛️ Historical Sites:\n" +
//       "- Old Town Historic District (3 miles) - 18th-century architecture and cobblestone streets\n" +
//       "- Ancient Lighthouse (5 miles) - Working lighthouse with panoramic coastal views\n" +
//       "- Colonial Fort (7 miles) - Military history with daily reenactments\n\n" +
//       "🏛️ Cultural Experiences:\n" +
//       "- Local Crafts Market (downtown, 2.5 miles) - Traditional artisans and souvenirs\n" +
//       "- Cultural Performance Center - Traditional music and dance shows every evening\n" +
//       "- Guided Walking Tours of the Historic District - Available daily\n\n" +
//       "Our concierge can arrange transportation and tickets to any of these attractions. Would you like more specific information?"
//     );
//   }

//   // Shopping opportunities
//   if (
//     lowercaseQuery.includes("shop") ||
//     lowercaseQuery.includes("shopping") ||
//     lowercaseQuery.includes("mall") ||
//     lowercaseQuery.includes("souvenir") ||
//     lowercaseQuery.includes("buy")
//   ) {
//     return (
//       "Shopping enthusiasts will find plenty of options near our hotel:\n\n" +
//       "🛍️ Luxury Shopping:\n" +
//       "- Waterfront Promenade (1 mile) - Designer boutiques and jewelry stores\n" +
//       "- Fashion District (3 miles) - High-end fashion brands and department stores\n\n" +
//       "🛍️ Local and Artisanal:\n" +
//       "- Artisan Market (downtown, 2 miles) - Handcrafted souvenirs, art, and local products\n" +
//       "- Farmers Market (Saturday mornings, 1 mile) - Local produce, food, and crafts\n\n" +
//       "🛍️ Shopping Centers:\n" +
//       "- Coastal Mall (4 miles) - Over 150 stores, restaurants, and cinema complex\n" +
//       "- Outlet Shopping Village (10 miles) - Discounted designer and brand name stores\n\n" +
//       "The hotel offers a complimentary shuttle to the Coastal Mall twice daily. Would you like more information about shopping in the area?"
//     );
//   }

//   // Family activities
//   if (
//     lowercaseQuery.includes("kid") ||
//     lowercaseQuery.includes("kids") ||
//     lowercaseQuery.includes("family") ||
//     lowercaseQuery.includes("children") ||
//     lowercaseQuery.includes("child")
//   ) {
//     return (
//       "Families with children will find plenty of fun activities nearby:\n\n" +
//       "👨‍👩‍👧‍👦 Family Attractions:\n" +
//       "- Adventure Theme Park (10 miles) - Rides and attractions for all ages\n" +
//       "- Aquarium & Marine Center (5 miles) - Interactive exhibits and daily shows\n" +
//       "- Mini Golf & Family Fun Center (2 miles) - Mini golf, arcade games, and bumper cars\n\n" +
//       "👨‍👩‍👧‍👦 Outdoor Activities:\n" +
//       "- Children's Beach (5 minute walk) - Calmer waters and playground equipment\n" +
//       "- Nature Reserve (7 miles) - Family-friendly hiking trails and wildlife spotting\n" +
//       "- Bicycle Rentals - Child seats and kids' bikes available\n\n" +
//       "👨‍👩‍👧‍👦 Hotel Activities for Kids:\n" +
//       "- Kids Club (ages 4-12) with daily activities\n" +
//       "- Children's pool and water play area\n" +
//       "- Family movie nights by the pool\n\n" +
//       "Our concierge can help plan the perfect family day. Would you like me to suggest an itinerary based on your children's ages?"
//     );
//   }

//   // Outdoor and nature activities
//   if (
//     lowercaseQuery.includes("nature") ||
//     lowercaseQuery.includes("hike") ||
//     lowercaseQuery.includes("hiking") ||
//     lowercaseQuery.includes("outdoor") ||
//     lowercaseQuery.includes("park") ||
//     lowercaseQuery.includes("trail")
//   ) {
//     return (
//       "Nature lovers will find beautiful outdoor spaces to explore near our hotel:\n\n" +
//       "🌳 Parks and Nature:\n" +
//       "- Coastal National Park (15 miles) - Scenic hiking trails, wildlife viewing, and natural beauty\n" +
//       "- Botanical Gardens (6 miles) - Exotic plants, flowers, and peaceful walking paths\n" +
//       "- Bird Sanctuary (8 miles) - Over 200 species of birds and guided tours\n\n" +
//       "🌳 Hiking and Trails:\n" +
//       "- Cliffside Coastal Path (starts 1 mile from hotel) - Stunning ocean views\n" +
//       "- Forest Nature Reserve (12 miles) - Trails ranging from easy to challenging\n" +
//       "- Guided Nature Walks - Led by local experts, available daily\n\n" +
//       "🌳 Outdoor Adventures:\n" +
//       "- Mountain Biking Trails (10 miles) - Various difficulty levels with bike rentals available\n" +
//       "- Kayaking in Mangrove Estuary (8 miles) - Guided tours through pristine waterways\n" +
//       "- Zip Lining Adventure (20 miles) - Soar through forest canopy\n\n" +
//       "The hotel offers packed lunches for day trips. Would you like more information about any of these outdoor activities?"
//     );
//   }

//   // Default nearby attractions response
//   return (
//     "Our hotel is perfectly located with easy access to many fantastic attractions and activities:\n\n" +
//     "🏖️ Beaches & Water:\n" +
//     "- Golden Sands Beach (5 minute walk) - Swimming, sunbathing, and water sports\n" +
//     "- Marina and Yacht Club (2 miles) - Boat tours and sailing excursions\n\n" +
//     "🏛️ Culture & History:\n" +
//     "- Historic District (3 miles) - Museums, architecture, and guided tours\n" +
//     "- Cultural Center (2.5 miles) - Art exhibits and performances\n\n" +
//     "🛍️ Shopping & Dining:\n" +
//     "- City Center (2 miles) - Shopping, dining, and entertainment\n" +
//     "- Local Markets (various locations) - Traditional crafts and souvenirs\n\n" +
//     "👨‍👩‍👧‍👦 Family Fun:\n" +
//     "- Amusement Park (10 miles) - Rides, games, and family entertainment\n" +
//     "- Aquarium & Marine Center (5 miles) - Sea life exhibits and shows\n\n" +
//     "🌳 Nature & Recreation:\n" +
//     "- National Park (15 miles) - Hiking trails and scenic beauty\n" +
//     "- Golf Course (5 miles) - 18-hole championship course\n\n" +
//     "Our concierge can help arrange transportation and tours to any of these destinations. Is there a specific type of attraction you're interested in?"
//   );
// };

// // Generate responses for recommendation queries
// const generateRecommendationResponse = (query, rooms, services) => {
//   if (
//     query.toLowerCase().includes("room") ||
//     ROOM_KEYWORDS.some((keyword) => query.toLowerCase().includes(keyword))
//   ) {
//     // Find a luxury room or any featured room, or just the first room
//     const recommendedRoom =
//       rooms.filter(
//         (room) =>
//           room.name.toLowerCase().includes("luxury") ||
//           room.name.toLowerCase().includes("suite") ||
//           room.name.toLowerCase().includes("premium") ||
//           room.featured
//       )[0] || rooms[0];

//     if (recommendedRoom) {
//       const formattedRoom = formatRoomData(recommendedRoom);
//       return `I highly recommend our ${recommendedRoom.name}. ${recommendedRoom.description} It's priced at ${formattedRoom.formattedPrice} per night and our guests consistently rate it highly. Would you like to book this room?`;
//     }
//   }

//   if (
//     query.toLowerCase().includes("service") ||
//     SERVICE_KEYWORDS.some((keyword) => query.toLowerCase().includes(keyword))
//   ) {
//     // Find a featured service or just the first one
//     const recommendedService =
//       services.filter((service) => service.featured)[0] || services[0];

//     if (recommendedService) {
//       const formattedService = formatServiceData(recommendedService);
//       return `I recommend trying our ${recommendedService.name} service. ${
//         recommendedService.description
//       } ${
//         recommendedService.price
//           ? "It costs " + formattedService.formattedPrice + "."
//           : ""
//       } Many of our guests particularly enjoy this service. Would you like to book it?`;
//     }
//   }

//   // General recommendations
//   return "Based on our guests' preferences, I'd recommend our Deluxe Ocean View Room for accommodation, our signature Spa Package for relaxation, and visiting the nearby Historic District for exploration. Would you like more details about any of these recommendations?";
// };

// // Generate hotel amenities information
// const generateAmenitiesResponse = () => {
//   return (
//     "Our hotel offers a variety of premium amenities for our guests:\n\n" +
//     "🏊 Recreation & Relaxation:\n" +
//     "- Heated infinity pool with ocean views\n" +
//     "- Full-service spa with massage and beauty treatments\n" +
//     "- 24-hour fitness center with modern equipment\n" +
//     "- Sauna and steam room\n" +
//     "- Yoga and meditation classes\n\n" +
//     "🍽️ Dining & Refreshments:\n" +
//     "- 'Ocean View' signature restaurant (breakfast, lunch, dinner)\n" +
//     "- 'Sunset Lounge' for cocktails and light meals\n" +
//     "- Pool bar serving drinks and snacks\n" +
//     "- 24-hour room service\n" +
//     "- Complimentary breakfast buffet\n\n" +
//     "👨‍👩‍👧‍👦 Family Services:\n" +
//     "- Kids Club with supervised activities\n" +
//     "- Children's pool and play area\n" +
//     "- Babysitting services (additional charge)\n" +
//     "- Family movie nights\n\n" +
//     "💼 Business & Connectivity:\n" +
//     "- High-speed WiFi throughout the property\n" +
//     "- Business center with printing services\n" +
//     "- Meeting and event spaces\n" +
//     "- Translation services\n\n" +
//     "🚗 Transportation & Convenience:\n" +
//     "- Free parking for guests\n" +
//     "- Airport shuttle service (additional charge)\n" +
//     "- Car rental desk\n" +
//     "- Concierge services for tour arrangements\n" +
//     "- Daily housekeeping\n\n" +
//     "Would you like more information about any of these amenities?"
//   );
// };

// // Main function to generate chatbot responses
// export const generateChatbotResponse = (query) => {
//   // Process query by simple keyword matching first
//   const lowercaseQuery = query.toLowerCase();

//   // Handle amenities queries
//   if (
//     lowercaseQuery.includes("amenity") ||
//     lowercaseQuery.includes("amenities") ||
//     lowercaseQuery.includes("facility") ||
//     lowercaseQuery.includes("facilities") ||
//     lowercaseQuery.includes("hotel feature") ||
//     lowercaseQuery.includes("what does the hotel offer") ||
//     lowercaseQuery.includes("what does your hotel offer") ||
//     lowercaseQuery.includes("what do you offer") ||
//     lowercaseQuery.includes("hotel service")
//   ) {
//     return generateAmenitiesResponse();
//   }

//   // Check for nearby attractions queries
//   if (
//     lowercaseQuery.includes("nearby") ||
//     lowercaseQuery.includes("attraction") ||
//     lowercaseQuery.includes("around") ||
//     lowercaseQuery.includes("visit") ||
//     lowercaseQuery.includes("tour") ||
//     lowercaseQuery.includes("around the hotel") ||
//     lowercaseQuery.includes("close to") ||
//     lowercaseQuery.includes("near the hotel")
//   ) {
//     return generateLocationResponse(query);
//   }

//   // Check for restaurant queries
//   if (
//     lowercaseQuery.includes("restaurant") ||
//     lowercaseQuery.includes("food") ||
//     lowercaseQuery.includes("eat") ||
//     lowercaseQuery.includes("dining") ||
//     lowercaseQuery.includes("dinner") ||
//     lowercaseQuery.includes("lunch") ||
//     lowercaseQuery.includes("breakfast")
//   ) {
//     return generateLocationResponse(query);
//   }

//   // Check for museum/culture queries
//   if (
//     lowercaseQuery.includes("museum") ||
//     lowercaseQuery.includes("history") ||
//     lowercaseQuery.includes("culture") ||
//     lowercaseQuery.includes("art") ||
//     lowercaseQuery.includes("historic")
//   ) {
//     return generateLocationResponse(query);
//   }

//   // Check for beach/swim queries
//   if (
//     lowercaseQuery.includes("beach") ||
//     lowercaseQuery.includes("swim") ||
//     lowercaseQuery.includes("ocean") ||
//     lowercaseQuery.includes("sea") ||
//     lowercaseQuery.includes("water")
//   ) {
//     return generateLocationResponse(query);
//   }

//   // Ensure hotel data is available for other types of queries
//   if (
//     !window.hotelData ||
//     !window.hotelData.rooms ||
//     !window.hotelData.services
//   ) {
//     return "I'm getting our hotel information ready. Please try again in a moment.";
//   }

//   const { rooms, services } = window.hotelData;
//   const categories = getCategories(query);

//   // Simple greeting responses
//   if (lowercaseQuery.includes("hello") || lowercaseQuery.includes("hi")) {
//     return "Hello! How can I assist you with your stay at our hotel? I can help with room information, services, or nearby attractions.";
//   }

//   if (
//     lowercaseQuery.includes("thank you") ||
//     lowercaseQuery.includes("thanks")
//   ) {
//     return "You're welcome! Is there anything else I can help you with?";
//   }

//   // Process query by categorizing it
//   if (categories.includes("rooms")) {
//     return generateRoomResponse(query, rooms);
//   }

//   if (categories.includes("services")) {
//     return generateServiceResponse(query, services);
//   }

//   if (categories.includes("location")) {
//     return generateLocationResponse(query);
//   }

//   if (categories.includes("recommendation")) {
//     return generateRecommendationResponse(query, rooms, services);
//   }

//   // For fallback responses
//   if (lowercaseQuery.includes("help") || lowercaseQuery.includes("info")) {
//     return "I can help you with information about our rooms, services, facilities, and nearby attractions. What would you like to know about?";
//   }

//   // Default response if no category matches
//   return "I'm not sure I understood what you're looking for. I can provide information about our rooms, services, or nearby attractions. Could you please clarify what you'd like to know?";
// };
