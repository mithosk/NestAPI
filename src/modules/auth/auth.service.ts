import { v4 as uuidv4 } from 'uuid'
import { JwtService } from '@nestjs/jwt'
import { sha512 } from 'sha512-crypt-ts'
import { LoginRequest, LoginResponse } from './auth.interface'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserRepository } from 'src/data/repositories/user.repository'

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    public async createToken(credentials: LoginRequest): Promise<LoginResponse> {
        let user = await this.userRepository.findByEmail(credentials.email)
        if (user === undefined)
            throw new ForbiddenException('user not found')

        if (user.passwordHash !== sha512.hex(credentials.password))
            throw new ForbiddenException('wrong password')

        if (user.accessKey === null) {
            user.accessKey = uuidv4()
            await this.userRepository.save(user)
        }

        return {
            token: this.jwtService.sign({ userId: user.uuid }),
            refreshToken: user.accessKey,
            userId: user.uuid
        }
    }
}