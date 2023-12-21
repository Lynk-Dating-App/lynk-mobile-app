import moment from 'moment';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { Alert } from 'react-native';

export const alertComponent = (title: string, mess: string, btnTxt: string, btnFunc: any) => {
  return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc
      }
  ]);
};

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

export function characterBreaker(sentence: string, maxWords: number): string {
  const words = sentence?.split('');

  if (!words || words.length === 0) {
    return ''; // Return an empty string if there are no words
  }

  const resultWords = words.slice(0, maxWords);
  return resultWords.join('');
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

export const fetchImageFromUri = async (uri: any) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

export const resizeImage = async (
  uri: any, maxWidth: number, maxHeight: number, format: any, quality: number, 
  rotation?: number, outputPath?: any, keepMeta?: boolean,
) => {
  return new Promise((resolve, reject) => {
    ImageResizer.createResizedImage(uri, maxWidth, maxHeight, format, quality, rotation = 0, outputPath, keepMeta = false )
      .then((resizedImageUri) => {
        resolve(resizedImageUri);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const toRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
}

export const dateDifference = (date: any) => {
  const targetDate = moment(date);
  const currentDate = moment();

  const minutesDifference = currentDate.diff(targetDate, 'minutes');

  let result: any;
  if (minutesDifference < 60) {
    result = `${minutesDifference} min`;
  } else if (minutesDifference < 24 * 60) {
    const hoursDifference = Math.floor(minutesDifference / 60);
    result = hoursDifference === 1 ? `${hoursDifference} hour` : `${hoursDifference} hours`;
  } else if (minutesDifference < 48 * 60) {
    result = 'Yesterday';
  } else {
    result = targetDate.format('DD/MM/YYYY');
  }

  return result;

}