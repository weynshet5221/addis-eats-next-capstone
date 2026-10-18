export const NEIGHBOURHOODS = [
  "Bole",
  "Arada",
  "Kirkos",
  "Yeka",
  "Lideta",
  "Gullele",
  "Nifas Silk-Lafto",
  "Kolfe Keranio",
  "Addis Ketema",
  "Akaki Kality",
];

export const RESTAURANT_LOCATION = {
  name: "Addis Eats Restaurant",
  latitude: 8.998,
  longitude: 38.780,
};

export const NEIGHBOURHOOD_LOCATIONS = {
  Bole: { latitude: 8.995, longitude: 38.785 },
  Arada: { latitude: 9.035, longitude: 38.757 },
  Kirkos: { latitude: 9.010, longitude: 38.763 },
  Yeka: { latitude: 9.035, longitude: 38.805 },
  Lideta: { latitude: 9.018, longitude: 38.746 },
  Gullele: { latitude: 9.060, longitude: 38.740 },
  "Nifas Silk-Lafto": {
    latitude: 8.955,
    longitude: 38.720,
  },
  "Kolfe Keranio": {
    latitude: 9.020,
    longitude: 38.690,
  },
  "Addis Ketema": {
    latitude: 9.030,
    longitude: 38.735,
  },
  "Akaki Kality": {
    latitude: 8.900,
    longitude: 38.770,
  },
};

export function getNeighbourhoodLocation(neighbourhood) {
  return (
    NEIGHBOURHOOD_LOCATIONS[neighbourhood] ??
    NEIGHBOURHOOD_LOCATIONS.Bole
  );
}