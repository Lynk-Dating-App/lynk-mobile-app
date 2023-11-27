

export function capitalizeEachWord(string: string) {
    return string ? string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') : string;
}

export function capitalizeFirstLetter(string: string) {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
}

export const extractFileNameFromUri = (uri: any) => {
    const uriComponents = uri.split('/');
    return uriComponents[uriComponents.length - 1];
};

export function wordBreaker(sentence: string, maxWords: number): string {
  const words = sentence?.split(' ');

  if (!words || words.length === 0) {
    return ''; // Return an empty string if there are no words
  }

  const resultWords = words.slice(0, maxWords);
  return resultWords.join(' ');
}

export const location_km = (userALat?: number, userALon?: number, userBLat?: number, userBLon?: number) => {
  const earthRadius = 6371;

  // Convert latitude and longitude to radians
  const userALatRadians = toRadians(userALat as number) as any;
  const userALonRadians = toRadians(userALon as number) as any;
  const userBLatRadians = toRadians(userBLat as number) as any;
  const userBLonRadians = toRadians(userBLon as number) as any;

  // Calculate the differences between the latitudes and longitudes
  const latDiff = userBLatRadians - userALatRadians;
  const lonDiff = userBLonRadians - userALonRadians;

  // Apply the Haversine formula
  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(userALatRadians) * Math.cos(userBLatRadians) * Math.sin(lonDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Calculate the distance
  const distance = earthRadius * c;

  return distance;
}

export const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
}

