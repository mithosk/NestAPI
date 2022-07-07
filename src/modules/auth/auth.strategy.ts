import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { HttpUser } from 'src/definitions/http-user.definition'

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_KEY'),
			ignoreExpiration: false
		})
	}

	public async validate(user: HttpUser): Promise<HttpUser> {
		return {
			id: user.id
		}
	}
}
