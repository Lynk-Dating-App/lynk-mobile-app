import * as SecureStore from 'expo-secure-store';

// Save token to SecureStore
export const saveTokenToSecureStore = async (key: string, token: string) => {
  await SecureStore.setItemAsync(key, token);
};

// Retrieve token from SecureStore
export const getTokenFromSecureStore = async (key: string) => {
  const token = await SecureStore.getItemAsync(key);
  return token;
};

// Remove token from SecureStore
export const removeTokenFromSecureStore = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};

// Save array to SecureStore
export const saveArrayToSecureStore = async (key: string, arrayToSave: any[]) => {
  try {
    // Convert the array to a JSON string
    const arrayString = JSON.stringify(arrayToSave);
    
    // Save the JSON string to SecureStore
    await SecureStore.setItemAsync(key, arrayString);
  } catch (error) {
    console.error('Error saving array to SecureStore:', error);
  }
};

export const saveToArraySecureStore = async (key: string, data: string) => {
  try {
    // Retrieve the current array from SecureStore
    const existingArrayString = await SecureStore.getItemAsync(key);
    let arr = existingArrayString ? JSON.parse(existingArrayString) : [];

    // Add new data to the array
    if (data !== "") {
      arr.push(data);

      // Convert the updated array to a JSON string
      const updatedArrayString = JSON.stringify(arr);

      // Save the updated array to SecureStore
      await SecureStore.setItemAsync(key, updatedArrayString);
    }
  } catch (error) {
    console.error('Error saving array to SecureStore:', error);
    // Handle the error according to your application's requirements
  }
};


// Retrieve array from SecureStore
export const getArrayFromSecureStore = async (key: string) => {
  try {
    // Retrieve the JSON string from SecureStore
    const arrayString = await SecureStore.getItemAsync(key);

    if (arrayString) {
      // Convert the JSON string back to an array
      return JSON.parse(arrayString);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving array from SecureStore:', error);
    return null;
  }
};

// Push new items to the array in SecureStore
export const pushItemsToArrayInSecureStore = async (key: string, newItems: any[]) => {
  try {
    // Retrieve the current array from SecureStore
    const currentArray = await getArrayFromSecureStore(key);

    // If the array exists, push the new items
    if (currentArray) {
      currentArray.push(...newItems);

      // Save the updated array back to SecureStore
      await saveArrayToSecureStore(key, currentArray);
    } else {
      console.error(`Array with key '${key}' not found in SecureStore`);
    }
  } catch (error) {
    console.error('Error pushing items to array in SecureStore:', error);
  }
};


