import { Server } from 'socket.io'
import { ProductBus } from './product.bus'
import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets'

@WebSocketGateway({ namespace: "products" })
export class ProductGateway implements OnGatewayInit {
  constructor(
    private readonly socketBus: ProductBus
  ) { }

  afterInit(server: Server) {
    this.socketBus.setServer(server)
  }
}