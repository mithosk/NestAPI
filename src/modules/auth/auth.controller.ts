import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { Body, Controller, ForbiddenException, Post, UseGuards, Request } from '@nestjs/common'
import { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse, LogoutRequest, LogoutResponse } from './auth.interface'

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

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    public async logout(@Body() body: LogoutRequest, @Request() request: any): Promise<LogoutResponse> {
        if (body.userId !== request.user.id)
            throw new ForbiddenException('another user cannot be logged out')

        await this.service.resetAccessKey(body.userId)

        return {}
    }
}