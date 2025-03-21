import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketsGateway {
  private readonly logger = new Logger(WebsocketsGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: any) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit a user operation event to all connected clients
   * @param username The username of the user who performed the operation
   * @param operation The operation performed (create, update, delete)
   */
  emitUserOperation(username: string, operation: string) {
    this.server.emit('userOperation', {
      message: `${username} realizó una operación de ${operation}`,
      timestamp: new Date().toISOString(),
    });
  }
}