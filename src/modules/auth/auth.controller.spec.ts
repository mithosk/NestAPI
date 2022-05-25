import { JwtModule } from '@nestjs/jwt'
import { getConnection } from 'typeorm'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LogoutResponse } from './auth.interface'
import { AuthController } from './auth.controller'
import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { UserEntity } from '../../data/entities/user.entity'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserRepository } from '../../data/repositories/user.repository'

describe('AuthController', () => {
	let controller: AuthController
	let service: AuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService],
			imports: [
				TypeOrmModule.forFeature([UserRepository]),
				TypeOrmModule.forRoot({
					type: 'sqlite',
					database: 'sqlite/1dcc22fc-6dd8-41b8-88a0-39a119c129bf',
					entities: [UserEntity],
					synchronize: true,
					dropSchema: true
				}),
				ConfigModule.forRoot(),
				JwtModule.registerAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: (cso: ConfigService) => {
						return {
							secret: cso.get<string>('JWT_KEY'),
							signOptions: { expiresIn: 60 }
						}
					}
				})
			]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		service = module.get<AuthService>(AuthService)
	})

	afterEach(async () => {
		await getConnection().close()
	})

	describe('login', () => {
		it('creates a jwt token', async () => {
			jest.spyOn(service, 'validateCredentials').mockImplementation(() =>
				Promise.resolve({
					token: undefined,
					refreshToken: undefined,
					userId: '6577a9bd-877d-466e-aef5-158a0b8f7bd1'
				})
			)

			const response = await controller.login({
				email: undefined,
				password: undefined
			})

			expect(response.token).toBeDefined()
			expect(response.token.length).toBeGreaterThan(0)
		})

		it('returns refresh token and user id', async () => {
			const refreshToken = '2c20e0ba-0de7-434d-a620-92b6168d8b19'
			const userId = '1003ff3f-b1ab-4760-9de0-7d65064385d7'

			jest.spyOn(service, 'validateCredentials').mockImplementation(() =>
				Promise.resolve({
					token: undefined,
					refreshToken: refreshToken,
					userId: userId
				})
			)

			const response = await controller.login({
				email: undefined,
				password: undefined
			})

			expect(response.refreshToken).toEqual(refreshToken)
			expect(response.userId).toEqual(userId)
		})
	})

	describe('refresh', () => {
		it('creates a jwt token', async () => {
			jest.spyOn(service, 'validateAccessKey').mockImplementation(() => Promise.resolve(true))

			const response = await controller.refresh({
				userId: undefined,
				refreshToken: undefined
			})

			expect(response.token).toBeDefined()
			expect(response.token.length).toBeGreaterThan(0)
		})
	})

	describe('logout', () => {
		it('throws an exception when another user logout', async () => {
			jest.spyOn(service, 'resetAccessKey').mockImplementation()

			const logoutPromise = async (): Promise<LogoutResponse> =>
				await controller.logout(
					{
						userId: '37d3d432-db0c-42dc-a74e-86c276c3ebfd'
					},
					{
						user: {
							id: '8d257305-d385-4e16-9252-bfb59e4f2c64'
						}
					}
				)

			await expect(logoutPromise()).rejects.toThrow(ForbiddenException)
		})
	})
})
