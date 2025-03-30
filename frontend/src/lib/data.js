import { formatCurrency } from "../lib/utils";

// Format data for display
export const formatRoomData = (room) => {
  return {
    ...room,
    formattedPrice: formatCurrency(room.price / 100),
    formattedSize: `${room.size} m²`,
  };
};

export const formatServiceData = (service) => {
  return {
    ...service,
    formattedPrice: service.price
      ? formatCurrency(service.price / 100)
      : "Variable",
    formattedDuration: formatDuration(service.duration),
  };
};

export const formatDuration = (minutes) => {
  if (!minutes) return "Variable";
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes === 60) return "1 hour";
  if (minutes % 60 === 0) return `${minutes / 60} hours`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} hour${hours > 1 ? "s" : ""} ${mins} minute${
    mins > 1 ? "s" : ""
  }`;
};

export const formatAmenityData = (amenity) => {
  return {
    ...amenity,
    iconClass: `fas fa-${amenity.icon}`,
  };
};

export const formatTestimonialData = (testimonial) => {
  return {
    ...testimonial,
    stars: Array.from({ length: testimonial.rating }, (_, i) => i),
  };
};

// Helper functions for filtering and sorting
export const filterRoomsByAmenities = (rooms, selectedAmenities) => {
  if (!selectedAmenities.length) return rooms;
  return rooms.filter((room) =>
    selectedAmenities.every((amenity) => room.amenities.includes(amenity))
  );
};

export const sortRoomsByPrice = (rooms, ascending = true) => {
  return [...rooms].sort((a, b) =>
    ascending ? a.price - b.price : b.price - a.price
  );
};

export const sortRoomsBySize = (rooms, ascending = true) => {
  return [...rooms].sort((a, b) =>
    ascending ? a.size - b.size : b.size - a.size
  );
};

export const filterRoomsByGuests = (rooms, guests) => {
  if (!guests) return rooms;
  return rooms.filter((room) => room.maxGuests >= guests);
};

export const filterRoomsByPrice = (rooms, minPrice, maxPrice) => {
  let filtered = rooms;
  if (minPrice > 0)
    filtered = filtered.filter((room) => room.price >= minPrice * 100);
  if (maxPrice > 0)
    filtered = filtered.filter((room) => room.price <= maxPrice * 100);
  return filtered;
};

export const getAllUniqueAmenities = (rooms) => {
  const amenitiesSet = new Set();
  rooms.forEach((room) =>
    room.amenities.forEach((amenity) => amenitiesSet.add(amenity))
  );
  return Array.from(amenitiesSet).sort();
};

export const getAllServiceCategories = (services) => {
  const categoriesSet = new Set();
  services.forEach((service) => categoriesSet.add(service.category));
  return Array.from(categoriesSet).sort();
};

export const filterServicesByCategory = (services, category) => {
  if (!category) return services;
  return services.filter((service) => service.category === category);
};
