import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { Body, Controller, Post } from '@nestjs/common'
import { LoginRequest, LoginResponse } from './auth.interface'

@Controller('rpc/auth')
export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly jwtService: JwtService
    ) { }

    @Post('login')
    public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
        let response = await this.service.validateCredentials(body)

        response.token = this.jwtService.sign({ userId: response.userId })

        return response
    }
}