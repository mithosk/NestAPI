import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginRequest {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	password: string
}

export interface LoginResponse {
	token: string
	refreshToken: string
	userId: string
}

export class RefreshRequest {
	@IsString()
	@IsNotEmpty()
	userId: string

	@IsString()
	@IsNotEmpty()
	refreshToken: string
}

export class RefreshResponse {
	token: string
}

export class LogoutRequest {
	@IsString()
	@IsNotEmpty()
	userId: string
}

export class LogoutResponse {}
