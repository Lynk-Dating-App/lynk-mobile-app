import { Server as SocketServer } from 'socket.io';
import database from '../config/database';
import dataStore from '../config/dataStore';
import CommandLineRunner from '../helpers/CommandLineRunner';
import { AGENDA_COLLECTION_NAME } from '../config/constants';
import CronJob from '../helpers/CronJob';
import { Agenda } from 'agenda';
import AppLogger from '../utils/AppLogger';
// import { QueueManager } from 'rabbitmq-email-manager';
// import queue from '../config/queue';

const logger = AppLogger.init('mongoDb').logger;

export default async function startup() {
  dataStore.init();
  await database.mongodb();
  await CommandLineRunner.run();
  logger.info('MongoDB Connected Successfully');

  const agenda = new Agenda({
    db: {
      address: database.mongoUrl,
      collection: AGENDA_COLLECTION_NAME,
    },
  });

  agenda.define('userIsExpired', { concurrency: 1 }, async (job: any) => {
    await CronJob.userIsExpired()
  });

  await agenda.start();
  await agenda.every('0 0 * * *', 'userIsExpired');
  // await agenda.every('10 1 * * *', 'userIsExpired'); // 1:10am

  //will use this along side nodemailer when i want to send email
  // await QueueManager.init({
  //   queueClient: queue.client,
  //   queue: QUEUE_EVENTS.name,
  // });

}
