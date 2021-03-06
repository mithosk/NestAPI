import { Server } from 'socket.io'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProductBus {
	private server: Server

	public setServer(server: Server): void {
		this.server = server
	}

	public notify<T>(event: string, message: T): void {
		this.server.emit(event, message)
	}
}
