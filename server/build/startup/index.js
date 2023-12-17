"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const dataStore_1 = __importDefault(require("../config/dataStore"));
const CommandLineRunner_1 = __importDefault(require("../helpers/CommandLineRunner"));
const constants_1 = require("../config/constants");
const CronJob_1 = __importDefault(require("../helpers/CronJob"));
const agenda_1 = require("agenda");
const AppLogger_1 = __importDefault(require("../utils/AppLogger"));
// import { QueueManager } from 'rabbitmq-email-manager';
// import queue from '../config/queue';
const logger = AppLogger_1.default.init('mongoDb').logger;
async function startup() {
    dataStore_1.default.init();
    await database_1.default.mongodb();
    await CommandLineRunner_1.default.run();
    logger.info('MongoDB Connected Successfully');
    const agenda = new agenda_1.Agenda({
        db: {
            address: database_1.default.mongoUrl,
            collection: constants_1.AGENDA_COLLECTION_NAME,
        },
    });
    agenda.define('userIsExpired', { concurrency: 1 }, async (job) => {
        await CronJob_1.default.userIsExpired();
    });
    await agenda.start();
    await agenda.every('0 0 * * *', 'userIsExpired');
    //will use this along side nodemailer when i want to send email
    // await QueueManager.init({
    //   queueClient: queue.client,
    //   queue: QUEUE_EVENTS.name,
    // });
}
exports.default = startup;
