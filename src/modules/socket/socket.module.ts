import { SocketBus } from './socket.bus';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
    controllers: [],
    providers: [SocketBus]
})

export class SocketModule { }