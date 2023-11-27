import { io } from 'socket.io-client';
import settings from './settings';

const socket = io(settings.api.baseURL);

export const CheckAndReconnect = async () => {
    try {
      if (!socket.connected) {
        console.log('Connection lost, attempting to reconnect...');
        socket.connect();
        console.log('Reconnected to the server');
      } else {
        console.log('Connection maintained');
      }
    } catch (error) {
      console.error('Error during reconnection:', error);
    }
  };
  

setInterval(CheckAndReconnect, 5000);
