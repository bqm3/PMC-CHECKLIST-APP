function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180; // Convert latitude 1 from degrees to radians
  const φ2 = (lat2 * Math.PI) / 180; // Convert latitude 2 from degrees to radians
  const Δφ = ((lat2 - lat1) * Math.PI) / 180; // Calculate difference in latitude
  const Δλ = ((lon2 - lon1) * Math.PI) / 180; // Calculate difference in longitude

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
}

function areLocationsWithinRadius(lat1, lon1, lat2, lon2, radius) {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radius;
}


module.exports ={
    areLocationsWithinRadius
}
