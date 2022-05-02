import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { Body, Controller, ForbiddenException, Post } from '@nestjs/common'
import { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from './auth.interface'

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

    @Post('refresh')
    public async refresh(@Body() body: RefreshRequest): Promise<RefreshResponse> {
        if (await this.service.validateAccessKey(body.refreshToken, body.userId) === false)
            throw new ForbiddenException('invalid refresh token')

        return {
            token: this.jwtService.sign({ userId: body.userId })
        }
    }
}