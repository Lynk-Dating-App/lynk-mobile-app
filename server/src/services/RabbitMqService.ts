import amqp, { Connection, Channel, Message } from 'amqplib';
import { Server, Socket } from 'socket.io';
import settings from '../config/settings';
import { corsOptions } from '../app';
import AppLogger from '../utils/AppLogger';
import CustomAPIError from '../exceptions/CustomAPIError';
import HttpStatus from '../helpers/HttpStatus';
import datasources from  './dao';
import { INotificationModel } from '../models/Notification';
import { IChatMessageModel } from '../models/ChatMessages';

const logger = AppLogger.init('server').logger;

class RabbitMqService {
  private connection: Connection | null;
  private channel: Channel | null;
  private io: Server<any, any, any, any> | null;
  private socketMap: Map<any, Socket>;
  private onlineUsers: any[];

  constructor() {
    this.connection = null;
    this.channel = null;
    this.io = null;
    this.socketMap = new Map<any, Socket>();
    this.onlineUsers = [];
  }

  async connectToRabbitMQ(): Promise<void> {
    this.connection = await amqp.connect(settings.rabbitMq.connection);
    this.channel = await this.connection.createChannel();
    await this.consumeMessagesFromRabbitMQ('chat');
    await this.consumePrivateMessagesFromRabbitMQ();
    await this.consumeLikeDislikeActionsFromRabbitMQ();
  }

  async disconnectFromRabbitMQ(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  async sendMessageToRabbitMQ(queue: string, message: string): Promise<void> {
    try {
      if (this.channel) {
        this.channel.sendToQueue(queue, Buffer.from(message));
      } else {
        throw new CustomAPIError('RabbitMQ channel is not available', HttpStatus.INTERNAL_SERVER_ERROR.code);
      }
    } catch (error) {
      throw new CustomAPIError('Error while sending message to RabbitMQ', HttpStatus.INTERNAL_SERVER_ERROR.code);
    }
  }

  async consumeMessagesFromRabbitMQ(queue: string): Promise<void> {
    if (this.channel) {
      this.channel.assertQueue(queue);
      this.channel.consume(queue, (msg: Message | null) => {
        if (msg) {
          // Broadcast the received message to all connected clients via Socket.io
          this.io?.emit('chat message', msg.content.toString());
          this.channel!.ack(msg);
        }
      });
    } else {
      throw new CustomAPIError('RabbitMQ channel is not available', HttpStatus.INTERNAL_SERVER_ERROR.code);
    }
  }

  async sendMessageToUser(
    senderId: any, receiverId: any, 
    message: string, 
    chatId: string
    ) {

    await datasources.chatMessageDAOService.create({
      chatId,
      senderId,
      message
    } as IChatMessageModel);

    this.io?.to(senderId).emit('messageSentAck', 'message sent');

    if (receiverId) {
      const targetSocketRooms = this.io?.sockets.adapter.rooms.get(receiverId);
      if (targetSocketRooms) {
        this.io?.to(receiverId).emit('receivePrivateMessage', { senderId, message });
      } else {
        await this.sendMessageToRabbitMQ('privateMessages', JSON.stringify({ senderId, message }));
      }
    } else {
      console.log('Invalid target user ID provided.');
    }

  }

  async consumePrivateMessagesFromRabbitMQ(): Promise<void> {
    if (this.channel) {
      this.channel.assertQueue('privateMessages');
      this.channel.consume('privateMessages', (msg) => {
        if (msg) {
          const { senderId, receiverId, message } = JSON.parse(msg.content.toString());
          const receiverSocket = this.socketMap.get(receiverId);

          if (receiverSocket) {
            receiverSocket.emit('privateMessage', { senderId, message });
          }
          this.channel!.ack(msg);
        }
      }, { noAck: false });
    } else {
      throw new CustomAPIError('RabbitMQ channel is not available', HttpStatus.INTERNAL_SERVER_ERROR.code);
    }
  }
  
  async handleLikeDislike(data: any) {
    // Assume 'action' can be 'like' or 'dislike'
    await datasources.notificationDAOService.create({
      notification: data.message,
      status: false,
      user: data.toUserId,
      senderId: data.fromUserId,
      image: data.photo,
      name: data.name,
      age: data.age
    } as INotificationModel)
    if (data.toUserId) {
      const targetSocketRooms = this.io?.sockets.adapter.rooms.get(data.toUserId);
      if (targetSocketRooms) {
        this.io?.to(data.toUserId).emit('likeDislike', data);
      } else {
        await this.sendMessageToRabbitMQ('likeDislikeActions', JSON.stringify(data));
      }
    } else {
      console.log('Invalid target user ID provided.');
    }
  }

  async consumeLikeDislikeActionsFromRabbitMQ() {
    if (this.channel) {
      this.channel.assertQueue('likeDislikeActions');
      this.channel.consume('likeDislikeActions', (msg) => {
        if (msg) {
          const { toUserId } = JSON.parse(msg.content.toString());
          console.log(toUserId, 'user id')
          const targetSocketRooms = this.io?.sockets.adapter.rooms.get(toUserId);
          console.log(targetSocketRooms, 'room')
          if (targetSocketRooms) {
            this.io?.to(toUserId).emit('likeDislike', JSON.parse(msg.content.toString()));
            // toUserSocket.emit('likeDislike', { fromUserId, action });
          }

          this.channel!.ack(msg);
        }
      }, { noAck: false }); // Set options with noAck: false for manual message acknowledgment
    } else {
      throw new CustomAPIError('RabbitMQ channel is not available', HttpStatus.INTERNAL_SERVER_ERROR.code);
    }
  }
 
  setupSocketIO(server: any): void {
    this.io = new Server(server, {
      cors: corsOptions
    });

  this.io.on('connection', (socket: Socket<any, any, any, any>) => {
    console.log(`Client connected. ${socket.id}`);
    logger.info(socket.id);
  
    socket.on('userId', (userId: any) => {
      if (userId) {
        if(!this.onlineUsers.some(user => user.userId === userId)) {
          this.onlineUsers.push({
            userId,
            socketId: socket.id
          })
        }
        socket.join(userId);
        console.log(`Socket joined room for userId: ${userId}`);
        console.log(`Online users: ${JSON.stringify(this.onlineUsers)}`);
      } else {
        console.log('Invalid or disconnected socket.');
      }

      socket.emit("getOnlineUsers", this.onlineUsers);
    });
  
    socket.on('liked', (data: any) => {
      const _data = JSON.parse(data);

      const payload = {
        ..._data,
        message: _data.action === 'like' 
          ? `${_data.name} liked your profile.`
          : `${_data.name} unliked your profile.`
      }
   
      this.handleLikeDislike(payload);
    });

    // Sending a private message to another user
    socket.on('sendPrivateMessage', (data: any) => {
      const { senderId, receiverId, message, chatId } = data;

      this.sendMessageToUser(senderId, receiverId, message, chatId)
      
      // Emit the private message to the receiver's room
      // io.to(receiverId).emit('receivePrivateMessage', { senderId, message });
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected.');
      logger.info(`Client with id ${socket.id} disconnected`);

      this.onlineUsers = this.onlineUsers.filter(user => user.socketId !== socket.id)
      console.log(this.onlineUsers, 'online')
      socket.emit("getOnlineUsers", this.onlineUsers);
      // Handle socket disconnection and leave rooms if needed
      //socket.leaveAll(); // Leave all rooms this socket was a part of
    });
  
  });
  

  }
  
}


export default RabbitMqService;
