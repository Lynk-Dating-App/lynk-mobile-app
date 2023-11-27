import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Value stored successfully!');
  } catch (error) {
    console.error('Error storing value: ', error);
  }
};

export const retrieveData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // console.log('Retrieved value:', value);
      return value;
    } else {
      console.log('No data found for the key:', key);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving value: ', error);
  }
};

export const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Cleared all data successfully!');
    } catch (error) {
      console.error('Error clearing data: ', error);
    }
  };
  
export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Removed data for key:', key);
    } catch (error) {
        console.error('Error removing data: ', error);
    }
};

export const storeDataWithExpiration = async (key: string, value: any, expirationMinutes: number) => {
    const item = {
      value: value,
      expiry: new Date().getTime() + expirationMinutes * 60000, // in milliseconds
    };
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error storing value: ', error);
    }
};
  
export const retrieveDataWithExpiration = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const item = JSON.parse(value);
      if (new Date().getTime() > item.expiry) {
        await AsyncStorage.removeItem(key);
        console.log('Data expired and removed for key:', key);
        return null;
      }
      return item.value;
    } else {
      console.log('No data found for the key:', key);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving value: ', error);
  }
};

export const addDataToKey = async (key: string, newData: any) => {
  try {
    // Retrieve existing data from AsyncStorage
    const existingDataString = await AsyncStorage.getItem(key);

    let existingData = existingDataString ? JSON.parse(existingDataString) : [];

    if (!Array.isArray(existingData)) {
      existingData = [];
    }
    // Modify or append new data
    existingData.push(newData);

    // Save the updated data back to AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(existingData));

    console.log(`Data added to key ${key}:`, existingData);
  } catch (error) {
    console.error('Error adding data to AsyncStorage:', error);
  }
};

export const addArrDataToKey = async (key: string, newData: any) => {
  try {
    // Retrieve existing data from AsyncStorage
    const existingDataString = await AsyncStorage.getItem(key);
    let existingData = existingDataString ? JSON.parse(existingDataString) : [];

    if (!Array.isArray(existingData)) {
      existingData = [];
    }
    // Concatenate the new array with the existing array
    const updatedData = existingData.concat(newData && newData);

    // Save the updated data back to AsyncStorage
    await AsyncStorage.setItem(key, JSON.stringify(updatedData));

    console.log(`Data added to key ${key}:`, updatedData);
  } catch (error) {
    console.error('Error adding data to AsyncStorage:', error);
  }
};
