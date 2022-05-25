import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthStrategy } from './auth.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserRepository } from 'src/data/repositories/user.repository'

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthStrategy],
	imports: [
		ConfigModule.forRoot(),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (cso: ConfigService) => {
				return {
					secret: cso.get<string>('JWT_KEY'),
					signOptions: { expiresIn: 28800 }
				}
			}
		}),
		TypeOrmModule.forFeature([UserRepository])
	]
})
export class AuthModule {}
