import http from 'http';
import 'dotenv/config';
import app from './app';
import startup from './startup';
import AppLogger from './utils/AppLogger';
import RabbitMqService from './services/RabbitMqService';

const rabbitMqService = new RabbitMqService();

const logger = AppLogger.init('server').logger;
const port = process.env.PORT || 5010;

const server = http.createServer(app);

async function startRabbitMqService() {
  try {
    await rabbitMqService.connectToRabbitMQ();
    rabbitMqService.setupSocketIO(server);
    server.listen(port, () => logger.info(`Server running on port: ${port}`));
  } catch (error) {
    console.error('Error setting up RabbitMQ and Socket.IO:', error);
  }
}

async function startServer() {
  try {
    await startup();
    await startRabbitMqService();
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();