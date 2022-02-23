import { Server } from 'socket.io';
import { SocketBus } from './socket.bus';
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit {
  constructor(
    private readonly socketBus: SocketBus
  ) { }

  afterInit(server: Server) {
    this.socketBus.setServer(server)
  }
}