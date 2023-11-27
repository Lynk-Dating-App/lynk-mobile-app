import axios from 'axios';
import settings from './settings';
import { getTokenFromSecureStore } from '../components/ExpoStore/SecureStore';

axios.defaults.baseURL = settings.api.baseURL;
axios.interceptors.request.use(async (config: any) => {
  const token = await getTokenFromSecureStore(settings.auth.admin)

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  }
});

export default axios;

