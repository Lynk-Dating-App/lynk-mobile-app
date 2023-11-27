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
