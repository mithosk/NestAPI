import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { AuthGuard } from '@nestjs/passport'
import { HttpUser } from '../../common/http-user.common'
import { HttpRequest } from '../../common/http-request.common'
import { Body, Controller, ForbiddenException, Post, UseGuards, Request, HttpCode } from '@nestjs/common'
import {
	LoginRequest,
	LoginResponse,
	RefreshRequest,
	RefreshResponse,
	LogoutRequest,
	LogoutResponse
} from './auth.interface'

@Controller('rpc/auth')
export class AuthController {
	constructor(private readonly service: AuthService, private readonly jwtService: JwtService) {}

	@Post('login')
	@HttpCode(200)
	public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
		const response = await this.service.validateCredentials(body)

		response.token = this.jwtService.sign({ id: response.userId })

		return response
	}

	@HttpCode(200)
	@Post('refresh')
	public async refresh(@Body() body: RefreshRequest): Promise<RefreshResponse> {
		if ((await this.service.validateAccessKey(body.refreshToken, body.userId)) === false)
			throw new ForbiddenException('a token could not be generated')

		return {
			token: this.jwtService.sign(<HttpUser>{ id: body.userId })
		}
	}

	@HttpCode(200)
	@Post('logout')
	@UseGuards(AuthGuard('jwt'))
	public async logout(@Body() body: LogoutRequest, @Request() request: HttpRequest): Promise<LogoutResponse> {
		if (body.userId !== request.user.id) throw new ForbiddenException('another user cannot be logged out')

		await this.service.resetAccessKey(body.userId)

		return {}
	}
}
