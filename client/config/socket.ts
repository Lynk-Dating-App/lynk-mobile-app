import { io } from 'socket.io-client';
import settings from './settings';
import { decode as base64Decode } from 'base-64';
import { getTokenFromSecureStore } from '../components/ExpoStore/SecureStore';

const BACKGROUND_SOCKET_TASK = 'socket-io-background-task';

const socket = io(settings.api.baseURL);

const connectToServer = async () => {
  try {
    console.log('Connecting to the server...');
    const data = await getTokenFromSecureStore(settings.auth.admin);
    
    if (data) {
      const payloadBase64 = data.split('.')[1];
      const decodedPayload = base64Decode(payloadBase64);
      const decodedPayloadJSON = JSON.parse(decodedPayload);

      if (decodedPayloadJSON && decodedPayloadJSON.userId) {
        console.log('Connected to the server');
        socket.emit('userId', decodedPayloadJSON.userId);
      } else {
        console.error('Invalid or missing userId in decoded payload');
      }
    } else {
      console.error('Failed to retrieve token from secure store');
    }
  } catch (error) {
    console.error('Error connecting to the server:', error);
  }
};

socket.on('connect', connectToServer);

socket.on('message', (message) => {
  console.log('Received message:', message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

export default socket;
