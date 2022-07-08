import { v4 as uuidv4 } from 'uuid'
import { sha512 } from 'sha512-crypt-ts'
import { LoginRequest, LoginResponse } from './auth.interface'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserRepository } from '../../data/repositories/user.repository'

@Injectable()
export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	public async validateCredentials(credentials: LoginRequest): Promise<LoginResponse> {
		const user = await this.userRepository.findByEmail(credentials.email)
		if (user === undefined) throw new ForbiddenException('user not found')

		if (user.passwordHash !== sha512.hex(credentials.password)) throw new ForbiddenException('wrong password')

		if (user.accessKey === null) {
			user.accessKey = uuidv4()
			await this.userRepository.save(user)
		}

		return {
			token: undefined,
			refreshToken: user.accessKey,
			userId: user.uuid
		}
	}

	public async validateAccessKey(accessKey: string, userId: string): Promise<boolean> {
		const user = await this.userRepository.findByUuid(userId)

		return user !== undefined && user.accessKey === accessKey
	}

	public async resetAccessKey(userId: string): Promise<void> {
		const user = await this.userRepository.findByUuid(userId)
		if (user === undefined) throw new ForbiddenException('user not found')

		user.accessKey = null
		await this.userRepository.save(user)
	}
}
