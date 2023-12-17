"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const startup_1 = __importDefault(require("./startup"));
const AppLogger_1 = __importDefault(require("./utils/AppLogger"));
const RabbitMqService_1 = __importDefault(require("./services/RabbitMqService"));
const rabbitMqService = new RabbitMqService_1.default();
const logger = AppLogger_1.default.init('server').logger;
const port = process.env.PORT || 5010;
const server = http_1.default.createServer(app_1.default);
async function startRabbitMqService() {
    try {
        await rabbitMqService.connectToRabbitMQ();
        rabbitMqService.setupSocketIO(server);
        server.listen(port, () => logger.info(`Server running on port: ${port}`));
    }
    catch (error) {
        console.error('Error setting up RabbitMQ and Socket.IO:', error);
    }
}
async function startServer() {
    try {
        await (0, startup_1.default)();
        await startRabbitMqService();
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
}
startServer();
